import { LogOut } from 'lucide-react';

export default function Header({ onLogout }) {
  return (
    <header className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🌴 Farm Profit OS</h1>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-green-700 px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </header>
  );
}