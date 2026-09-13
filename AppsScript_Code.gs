/**
 * ============================================================
 *  Google Apps Script — NTDD: ĐẾM LƯỢT XEM (Google Sheets)
 * ============================================================
 *  Đếm TỔNG LƯỢT XEM toàn cục cho trang index.html:
 *     - Google Sheets lưu dữ liệu (tự tạo sheet "Counter")
 *     - Google Apps Script xử lý yêu cầu từ trình duyệt
 *
 *  CÀI ĐẶT (1 lần, ~5 phút) -> xem INSTRUCTIONS_APPS_SCRIPT.md
 * ============================================================
 */

function doGet(e) {
  // Kiểm char у browser: .../exec?action=read (читає A2, не рахує)
  var p = (e && e.parameter) || {};
  var action = String(p.action || '');
  if (action === 'increment') return increment_();
  if (action === 'read')      return out_({ ok: true, total: readTotal_() });
  return out_({ ok: true, message: 'Use POST body: action=increment', total: readTotal_() });
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  var action = String(p.action || '');
  var lock = LockService.getScriptLock();
  var got = false;
  try {
    got = lock.waitLock(20000);
    if (action === 'increment') return increment_();
    return out_({ ok: false, error: 'unknown action: ' + action });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    if (got) lock.releaseLock();
  }
}

/**
 * Đếm lượt xem toàn cục.
 * Sheet "Counter" (tự tạo nếu chưa có) lưu:
 *   A1:D1 — dòng tiêu đề
 *   A2    — tổng lượt xem
 *   B2    — lượt xem hôm nay (reset về 1 khi đổi ngày)
 *   C2    — ngày hiện tại dạng yyyy-MM-dd
 *   D2    — lần truy cập gần nhất
 */
function increment_() {
  var ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) { /* standalone script */ }
  if (!ss) {
    return out_({ ok: false, error: 'Script khōng liên vo spreadsheet. Mǫ Google Sheets -> Extensions -> Apps Script и встav cюдa весь код (не через script.new).' });
  }
  var sh = ss.getSheetByName('Counter');
  var tz = tz_();
  var now = new Date();
  var todayStr = fmt_(now, tz, 'yyyy-MM-dd');
  var lastVisit = fmt_(now, tz, 'HH:mm:ss dd/MM/yyyy');

  if (!sh) {
    sh = ss.insertSheet('Counter');
    sh.getRange('A1:D1').setValues([['Tổng lượt xem', 'Hôm nay', 'Ngày', 'Lần truy cập gần nhất']]);
    sh.getRange('A2').setValue(0);
    sh.getRange('B2').setValue(0);
    sh.getRange('C2').setValue(todayStr);
    sh.getRange('D2').setValue(lastVisit);
  }

  var total = Number(sh.getRange('A2').getValue() || 0) + 1;
  var storedDate = String(sh.getRange('C2').getValue() || '');
  var today = (storedDate === todayStr)
    ? (Number(sh.getRange('B2').getValue() || 0) + 1)
    : 1;

  sh.getRange('A2').setValue(total);
  sh.getRange('B2').setValue(today);
  sh.getRange('C2').setValue(todayStr);
  sh.getRange('D2').setValue(lastVisit);

  return out_({ ok: true, total: total, todayCount: today, lastVisit: lastVisit });
}

/** Тom цenne А2 (для kiểm char у browser: ?action=read) */
function readTotal_() {
  try {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Counter');
    return sh ? Number(sh.getRange('A2').getValue() || 0) : 0;
  } catch (e) {
    return -1;
  }
}

/** Timezone зі spreadsheet (fallback — GMT) */
function tz_() {
  try { return SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(); }
  catch (e) { return 'GMT'; }
}

function pad_(n) { return (n < 10 ? '0' : '') + n; }

/**
 * Format дати. Пробуєм новий API Utilities.formatDate();
 * коли недоступний або падає — fallback на UTC (працє на всіх runtime).
 */
function fmt_(d, tz, pattern) {
  try {
    if (typeof Utilities !== 'undefined' && typeof Utilities.formatDate === 'function') {
      return Utilities.formatDate(d, tz, pattern);
    }
  } catch (e) { /* fallback */ }
  return pattern
    .split('yyyy').join(String(d.getUTCFullYear()))
    .split('MM').join(pad_(d.getUTCMonth() + 1))
    .split('dd').join(pad_(d.getUTCDate()))
    .split('HH').join(pad_(d.getUTCHours()))
    .split('mm').join(pad_(d.getUTCMinutes()))
    .split('ss').join(pad_(d.getUTCSeconds()));
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType('application/json');
}