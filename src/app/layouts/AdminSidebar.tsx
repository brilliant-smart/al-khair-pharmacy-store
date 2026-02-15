import { NavLink } from "react-router-dom";
import { useAuth } from "@/app/auth/AuthContext";
import { sidebarItems } from "./adminSidebarConfig";

export default function AdminSidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const visibleItems = sidebarItems.filter((item) =>
    item.roles.includes(user.role),
  );

  return (
    <aside className="w-64 border-r border-border p-3">
      <nav className="space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
