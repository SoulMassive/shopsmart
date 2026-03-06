import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { adminConfig } from "@/config/adminConfig";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const roleLabel: Record<string, string> = {
  admin: "Admin",
  retailOutlet: "Retail Outlet",
  user: "User",
  fieldExecutive: "Field Executive",
};

const AdminUsers = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data;
    },
  });

  const handleRowClick = (user: any) => {
    if (user.role === "retailOutlet") {
      navigate(`/admin/users/${user._id}`);
    }
  };

  return (
    <DashboardLayout role={adminConfig}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-sm text-muted-foreground">Manage executives and outlet accounts</p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus size={16} /> Add User
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            Error loading users. Please try again.
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Email</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Role</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Joined</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {(data || []).map((user: any) => {
                    const isOutlet = user.role === "retailOutlet";
                    return (
                      <tr
                        key={user._id}
                        className={`border-b border-border last:border-0 transition-colors ${isOutlet
                            ? "cursor-pointer hover:bg-primary/5"
                            : "hover:bg-muted/20"
                          }`}
                        onClick={() => handleRowClick(user)}
                      >
                        <td className="px-5 py-3 font-medium text-card-foreground">{user.name}</td>
                        <td className="px-5 py-3 text-muted-foreground">{user.email}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isOutlet
                                ? "bg-green-100 text-green-700"
                                : user.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {roleLabel[user.role] || user.role}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={user.isActive ? "Active" : "Inactive"} />
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3">
                          {isOutlet ? (
                            <span className="flex items-center gap-1 text-primary text-xs font-medium">
                              View Profile <ChevronRight className="h-3 w-3" />
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
