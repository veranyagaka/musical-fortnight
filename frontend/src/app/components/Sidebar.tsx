import { Upload, Library, BarChart3, Settings, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: Upload, label: 'Upload Video', active: false },
    { icon: Library, label: 'Video Library', active: false },
    { icon: BarChart3, label: 'Analytics Dashboard', active: true },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <motion.div
      className="h-full bg-[#F8FAFC] border-r border-gray-200 flex flex-col"
      animate={{ width: collapsed ? 56 : 220 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-3 flex items-center justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft
            className={`w-4 h-4 text-gray-400 transition-transform ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      <nav className="flex-1 px-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md mb-0.5 transition-colors ${
              item.active
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>
    </motion.div>
  );
}
