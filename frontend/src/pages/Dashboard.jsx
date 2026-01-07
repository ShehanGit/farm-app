import { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, AlertCircle, CheckCircle, Clock, Package } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profitRes, taskRes] = await Promise.all([
          axios.get('/analytics/profit-summary'),
          axios.get('/tasks?priority=critical&priority=high')
        ]);
        setSummary(profitRes.data);
        setTasks(taskRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) return <div className="p-8 text-center">Loading farm data...</div>;

  const { farmTotal } = summary || {};

  return (
    <div className="min-h-screen bg-gray-50">
  
     
      <main className="max-w-7xl mx-auto p-6 grid gap-8">
        {/* Profit Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            💰 Profit Summary (All Time)
          </h2>
          {farmTotal && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-50 p-5 rounded-lg text-center">
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-3xl font-bold text-green-700">
                  LKR {farmTotal.netProfitLKR?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-blue-50 p-5 rounded-lg text-center">
                <p className="text-sm text-gray-600">Profit per Acre</p>
                <p className="text-2xl font-bold text-blue-700">
                  LKR {farmTotal.profitPerAcreLKR?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-purple-50 p-5 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-purple-700">
                  LKR {farmTotal.totalIncomeLKR?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-orange-50 p-5 rounded-lg text-center flex items-center justify-center gap-3">
                <Package className="text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Current Stock</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {farmTotal.totalStockKg || 0} kg
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Urgent Tasks */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-600" />
            Critical & High Priority Tasks ({tasks.length})
          </h2>

          {tasks.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              <CheckCircle className="inline mr-2 text-green-600" />
              No urgent tasks today. Great job!
            </p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    task.priority === 'critical'
                      ? 'border-red-600 bg-red-50'
                      : 'border-orange-600 bg-orange-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      {task.Crop && (
                        <p className="text-sm text-gray-600 mt-1">
                          Crop: {task.Crop.type}
                        </p>
                      )}
                      {task.description && (
                        <p className="text-gray-700 mt-2">{task.description}</p>
                      )}
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">
                        Due: {task.dueDate || 'No date'}
                      </p>
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'critical'
                            ? 'bg-red-200 text-red-800'
                            : 'bg-orange-200 text-orange-800'
                        }`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}