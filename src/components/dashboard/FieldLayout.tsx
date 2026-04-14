import { ReactNode } from "react";
import DashboardLayout from "./DashboardLayout";
import { fieldConfig } from "@/config/fieldConfig";

interface FieldLayoutProps {
  children: ReactNode;
}

const FieldLayout = ({ children }: FieldLayoutProps) => {
  return (
    <DashboardLayout role={fieldConfig}>
      {children}
    </DashboardLayout>
  );
};

export default FieldLayout;
