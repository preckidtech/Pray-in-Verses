import { Home, Search, Mountain, Calendar, Clock, BookOpen, Bookmark, Info } from "lucide-react";

const sidebarItems = [
  { title: "Explore", icon: Home, active: true },
  { title: "Search", icon: Search },
  { title: "Prayers", icon: Mountain },
  { title: "Daily Verses", icon: Calendar },
  { title: "Prayer Reminders", icon: Clock },
  { title: "My Journal", icon: BookOpen },
  { title: "Saved Prayers", icon: Bookmark },
  { title: "Reflection", icon: Info },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform z-50 transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Nav Items */}
        <nav className="p-4">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-3 py-3 px-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                  item.active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
