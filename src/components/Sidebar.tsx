"use client";

import { NavLink, useLocation } from "react-router-dom";
import { ListTodo, CheckSquare } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="flex p-4">
        <h2 className="text-lg font-semibold">Task Manager</h2>
      </SidebarHeader>
      <SidebarContent className="flex p-4 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === "/"}>
              <NavLink
                to="/home/pending"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <ListTodo className="w-4 h-4 mr-2" />
                Pending Tasks
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === "/completed"}
            >
              <NavLink
                to="/home/completed"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Completed Tasks
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
