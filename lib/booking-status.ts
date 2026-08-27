export type BookingValidationStatus = "pending" | "under_review" | "approved" | "rejected" | "cancelled" | "refunded";

export const bookingStatusLabels: Record<BookingValidationStatus, string> = {
  pending: "Menunggu bukti pembayaran",
  under_review: "Sedang diverifikasi admin",
  approved: "Pembayaran disetujui",
  rejected: "Perlu perbaikan bukti pembayaran",
  cancelled: "Dibatalkan",
  refunded: "Dana dikembalikan",
};

export const bookingStatusColors: Record<BookingValidationStatus, string> = {
  pending: "bg-accent text-primary",
  under_review: "bg-warning/15 text-warning",
  approved: "bg-success/15 text-success",
  rejected: "bg-error/15 text-error",
  cancelled: "bg-neutral text-muted",
  refunded: "bg-primary/10 text-primary",
};

export function buildAdminWhatsAppMessage(input: {
  bookingCode: string;
  tripName: string;
  date: string;
  participants: number;
  customerName: string;
  total: number;
  status: BookingValidationStatus;
  [key: string]: any;
}) {
  return [
    "Update booking Or.Trip Adventure",
    `Kode: ${input.bookingCode}`,
    `Status: ${bookingStatusLabels[input.status]}`,
    `Peserta: ${input.customerName}`,
    `Trip: ${input.tripName}`,
    `Tanggal: ${input.date}`,
    `Jumlah: ${input.participants} peserta`,
    `Total: Rp ${input.total.toLocaleString("id-ID")}`,
  ].join("\n");
}
