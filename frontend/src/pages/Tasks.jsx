import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, AlertCircle, Clock, CheckCircle } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', cropId: '', dueDate: '', priority: 'medium', isReminder: false
  });
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchCrops();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('/tasks');
    setTasks(res.data);
  };

  const fetchCrops = async () => {
    const res = await axios.get('/crops');
    setCrops(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/tasks', {
      ...form,
      cropId: form.cropId || null
    });
    setShowForm(false);
    setForm({ title: '', description: '', cropId: '', dueDate: '', priority: 'medium' });
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`/tasks/${id}`, { status });
    fetchTasks();
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'critical': return 'border-red-600 bg-red-50';
      case 'high': return 'border-orange-600 bg-orange-50';
      case 'medium': return 'border-blue-600 bg-blue-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tasks & Reminders</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <select
              value={form.cropId}
              onChange={(e) => setForm({ ...form, cropId: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">Farm-wide</option>
              {crops.map(c => (
                <option key={c.id} value={c.id}>{c.type}</option>
              ))}
            </select>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-4 py-2 border rounded-lg md:col-span-2"
              rows="3"
            />
            <div className="md:col-span-2 flex gap-4">
              <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg">
                Create Task
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className={`p-6 rounded-xl border-l-8 ${getPriorityColor(task.priority)}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{task.title}</h3>
                {task.Crop && <p className="text-sm text-gray-600 mt-1">Crop: {task.Crop.type}</p>}
                {task.description && <p className="mt-3 text-gray-700">{task.description}</p>}
                <p className="mt-3 text-sm"><strong>Due:</strong> {task.dueDate || 'No due date'}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                  className="px-4 py-2 border rounded-lg font-medium"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                  task.priority === 'critical' ? 'bg-red-200 text-red-800' :
                  task.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                  task.priority === 'medium' ? 'bg-blue-200 text-blue-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}