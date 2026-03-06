interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<string, string> = {
  placed: "bg-muted text-muted-foreground",
  confirmed: "bg-blue-100 text-blue-700",
  dispatched: "bg-amber-100 text-amber-700",
  delivered: "bg-secondary text-primary",
  active: "bg-secondary text-primary",
  inactive: "bg-muted text-muted-foreground",
  pending: "bg-amber-100 text-amber-700",
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
      statusColors[status.toLowerCase()] || "bg-muted text-muted-foreground"
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;
