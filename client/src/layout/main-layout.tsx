import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import { AppSidebar } from "./navbar";
import { Search } from "@/components/search";
import { UserProfileSection } from "@/components/user-profile-section";
import { Space } from "antd";

export const MainLayout = () => {
  const token = Cookies.get("token");
  const role = Cookies.get("role") as "admin" | "teacher" | undefined;

  if (!token || !role) {
    return <Navigate replace to={"/"} />;
  }

  return (
    <SidebarProvider>
      {/* @ts-ignore */}
      <AppSidebar role={role} />
      <main className="flex-1">
        <div className="border-b bg-white">
          <div className="p-4" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <SidebarTrigger />
            <Space size="middle">
              <Search />
              <UserProfileSection role={role} />
            </Space>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};
