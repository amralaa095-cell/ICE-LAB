/**
 * ICE Lab · INTAKE script (bound to the "ICE Lab bookings" Google Sheet).
 * Deploy as a Web app: Execute as = Me (the lab account), Who has access = Anyone.
 *
 * - receives booking requests from the website (doPost) and writes them to the "Requests" sheet
 * - emails the supervisor (Approve / Decline links), the student (receipt) and the lab
 * - records the supervisor's decision and emails the student
 * - serves the equipment status list to the website (?api=equipment) so out-of-service items cannot be booked
 *
 * Run setup() once from the editor after pasting this file.
 */
const LAB_EMAIL = 'PUT-THE-LAB-EMAIL-HERE';
const LAB_NAME = 'ICE Lab · American University of Bahrain';

const REQ = 'Requests', EQ = 'Equipment', CFG = 'Config';
const COLS = [
  ['Reference', 'ref'], ['Received', '_received'], ['Status', '_status'], ['Lab', 'lab'], ['Request', 'type'], ['Code', 'code'], ['Equipment or room', 'item'],
  ['Date', 'date'], ['Start', 'start'], ['End', 'end'], ['Borrow from', 'from'], ['Return by', 'to'], ['Hours', 'hours'], ['Days', 'days'], ['Attendees', 'att'],
  ['Name', 'name'], ['Role', 'role'], ['ID', 'sid'], ['Email', 'email'], ['Department', 'dept'], ['Course code', 'courseCode'], ['Course or project', 'course'],
  ['Description', 'desc'], ['Supervisor', 'sup'], ['Supervisor email', 'supEmail'], ['PPE', 'ppe'], ['Decided', '_decided'], ['Lab note', '_note'], ['Token', '_token']];
const C_ = name => COLS.findIndex(c => c[0] === name) + 1;
const STATUSES = ['Pending supervisor', 'Approved by supervisor', 'Declined by supervisor', 'Confirmed by lab', 'Completed', 'No-show', 'Cancelled'];
const EQ_STATUSES = ['Operational', 'Under maintenance', 'Out of service'];
const EQUIPMENT = [["M-01", "UNIMAT ML Technics", "Manufacturing Lab"], ["M-02", "Pearl / center drilling machine (Metal Line)", "Manufacturing Lab"], ["M-03", "Horizontal milling machine (Metal Line)", "Manufacturing Lab"], ["M-04", "Vertical mill ML with vice", "Manufacturing Lab"], ["M-05", "6-axis mill ML", "Manufacturing Lab"], ["M-06", "Metal lathe with power motor", "Manufacturing Lab"], ["M-07", "UNIMAT CNC 3-axis mill (extended, SC spindle)", "Manufacturing Lab"], ["M-08", "UNIMAT CNC lathe", "Manufacturing Lab"], ["M-09", "UNIMAT CNC 4-axis turn-mill", "Manufacturing Lab"], ["M-10", "UNI-LASER 3-axis laser (enclosed)", "Manufacturing Lab"], ["M-11", "UNIMAT CNC hot wire cutter 3D", "Manufacturing Lab"], ["01", "METCO Bainpol Auto — Automated Polishing Machine", "ICE Lab"], ["02", "METCO Bainmount Twin H Auto — Specimen Mounting Press", "ICE Lab"], ["03", "Vickers / Microhardness Testing System", "ICE Lab"], ["04", "METCO Metallographic Abrasive Cutting Machine", "ICE Lab"], ["06", "Haver EML Digital Plus Sieve Shaker", "ICE Lab"], ["07", "Direct Shear Testing Machine", "ICE Lab"], ["08", "MTS Universal Testing Machine", "ICE Lab"], ["09", "Pendulum Impact Testing Machine (Charpy / Izod)", "ICE Lab"], ["10", "Torsion Test Apparatus", "ICE Lab"], ["11", "Rotating Fatigue Testing Machine", "ICE Lab"], ["12", "Forces in a Truss Apparatus", "ICE Lab"], ["13", "Bending Stress in a Beam Apparatus", "ICE Lab"], ["14", "Buckling Test Apparatus", "ICE Lab"], ["15", "Beam Apparatus", "ICE Lab"], ["16", "Pin-Jointed Frameworks Apparatus", "ICE Lab"], ["18", "Thermal Power Plant with Steam Turbine", "ICE Lab"], ["19", "Refrigeration / Heat Pump Training System", "ICE Lab"], ["20", "Heat Exchanger Service Module", "ICE Lab"], ["21", "Heat Transfer Experiment Base Unit", "ICE Lab"], ["22", "Matrix Wind Tunnel", "ICE Lab"], ["23", "TecQuipment CE111 PLC Process Trainer", "ICE Lab"], ["25", "TecQuipment CE117 Process Trainer", "ICE Lab"], ["26", "Series and Parallel Pumps Apparatus", "ICE Lab"], ["27", "TecQuipment H16 — Losses in Pipe Systems", "ICE Lab"], ["28", "Hydrostatics and Properties of Fluids Apparatus", "ICE Lab"], ["29", "Centre of Pressure Apparatus", "ICE Lab"], ["30", "Flow Measurement / Multi-Tube Manometer Apparatus", "ICE Lab"], ["31", "Rotor Dynamics / Balancing Training Rig", "ICE Lab"], ["32", "Free and Forced Vibration Apparatus", "ICE Lab"], ["ES1-1", "ES1 Work Panel (panel 1 of 3)", "ICE Lab"], ["ES1-2", "ES1 Work Panel (panel 2 of 3)", "ICE Lab"], ["ES1-3", "ES1 Work Panel (panel 3 of 3)", "ICE Lab"], ["ES2", "ES2 Forces Kit", "ICE Lab"], ["ES3", "ES3 Moments Kit", "ICE Lab"], ["ES4", "ES4 Deflection of Beams and Cantilevers Kit", "ICE Lab"], ["ES5", "ES5 Torsion of Circular Sections Kit", "ICE Lab"], ["ES6", "ES6 Tensile Tester Kit", "ICE Lab"], ["ES7", "ES7 Simple Harmonic Motion Kit", "ICE Lab"], ["ES8", "ES8 Friction and Inclined Plane Kit", "ICE Lab"], ["ES9", "ES9 Potential and Kinetic Energy Kit", "ICE Lab"], ["ES10", "ES10 Pulley Kit", "ICE Lab"], ["ES11", "ES11 Drive Systems Kit", "ICE Lab"], ["ES12", "ES12 Cam, Crank and Toggle Kit", "ICE Lab"], ["ES13", "ES13 Gear Trains Kit", "ICE Lab"], ["ES14", "ES14 Simple Mechanisms Kit", "ICE Lab"], ["ES15", "ES15 Bar Linkages Kit", "ICE Lab"], ["ES16", "ES16 Centrifugal Force Kit", "ICE Lab"], ["ES17", "ES17 Rotational Friction Kit", "ICE Lab"], ["ES18", "ES18 Additional Mechanisms Kit", "ICE Lab"], ["ES19", "ES19 Spring Tester Kit", "ICE Lab"], ["Classroom 1", "Classroom 1", "ICE Lab"], ["Classroom 2", "Classroom 2", "ICE Lab"]];

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let r = ss.getSheetByName(REQ);
  if (!r) { r = ss.insertSheet(REQ); r.appendRow(COLS.map(c => c[0])); r.setFrozenRows(1); r.getRange(1, 1, 1, COLS.length).setFontWeight('bold'); }
  r.getRange(2, C_('Status'), 2000, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build());
  let e = ss.getSheetByName(EQ);
  if (!e) {
    e = ss.insertSheet(EQ); e.appendRow(['Code', 'Name', 'Lab', 'Status', 'Note', 'Updated']); e.setFrozenRows(1); e.getRange(1, 1, 1, 6).setFontWeight('bold');
    e.getRange(2, 1, EQUIPMENT.length, 6).setValues(EQUIPMENT.map(x => [x[0], x[1], x[2], 'Operational', '', new Date()]));
  }
  e.getRange(2, 4, 500, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(EQ_STATUSES, true).build());
  let c = ss.getSheetByName(CFG);
  if (!c) {
    c = ss.insertSheet(CFG);
    c.getRange(1, 1, 4, 2).setValues([['Setting', 'Value'], ['Admins (can edit in the dashboard)', Session.getEffectiveUser().getEmail()], ['Lab email', LAB_EMAIL], ['Note', 'Viewers = people this sheet is shared with as Viewer. Admins must also be Editors of this sheet.']]);
    c.getRange(1, 1, 1, 2).setFontWeight('bold'); c.setColumnWidth(1, 280); c.setColumnWidth(2, 420);
  }
}

const clean_ = v => String(v == null ? '' : v).slice(0, 2000);
const valid_ = e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e || '');
const esc_ = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SHOW = [['Lab', 'lab'], ['Request', 'type'], ['Equipment or room', 'item'], ['When', 'when'], ['Name', 'name'], ['Role', 'role'], ['ID', 'sid'], ['Email', 'email'],
  ['Department', 'dept'], ['Course', 'courseCode'], ['Description', 'desc'], ['Supervisor', 'sup'], ['PPE', 'ppe']];
function table_(r) {
  return '<table cellpadding="6" style="border-collapse:collapse;font:14px Arial">' + SHOW.filter(x => r[x[1]]).map(x =>
    '<tr><td style="color:#555;border-bottom:1px solid #ddd">' + x[0] + '</td><td style="border-bottom:1px solid #ddd">' + esc_(r[x[1]]) + '</td></tr>').join('') + '</table>';
}

function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const r = JSON.parse(e.postData.contents);
    Object.keys(r).forEach(k => r[k] = clean_(r[k]));
    if (!r.ref || !r.name || !valid_(r.email) || !valid_(r.supEmail)) return ContentService.createTextOutput('rejected');
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REQ);
    if (sh.createTextFinder(r.ref).matchEntireCell(true).findNext()) return ContentService.createTextOutput('duplicate');
    const token = Utilities.getUuid();
    const extra = { _received: new Date(), _status: 'Pending supervisor', _decided: '', _note: '', _token: token };
    sh.appendRow(COLS.map(c => c[1] in extra ? extra[c[1]] : (r[c[1]] || '')));
    const url = ScriptApp.getService().getUrl();
    const link = a => url + '?ref=' + encodeURIComponent(r.ref) + '&t=' + token + '&a=' + a;
    MailApp.sendEmail({ to: r.supEmail, replyTo: r.email, name: LAB_NAME, subject: 'Approve lab request ' + r.ref + ' from ' + r.name,
      htmlBody: '<p>' + esc_(r.name) + ' asked to use the lab and named you as supervisor.</p>' + table_(r) +
        '<p><a href="' + link('approve') + '" style="background:#1f7a3a;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px">Approve</a> &nbsp; ' +
        '<a href="' + link('decline') + '" style="background:#9b1c2c;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px">Decline</a></p>' });
    MailApp.sendEmail({ to: LAB_EMAIL, replyTo: r.email, name: LAB_NAME, subject: 'New lab request ' + r.ref + ' · ' + r.item, htmlBody: '<p>New request (waiting for the supervisor).</p>' + table_(r) });
    MailApp.sendEmail({ to: r.email, name: LAB_NAME, subject: 'We received your lab request ' + r.ref,
      htmlBody: '<p>Hello ' + esc_(r.name) + ',</p><p>Your request was received and sent to your supervisor for approval. You will get the decision by email.</p>' + table_(r) });
    return ContentService.createTextOutput('ok');
  } finally { lock.releaseLock(); }
}

function doGet(e) {
  const p = e.parameter || {};
  if (p.api === 'equipment') {
    const v = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(EQ).getDataRange().getValues().slice(1);
    return ContentService.createTextOutput(JSON.stringify(v.map(x => ({ code: x[0], name: x[1], lab: x[2], status: x[3], note: x[4] })))).setMimeType(ContentService.MimeType.JSON);
  }
  if (!p.ref || !p.t || !/^(approve|decline)$/.test(p.a || '')) return HtmlService.createHtmlOutput('<p>ICE Lab booking service is running.</p>');
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REQ);
  const cell = sh.createTextFinder(p.ref).matchEntireCell(true).findNext();
  if (!cell) return HtmlService.createHtmlOutput('<p>Request not found.</p>');
  const row = cell.getRow(); const vals = sh.getRange(row, 1, 1, COLS.length).getValues()[0];
  if (vals[C_('Token') - 1] !== p.t) return HtmlService.createHtmlOutput('<p>This link is not valid.</p>');
  if (vals[C_('Status') - 1] !== 'Pending supervisor') return HtmlService.createHtmlOutput('<p>This request was already ' + esc_(String(vals[C_('Status') - 1]).toLowerCase()) + '.</p>');
  const status = p.a === 'approve' ? 'Approved by supervisor' : 'Declined by supervisor';
  sh.getRange(row, C_('Status')).setValue(status); sh.getRange(row, C_('Decided')).setValue(new Date());
  const r = {}; COLS.forEach((c, i) => r[c[1]] = vals[i]);
  r.when = r.date ? r.date + ' ' + r.start + '–' + r.end : r.from + ' to ' + r.to;
  MailApp.sendEmail({ to: r.email, cc: LAB_EMAIL, name: LAB_NAME, subject: 'Lab request ' + r.ref + ': ' + (p.a === 'approve' ? 'approved' : 'declined'),
    htmlBody: '<p>Hello ' + esc_(r.name) + ',</p><p>Your supervisor <b>' + (p.a === 'approve' ? 'approved' : 'declined') + '</b> request ' + esc_(r.ref) + '.' +
      (p.a === 'approve' ? ' The lab team will confirm the slot. Bring your ID and the required PPE.' : '') + '</p>' + table_(r) });
  return HtmlService.createHtmlOutput('<p style="font:16px Arial">Thank you. Request ' + esc_(r.ref) + ' is now <b>' + status.toLowerCase() + '</b>. The student and the lab were emailed.</p>');
}
