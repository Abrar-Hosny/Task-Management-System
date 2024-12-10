"use client"

import React from "react";
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
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Task Manager</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === "/"}>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                <ListTodo className="mr-2 h-4 w-4" />
                Pending Tasks
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === "/completed"}>
              <NavLink to="/completed" className={({ isActive }) => (isActive ? "active" : "")}>
                <CheckSquare className="mr-2 h-4 w-4" />
                Completed Tasks
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
