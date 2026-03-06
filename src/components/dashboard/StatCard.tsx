import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: ReactNode;
}

const StatCard = ({ title, value, change, changeType = "neutral", icon }: StatCardProps) => (
  <div className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
        {icon}
      </div>
      {change && (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            changeType === "up"
              ? "bg-secondary text-primary"
              : changeType === "down"
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {change}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-card-foreground">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{title}</p>
  </div>
);

export default StatCard;
