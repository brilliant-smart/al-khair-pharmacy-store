import { useAuth } from "@/app/auth/AuthContext";
import UserProfileMenu from "./UserProfileMenu";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminHeader() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold">Al-Khair Pharmacy Admin</h2>
            <p className="text-xs text-muted-foreground">
              {user.role === "master_admin"
                ? "Master Administrator"
                : "Section Head Dashboard"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications - Hidden for now until notification system is implemented */}
          {/* <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button> */}

          {/* User Profile Menu */}
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}
