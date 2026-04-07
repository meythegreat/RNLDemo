import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import { SidebarProvider } from "../contexts/SidebarContext";
import { HeaderProvider } from "../contexts/HeaderContext"; // Added missing import

const LayoutContent = () => {
    return (
        <>
            <div>
                <AppSidebar />
            </div>
            <div>
                <AppHeader />
            </div>
            <div className="p-20 -ml-14 sm:ml-52"> {/* Fixed typo: -mml-14 to -ml-14 */}
                <Outlet />
            </div>
        </>
    );
};

const AppLayout = () => {
  return (
    <>
    <HeaderProvider>
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    </HeaderProvider>
    </>
  );
};

export default AppLayout;