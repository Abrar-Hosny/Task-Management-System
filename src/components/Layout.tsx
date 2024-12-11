import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/Sidebar";
import { Header } from "./Header";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";

const Layout = () => {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <SidebarProvider>
          <div className="flex w-full h-screen">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <div className="fixed top-0 md:left-[255px] left-0 right-0 z-40">
                <Header />
              </div>
              <div className="flex-1 w-full h-full mt-16 overflow-auto">
                <div className="container w-full h-full p-4 mx-auto">
                  <SidebarTrigger className="mb-4 lg:hidden" />
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default Layout;
