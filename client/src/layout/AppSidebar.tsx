import { useSidebar } from "../contexts/SidebarContext";
import { Link } from "react-router-dom"; 

const AppSidebar = () => {
   const {isOpen, toggleSidebar} = useSidebar();

   const sidebarItems = [
      {
         path: "/",
         text: "Genders",
      },
      {
         path: "/users", 
         text: "Users",
      },
   ]

  return (
    <>
    {isOpen && (
      <div className="fixed inset-0 z-30 blur-lg sm:hidden bg-gray-900/50" onClick={toggleSidebar}/>
    )}
    
    {/* Fixed: Changed to -translate-x-full for the closed state so it pops from the left */}
    <aside id="top-bar-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 border-gray-700 bg-gray-800`} aria-label="Sidebar">
      <div className="h-full px-3 py-4 pt-20 overflow-y-auto bg-gray-800 border-r border-gray-700">
          <ul className="space-y-2 font-medium">
            {sidebarItems.map((sidebarItem, index) => (
            <li key={index}>
                <Link to={sidebarItem.path} className="flex items-center px-2 py-1.5 text-gray-200 rounded-base hover:bg-gray-700 hover:text-white group">
                  <span className="ms-3">{sidebarItem.text}</span>
                </Link>
            </li>
            ))}
          </ul>
      </div>
    </aside>
    </>
  )
}

export default AppSidebar;