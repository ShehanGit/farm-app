import { NavLink } from 'react-router-dom';
import { Home, ListTodo, Sprout, DollarSign } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/crops', label: 'Crops', icon: Sprout },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-green-900 text-white min-h-screen p-6">
      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-green-700 shadow-md'
                  : 'hover:bg-green-800'
              }`
            }
          >
            <Icon size={22} />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}