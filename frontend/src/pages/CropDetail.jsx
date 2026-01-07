import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ArrowLeft, Package, DollarSign, Sprout } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function CropDetail() {
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [sales, setSales] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cropRes, expRes, harRes, salRes, taskRes] = await Promise.all([
          axios.get(`/crops/${id}`).catch(() => ({ data: null })),
          axios.get('/expenses', { params: { cropId: id } }).catch(() => ({ data: [] })),
          axios.get('/harvests', { params: { cropId: id } }).catch(() => ({ data: [] })),
          axios.get('/sales', { params: { cropId: id } }).catch(() => ({ data: [] })),
          axios.get('/tasks', { params: { cropId: id } }).catch(() => ({ data: [] }))
        ]);

        if (!cropRes.data) {
          setError('Crop not found');
          setLoading(false);
          return;
        }

        setCrop(cropRes.data);
        setExpenses(Array.isArray(expRes.data) ? expRes.data : []);
        setHarvests(Array.isArray(harRes.data) ? harRes.data : []);
        setSales(Array.isArray(salRes.data) ? salRes.data : []);
        setTasks(Array.isArray(taskRes.data) ? taskRes.data : []);
        setLoading(false);
      } catch (err) {
        console.error('Error loading crop detail:', err);
        setError('Failed to load data. Check console.');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-12 text-xl">Loading crop details...</div>;
  if (error) return <div className="text-center py-12 text-red-600 text-xl">{error}</div>;
  if (!crop) return <div className="text-center py-12">Crop not found</div>;

  // Mock data for charts (replace with real later)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const profitData = [30000, 45000, 70000, 55000, 90000, 110000];
  const stockData = [800, 1200, 900, 1100, 700, 950];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,  // Allows fixed height
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    }
  };

  const profitChart = {
    labels: months,
    datasets: [{
      label: 'Net Profit (LKR)',
      data: profitData,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      tension: 0.3
    }]
  };

  const stockChart = {
    labels: months,
    datasets: [{
      label: 'Stock (kg)',
      data: stockData,
      backgroundColor: 'rgba(249, 115, 22, 0.6)',
      borderColor: 'rgb(249, 115, 22)'
    }]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Back + Title */}
      <div className="flex items-center gap-4">
        <Link to="/crops" className="flex items-center gap-2 text-green-700 hover:underline">
          <ArrowLeft size={20} /> Back to Crops
        </Link>
        <h1 className="text-4xl font-bold text-gray-800">{crop.type}</h1>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center shadow">
          <Sprout className="mx-auto text-green-600 mb-2" size={32} />
          <p className="text-sm text-gray-600">Land Area</p>
          <p className="text-3xl font-bold text-green-800">{crop.acre} acres</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center shadow">
          <Package className="mx-auto text-orange-600 mb-2" size={32} />
          <p className="text-sm text-gray-600">Current Stock</p>
          <p className="text-3xl font-bold text-orange-700">~950 kg</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center shadow">
          <DollarSign className="mx-auto text-blue-600 mb-2" size={32} />
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="text-3xl font-bold text-blue-800">LKR 450,000</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center shadow">
          <p className="text-sm text-gray-600">Profit per Acre</p>
          <p className="text-3xl font-bold text-purple-800">LKR 180,000</p>
        </div>
      </div>

      {/* Charts - Fixed Height! */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Profit Trend (2026)</h2>
          <div className="h-96">  {/* ← THIS FIXES THE STRETCHING */}
            <Line data={profitChart} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Stock Levels (kg)</h2>
          <div className="h-96">  {/* ← THIS FIXES THE STRETCHING */}
            <Bar data={stockChart} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Recent Expenses</h3>
          {expenses.length === 0 ? (
            <p className="text-gray-500">No expenses recorded</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {expenses.slice(0, 5).map(e => (
                <li key={e.id} className="flex justify-between">
                  <span>{e.type} ({e.date})</span>
                  <span className="text-red-600 font-medium">-LKR {e.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Recent Harvests</h3>
          {harvests.length === 0 ? (
            <p className="text-gray-500">No harvests recorded</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {harvests.slice(0, 5).map(h => (
                <li key={h.id} className="flex justify-between">
                  <span>{h.date} (Grade {h.grade || '—'})</span>
                  <span className="text-green-600 font-medium">+{h.quantityKg} kg</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Active Tasks</h3>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No active tasks</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {tasks.filter(t => t.status !== 'done').slice(0, 5).map(t => (
                <li key={t.id}>
                  <span className="font-medium">{t.title}</span>
                  <span className="block text-gray-600 text-xs">Due: {t.dueDate || '—'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}