import { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, TrendingUp } from 'lucide-react';

export default function Crops() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/analytics/profit-summary').then(res => {
      setSummary(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-12">Loading crop data...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Crops & Profit Performance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summary.summary.map(crop => (
          <div key={crop.crop} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
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
                <span className={`font-bold text-xl ${
                  crop.netProfitLKR > 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  LKR {crop.netProfitLKR.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Per Acre</span>
                <span className="font-medium">
                  LKR {crop.profitPerAcreLKR.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}