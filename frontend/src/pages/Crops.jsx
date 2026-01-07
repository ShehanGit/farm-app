import { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, TrendingUp, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Crops() {
  const [summary, setSummary] = useState(null);
  const [sortBy, setSortBy] = useState('netProfitLKR');
  const [sortDesc, setSortDesc] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/analytics/profit-summary').then(res => {
      setSummary(res.data);
      setLoading(false);
    });
  }, []);

  const sortedCrops = summary?.summary.sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    return sortDesc ? valB - valA : valA - valB;
  }) || [];

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key);
      setSortDesc(true);
    }
  };

  if (loading) return <div className="text-center py-12">Loading crop data...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Crops & Profit Performance</h1>

      {/* Sort Controls */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => toggleSort('netProfitLKR')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <TrendingUp size={18} /> Sort by Profit {sortBy === 'netProfitLKR' && <ArrowUpDown size={16} />}
        </button>
        <button
          onClick={() => toggleSort('currentStockKg')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <Package size={18} /> Sort by Stock {sortBy === 'currentStockKg' && <ArrowUpDown size={16} />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCrops.map(crop => (
          <div
            key={crop.crop}
            onClick={() => navigate(`/crops/${crop.cropId || crop.id}`)}  // Assume id in summary
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg cursor-pointer transition"
          >
            <h3 className="text-2xl font-bold text-green-800 mb-4">{crop.crop}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Acres</span>
                <span className="font-semibold">{crop.acres}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Package className="text-orange-600" size={18} /> Stock
                </span>
                <span className="font-bold text-orange-700">{crop.currentStockKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={18} /> Profit
                </span>
                <span className={`font-bold text-xl ${crop.netProfitLKR > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  LKR {crop.netProfitLKR.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Per Acre</span>
                <span className="font-medium">LKR {crop.profitPerAcreLKR.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}