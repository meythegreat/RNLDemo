import { createContext, useCallback, useContext, useEffect, useState, type FC, type ReactNode } from "react";

type SidebarContextType = {
    isOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
};

const MOBILE_BREAKPOINT = 640;

const getInitialSidebarState = () => {
    if(typeof window === "undefined") {
        return true;
    }

    return window.innerWidth >= MOBILE_BREAKPOINT;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

export const SidebarProvider: FC<{children: ReactNode}> = ({children}) => {
    const [isOpen, setIsOpen] = useState(getInitialSidebarState);

    const toggleSidebar = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsOpen(window.innerWidth >= MOBILE_BREAKPOINT);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <SidebarContext.Provider value={{ isOpen, toggleSidebar, closeSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};
