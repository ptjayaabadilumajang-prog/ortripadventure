# Google Apps Script Web App untuk Or.Trip

Dokumen ini menjelaskan cara membuat URL Web App yang dibutuhkan aplikasi untuk mencatat booking baru ke Google Sheets.

## 1. Buka spreadsheet tujuan

Buka Google Sheet operasional Or.Trip. Pastikan baris pertama memiliki header berikut:

`bookingCode | submittedAt | status | tripName | packageName | date | participants | customerName | phone | email | total | paymentMethod | proofUrl`

Salin Spreadsheet ID dari URL Google Sheets. ID berada di antara `/d/` dan `/edit`.

## 2. Buat Apps Script

Di Google Sheets, pilih **Extensions → Apps Script**, hapus isi editor, lalu tempel kode berikut:

```javascript
const SHEET_NAME = 'Bookings';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['bookingCode','submittedAt','status','tripName','packageName','date','participants','customerName','phone','email','total','paymentMethod','proofUrl']);
    }
    sheet.appendRow([
      body.bookingCode || '', body.submittedAt || new Date().toISOString(), body.status || 'under_review',
      body.tripName || '', body.packageName || '', body.date || '', body.participants || 0,
      body.customerName || '', body.phone || '', body.email || '', body.total || 0,
      body.paymentMethod || '', body.proofUrl || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(error) })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 3. Deploy sebagai Web App

Pilih **Deploy → New deployment**, pilih tipe **Web app**, lalu atur **Execute as: Me** dan **Who has access: Anyone**. Klik **Deploy**, izinkan akses Google bila diminta, lalu salin URL yang berakhiran `/exec`.

Tempel URL tersebut pada secret proyek bernama `GOOGLE_SHEETS_WEBHOOK_URL`. Jangan memakai link folder Google Drive; link folder tidak dapat menerima POST dari aplikasi.

## 4. Uji

Kirim satu booking percobaan dari aplikasi. Baris baru harus muncul pada sheet `Bookings` dengan status `under_review`. Jangan menaruh token rahasia di Apps Script atau di kode mobile; gunakan secret proyek untuk URL webhook.
