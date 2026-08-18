# External Reference Notes

## User-provided references

- Or.Trip reference: https://ortrip-adventure.base44.app
  - The public page was attempted for review, but its rendered content was unavailable in the sandbox browser. The app therefore uses the supplied documents and the other accessible references as the main information architecture inputs.
- Destination safety reference: https://bromotenggersemeru.id/peraturan/semeru
  - User-provided source for Semeru rules and safety content. The app includes an original, concise destination-rules experience and avoids copying source text.
- Marketplace reference: https://open-trip.id/
  - Public navigation pattern observed: Explore, Destinasi, Jadwal Tur, Private Tur, and support contact.
  - Public content pattern observed: trip cards with image, trip type, destination/province, rating/review count, date, duration, and starting price.
  - These patterns informed the app’s Home, Explore, Trip Detail, and Private Trip flows.
- Adventure operator reference: https://tigadewaadventure.id/
  - User-provided source for general adventure-operator positioning and content patterns.

## Supplied implementation documents

The supplied DOCX prompts describe a broad Open Trip / Private Trip product including trip catalog, booking, payment, guide/crew data, gallery, blog, safety rules, admin operations, reminders, and future roadmap items such as AI, community, weather, and emergency systems. The mobile implementation prioritizes the customer-facing discovery, booking, private-trip request, content, safety, and confirmation experience, with local typed demo data ready to connect to a live backend later.


## Google Sheets integration findings
- User-provided spreadsheet: https://docs.google.com/spreadsheets/d/1QUaAQmpJsD6QmMjIlYZtVNqobYpf-D2ZMNgzltpzUxk/edit
- Spreadsheet ID: 1QUaAQmpJsD6QmMjIlYZtVNqobYpf-D2ZMNgzltpzUxk
- Existing sheet title: FORM PESERTA RANU KUMBOLO
- Existing table columns: NAMA LENGKAP SESUAI KTP, ALAMAT SESUAI KTP, NIK, DESA_KELURAHAN, KECAMATAN, KABUPATEN, PROVINSI, KODE POS, TAGGAL LAHIR, JENIS KELAMIN, PEKERJAAN SESUAI KTP, AGAMA, KEBANGSAAN/NEGARA, NO HP, NO DARURAT, EMAIL, TANGGAL PEMBERANGKATAN, FOTO KTP, FOTO KK, ID PESERTA, KARTU PESERTA, PAKET, DP, PELUNASAN.
- App server now targets this spreadsheet ID and accepts a GOOGLE_SHEETS_WEBHOOK_URL for the Apps Script bridge.
