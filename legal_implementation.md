# Legal Document Implementation - Or.Trip Adventure

## Overview
Secure storage and management of company legal documents (NPWP, NIB, etc.) within the Or.Trip Adventure mobile application.

## Security Measures
- **Admin-Only Access**: Documents are only accessible via the `AdminDashboardScreen` under the `Settings` tab.
- **tRPC Protection**: The `legal.list` and `legal.add` endpoints are protected by `protectedProcedure` and require the `admin` role.
- **Storage**: PDF files are uploaded to secure S3-compatible storage with randomized keys.
- **Privacy**: No legal document data or numbers are exposed to public users or in the frontend profile.

## Implemented Documents
1. **TIN Card (NPWP)**: `PT JAYA ABADI LUMAJANG` (1000000007317084)
2. **NIB**: `1212250003718`
3. **Surat Pernyataan**: ID 41251211350187231
4. **Surat Sertifikat**: ID 41251211350187231

## Technical Details
- **Table**: `legal_documents`
- **Schema**: `id`, `name`, `type`, `documentNumber`, `fileUrl`, `metadata`, `isVerified`, `verifiedAt`
- **UI Component**: `Legal Documents` section in `admin-bookings.tsx` with PDF viewer integration.
