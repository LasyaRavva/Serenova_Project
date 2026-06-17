const STYLES = {
  paid:     "text-green-400 bg-green-400/10 border-green-400/20",
  pending:  "text-amber-400 bg-amber-400/10 border-amber-400/20",
  refunded: "text-blue-400  bg-blue-400/10  border-blue-400/20",
  unpaid:   "text-white/30  bg-white/5      border-white/10",
};

const LABELS = {
  paid:     "Paid",
  pending:  "Pay at Location",
  refunded: "Refunded",
  unpaid:   "Payment Pending",
};

export default function PaymentStatusBadge({ status }) {
  const s = status || "unpaid";
  return (
    <span className={`
      text-xs font-body px-2.5 py-1 rounded-full border
      ${STYLES[s] || STYLES.unpaid}
    `}>
      {LABELS[s] || "Unknown"}
    </span>
  );
}