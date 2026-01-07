import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { ArrowLeft, AlertTriangle, Download } from 'lucide-react';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

export default function CropDetail() {
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    profit: [],
    expenses: [],
    harvests: [],
    sales: [],
    wastage: [],
    avgPrices: [],
    costBreakdown: {}
  });
  const [startDate, setStartDate] = useState(subMonths(new Date(), 3));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [currentStock, setCurrentStock] = useState(0);

  const timeFrames = [
    { label: 'Past Week', start: subDays(new Date(), 7) },
    { label: 'Past Month', start: subMonths(new Date(), 1) },
    { label: 'Past 3 Months', start: subMonths(new Date(), 3) },
    { label: 'Past 6 Months', start: subMonths(new Date(), 6) },
    { label: 'Past Year', start: subYears(new Date(), 1) },
    { label: 'All Time', start: new Date('2020-01-01') }
  ];

  const applyTimeFrame = (start) => {
    setStartDate(start);
    setEndDate(new Date());
  };

  useEffect(() => {
    fetchCrop();
  }, [id]);

  useEffect(() => {
    if (crop) {
      fetchChartData();
    }
  }, [startDate, endDate, crop]);

  const fetchCrop = async () => {
    try {
      const res = await axios.get(`/crops/${id}`);
      setCrop(res.data);
    } catch (err) {
      console.error('Error fetching crop:', err);
    }
  };

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const params = {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd')
      };

      // Fetch time series data from the backend
      const response = await axios.get(`/analytics/crop-timeseries/${id}`, { params });
      
      setChartData(response.data);

      // Calculate current stock from the data
      const totalHarvest = response.data.harvests.reduce((sum, val) => sum + val, 0);
      const totalSales = response.data.sales.reduce((sum, val) => sum + val, 0);
      const totalWastage = response.data.wastage.reduce((sum, val) => sum + val, 0);
      setCurrentStock(Math.max(0, totalHarvest - totalSales - totalWastage));

    } catch (err) {
      console.error('Error fetching chart data:', err);
      // Set empty data on error
      setChartData({
        labels: ['No data'],
        profit: [0],
        expenses: [0],
        harvests: [0],
        sales: [0],
        wastage: [0],
        avgPrices: [0],
        costBreakdown: { 'No expenses': 100 }
      });
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { position: 'top' }, 
      tooltip: { 
        mode: 'index',
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      } 
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      }
    }
  };

  const profitChartData = {
    labels: chartData.labels,
    datasets: [
      { 
        label: 'Net Profit (LKR)', 
        data: chartData.profit, 
        borderColor: 'rgb(34,197,94)', 
        backgroundColor: 'rgba(34,197,94,0.1)',
        tension: 0.4,
        fill: true
      },
      { 
        label: 'Expenses (LKR)', 
        data: chartData.expenses, 
        borderColor: 'rgb(239,68,68)', 
        backgroundColor: 'rgba(239,68,68,0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const productionChartData = {
    labels: chartData.labels,
    datasets: [
      { 
        label: 'Harvest (kg)', 
        data: chartData.harvests, 
        borderColor: 'rgb(34,197,94)', 
        tension: 0.4 
      },
      { 
        label: 'Sales (kg)', 
        data: chartData.sales, 
        borderColor: 'rgb(59,130,246)', 
        tension: 0.4 
      },
      { 
        label: 'Wastage (kg)', 
        data: chartData.wastage, 
        borderColor: 'rgb(239,68,68)', 
        tension: 0.4 
      }
    ]
  };

  const priceChartData = {
    labels: chartData.labels,
    datasets: [
      { 
        label: 'Avg Sale Price (LKR/kg)', 
        data: chartData.avgPrices, 
        borderColor: 'rgb(147,51,234)', 
        backgroundColor: 'rgba(147,51,234,0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const pieData = {
    labels: Object.keys(chartData.costBreakdown),
    datasets: [
      { 
        data: Object.values(chartData.costBreakdown), 
        backgroundColor: [
          '#EF4444', 
          '#3B82F6', 
          '#F59E0B', 
          '#10B981', 
          '#8B5CF6',
          '#EC4899'
        ]
      }
    ]
  };

  const exportCSV = () => {
    const rows = chartData.labels.map((label, i) => ({
      Month: label,
      Profit_LKR: chartData.profit[i],
      Expenses_LKR: chartData.expenses[i],
      Harvest_kg: chartData.harvests[i],
      Sales_kg: chartData.sales[i],
      Wastage_kg: chartData.wastage[i],
      Avg_Price_LKR: chartData.avgPrices[i]
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${crop?.type || 'Crop'}_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !crop) {
    return <div className="text-center py-20 text-2xl">Loading crop details...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/crops" className="flex items-center gap-2 text-green-700 hover:underline">
            <ArrowLeft size={24} /> Back to Crops
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">{crop?.type} Analytics</h1>
        </div>
        <button 
          onClick={exportCSV} 
          className="bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition"
        >
          <Download size={20} /> Export CSV
        </button>
      </div>

      {/* Low Stock Alert */}
      {currentStock < 200 && (
        <div className="bg-red-100 p-6 rounded-lg flex items-center gap-4">
          <AlertTriangle className="text-red-600" size={32} />
          <p className="text-xl font-bold text-red-800">
            Low Stock Warning: {Math.round(currentStock)} kg remaining
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 text-sm">Current Stock</p>
          <p className="text-2xl font-bold text-blue-600">{Math.round(currentStock)} kg</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 text-sm">Total Harvest</p>
          <p className="text-2xl font-bold text-green-600">
            {Math.round(chartData.harvests.reduce((sum, v) => sum + v, 0))} kg
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 text-sm">Total Sales</p>
          <p className="text-2xl font-bold text-purple-600">
            {Math.round(chartData.sales.reduce((sum, v) => sum + v, 0))} kg
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 text-sm">Total Profit</p>
          <p className={`text-2xl font-bold ${chartData.profit.reduce((sum, v) => sum + v, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            LKR {Math.round(chartData.profit.reduce((sum, v) => sum + v, 0)).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Select Time Period</h2>
        <div className="flex flex-wrap gap-3 items-center">
          {timeFrames.map(f => (
            <button 
              key={f.label} 
              onClick={() => applyTimeFrame(f.start)} 
              className="px-5 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition font-medium"
            >
              {f.label}
            </button>
          ))}
          <div className="flex gap-3 items-center ml-4">
            <DatePicker 
              selected={startDate} 
              onChange={setStartDate} 
              className="px-4 py-2 border rounded-lg" 
              dateFormat="yyyy-MM-dd"
            />
            <span className="font-semibold">to</span>
            <DatePicker 
              selected={endDate} 
              onChange={setEndDate} 
              className="px-4 py-2 border rounded-lg"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      {loading ? (
        <div className="text-center py-20 text-xl">Loading charts...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Profit vs Expenses Over Time</h3>
            <div className="h-96">
              <Line data={profitChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Production Flow (kg)</h3>
            <div className="h-96">
              <Line data={productionChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Average Sale Price Trend</h3>
            <div className="h-96">
              <Line data={priceChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Expense Breakdown (%)</h3>
            <div className="h-96 flex items-center justify-center">
              <div className="w-full max-w-md">
                <Pie data={pieData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}