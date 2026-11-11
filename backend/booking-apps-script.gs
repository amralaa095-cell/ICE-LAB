/**
 * ICE Lab booking backend (Google Apps Script, free).
 * Every request from the website becomes a row in the Google Sheet this script is attached to,
 * the lab gets an email, the supervisor gets an email with Approve / Decline links,
 * and the requester gets a receipt and later the decision.
 *
 * Setup: see backend/README.md.
 */
const LAB_EMAIL = 'PUT-THE-LAB-EMAIL-HERE';   // the lab inbox that receives every request
const LAB_NAME = 'ICE Lab · American University of Bahrain';
const SHEET = 'Requests';
const COLS = ['Reference', 'Received', 'Status', 'Lab', 'Request', 'Equipment or room', 'When', 'Attendees', 'Name', 'Role', 'ID',
  'Email', 'Department', 'Course or project', 'Description', 'Supervisor', 'Supervisor email', 'PPE', 'Decided', 'Token'];
const KEYS = ['ref', null, null, 'lab', 'type', 'item', 'when', 'att', 'name', 'role', 'sid', 'email', 'dept', 'course', 'desc', 'sup', 'supEmail', 'ppe'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) { sh = ss.insertSheet(SHEET); sh.appendRow(COLS); sh.setFrozenRows(1); sh.getRange(1, 1, 1, COLS.length).setFontWeight('bold'); }
  return sh;
}
const clean_ = v => String(v == null ? '' : v).slice(0, 2000);
const valid_ = e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e || '');
function table_(r) {
  return '<table cellpadding="6" style="border-collapse:collapse;font:14px Arial">' + COLS.slice(0, 18).map((c, i) => KEYS[i] && r[KEYS[i]] ?
    '<tr><td style="color:#555;border-bottom:1px solid #ddd">' + c + '</td><td style="border-bottom:1px solid #ddd">' + HtmlService.createHtmlOutput().appendUntrusted(r[KEYS[i]]).getContent() + '</td></tr>' : '').join('') + '</table>';
}

function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const r = JSON.parse(e.postData.contents);
    Object.keys(r).forEach(k => r[k] = clean_(r[k]));
    if (!r.ref || !r.name || !valid_(r.email) || !valid_(r.supEmail)) return ContentService.createTextOutput('rejected');
    const sh = sheet_();
    if (sh.createTextFinder(r.ref).matchEntireCell(true).findNext()) return ContentService.createTextOutput('duplicate');
    const token = Utilities.getUuid();
    sh.appendRow(KEYS.map((k, i) => i === 1 ? new Date() : i === 2 ? 'Pending supervisor' : r[k] || '').concat(['', token]));
    const url = ScriptApp.getService().getUrl();
    const link = a => url + '?ref=' + encodeURIComponent(r.ref) + '&t=' + token + '&a=' + a;
    MailApp.sendEmail({ to: r.supEmail, replyTo: r.email, name: LAB_NAME, subject: 'Approve lab request ' + r.ref + ' from ' + r.name,
      htmlBody: '<p>' + r.name + ' asked to use the lab and named you as supervisor.</p>' + table_(r) +
        '<p><a href="' + link('approve') + '" style="background:#1f7a3a;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px">Approve</a> &nbsp; ' +
        '<a href="' + link('decline') + '" style="background:#9b1c2c;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px">Decline</a></p>' });
    MailApp.sendEmail({ to: LAB_EMAIL, replyTo: r.email, name: LAB_NAME, subject: 'New lab request ' + r.ref + ' · ' + r.item, htmlBody: '<p>New request (waiting for the supervisor).</p>' + table_(r) });
    MailApp.sendEmail({ to: r.email, name: LAB_NAME, subject: 'We received your lab request ' + r.ref,
      htmlBody: '<p>Hello ' + r.name + ',</p><p>Your request was received and sent to your supervisor for approval. You will get the decision by email.</p>' + table_(r) });
    return ContentService.createTextOutput('ok');
  } finally { lock.releaseLock(); }
}

function doGet(e) {
  const p = e.parameter || {};
  if (!p.ref || !p.t || !/^(approve|decline)$/.test(p.a || '')) return HtmlService.createHtmlOutput('<p>ICE Lab booking service is running.</p>');
  const sh = sheet_(); const cell = sh.createTextFinder(p.ref).matchEntireCell(true).findNext();
  if (!cell) return HtmlService.createHtmlOutput('<p>Request not found.</p>');
  const row = cell.getRow(); const vals = sh.getRange(row, 1, 1, COLS.length).getValues()[0];
  if (vals[COLS.indexOf('Token')] !== p.t) return HtmlService.createHtmlOutput('<p>This link is not valid.</p>');
  if (vals[2] !== 'Pending supervisor') return HtmlService.createHtmlOutput('<p>This request was already ' + vals[2].toLowerCase() + '.</p>');
  const status = p.a === 'approve' ? 'Approved by supervisor' : 'Declined by supervisor';
  sh.getRange(row, 3).setValue(status); sh.getRange(row, COLS.indexOf('Decided') + 1).setValue(new Date());
  const r = {}; KEYS.forEach((k, i) => { if (k) r[k] = vals[i]; });
  MailApp.sendEmail({ to: r.email, cc: LAB_EMAIL, name: LAB_NAME, subject: 'Lab request ' + r.ref + ': ' + (p.a === 'approve' ? 'approved' : 'declined'),
    htmlBody: '<p>Hello ' + r.name + ',</p><p>Your supervisor <b>' + (p.a === 'approve' ? 'approved' : 'declined') + '</b> request ' + r.ref + '.' +
      (p.a === 'approve' ? ' The lab team will confirm the slot. Bring your ID and the required PPE.' : '') + '</p>' + table_(r) });
  return HtmlService.createHtmlOutput('<p style="font:16px Arial">Thank you. Request ' + r.ref + ' is now <b>' + status.toLowerCase() + '</b>. The student and the lab were emailed.</p>');
}
