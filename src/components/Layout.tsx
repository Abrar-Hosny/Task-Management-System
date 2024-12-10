import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/Sidebar";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar Component */}
        <AppSidebar />

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-4">
            {/* Sidebar Trigger for mobile */}
            <SidebarTrigger className="mb-4 lg:hidden" />

            {/* React Router Outlet to render child routes */}
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
