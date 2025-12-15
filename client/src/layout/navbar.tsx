import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { links } from "./layout-data";
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";

export function AppSidebar({ role }: { role: "admin" | "teacher" }) {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarContent className="px-3 py-4">
        <SidebarGroupContent>
          <SidebarMenu className="space-y-0.5">
            {links[role].map((item) => {
              // Faqat exact match bo'lganda active
              const isActive = location.pathname === item.url;
              const isHome = item.url === `/app/${role}`;
              
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={isHome}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gray-100 text-black"
                          : "text-gray-600 hover:bg-gray-50 hover:text-black"
                      }`}
                    >
                      <>
                        <span
                          className={`absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-black transition-all duration-200 ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <item.icon
                          className={`h-5 w-5 transition-all duration-200 ${
                            isActive
                              ? "text-black scale-110"
                              : "text-gray-500 group-hover:text-gray-700 group-hover:scale-105"
                          }`}
                        />
                        <span className={isActive ? "font-semibold" : ""}>{item.title}</span>
                      </>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
    </Sidebar>
  );
}
