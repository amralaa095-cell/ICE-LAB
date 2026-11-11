/**
 * ICE Lab · DASHBOARD (a separate, standalone Apps Script project).
 * Deploy as a Web app: Execute as = User accessing the web app, Who has access = Anyone with a Google account
 * (or only your university domain, if it uses Google Workspace).
 *
 * Access is Google's own sharing of the bookings sheet:
 *   - people the sheet is shared with as Viewer can open the dashboard, filter, analyse and export;
 *   - people listed as Admins on the Config sheet (and shared as Editor) can also change request and equipment status;
 *   - anyone else gets "no access".
 */
const SHEET_ID = 'PUT-THE-SHEET-ID-HERE';   // the long id in the bookings sheet's URL
const STATUSES = ['Pending supervisor', 'Approved by supervisor', 'Declined by supervisor', 'Confirmed by lab', 'Completed', 'No-show', 'Cancelled'];
const EQ_STATUSES = ['Operational', 'Under maintenance', 'Out of service'];

function doGet() {
  return HtmlService.createTemplateFromFile('Dashboard').evaluate()
    .setTitle('ICE Lab dashboard').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function me_() { return (Session.getActiveUser().getEmail() || '').toLowerCase(); }
function ss_() { return SpreadsheetApp.openById(SHEET_ID); }
function admins_(ss) {
  const c = ss.getSheetByName('Config');
  return c ? String(c.getRange(2, 2).getValue()).toLowerCase().split(/[\s,;]+/).filter(Boolean) : [];
}
function cell_(v, tz) {
  if (!(v instanceof Date)) return v;
  if (v.getFullYear() < 1901) return Utilities.formatDate(v, tz, 'HH:mm');
  const t = Utilities.formatDate(v, tz, 'HH:mm');
  return Utilities.formatDate(v, tz, t === '00:00' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm');
}

function getData() {
  let ss;
  try { ss = ss_(); ss.getName(); } catch (e) { return { error: 'no-access', me: me_() }; }
  const tz = ss.getSpreadsheetTimeZone();
  const req = ss.getSheetByName('Requests').getDataRange().getValues();
  const head = req.shift(); const ti = head.indexOf('Token');
  const eq = ss.getSheetByName('Equipment').getDataRange().getValues(); eq.shift();
  const admin = admins_(ss).indexOf(me_()) >= 0;
  return {
    me: me_(), role: admin ? 'admin' : 'viewer',
    head: head.filter((_, i) => i !== ti),
    rows: req.map(r => r.filter((_, i) => i !== ti).map(v => cell_(v, tz))),
    equipment: eq.map(r => r.map(v => cell_(v, tz))),
    admins: admin ? admins_(ss) : [], sheetUrl: admin ? ss.getUrl() : '',
    statuses: STATUSES, eqStatuses: EQ_STATUSES
  };
}

function requireAdmin_(ss) { if (admins_(ss).indexOf(me_()) < 0) throw new Error('Only lab admins can change data.'); }

function setRequest(ref, status, note) {
  const ss = ss_(); requireAdmin_(ss);
  if (STATUSES.indexOf(status) < 0) throw new Error('Unknown status');
  const sh = ss.getSheetByName('Requests'); const head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const c = sh.createTextFinder(ref).matchEntireCell(true).findNext(); if (!c) throw new Error('Request not found');
  const row = c.getRow(), col = n => head.indexOf(n) + 1;
  if (sh.getRange(row, col('Status')).getValue() !== status) { sh.getRange(row, col('Status')).setValue(status); sh.getRange(row, col('Decided')).setValue(new Date()); }
  sh.getRange(row, col('Lab note')).setValue(String(note || '').slice(0, 500));
  return true;
}

function setEquipment(code, status, note) {
  const ss = ss_(); requireAdmin_(ss);
  if (EQ_STATUSES.indexOf(status) < 0) throw new Error('Unknown status');
  const sh = ss.getSheetByName('Equipment');
  const c = sh.createTextFinder(code).matchEntireCell(true).findNext(); if (!c || c.getColumn() !== 1) throw new Error('Equipment not found');
  sh.getRange(c.getRow(), 4, 1, 3).setValues([[status, String(note || '').slice(0, 300), new Date()]]);
  return true;
}
