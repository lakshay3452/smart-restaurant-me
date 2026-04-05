import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminFlashDeals() {
  const [deals, setDeals] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", discountPercent: "", startTime: "", endTime: "", daysOfWeek: [], menuItems: [] });
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchDeals(); }, []);

  const fetchDeals = async () => {
    try { const res = await axios.get("/api/flash-deals/all"); setDeals(res.data); } catch {}
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day) ? prev.daysOfWeek.filter(d => d !== day) : [...prev.daysOfWeek, day]
    }));
  };

  const addDeal = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, discountPercent: Number(form.discountPercent) };
      if (editing) {
        await axios.put(`/api/flash-deals/${editing._id}`, data);
        setEditing(null);
      } else {
        await axios.post("/api/flash-deals", data);
      }
      setForm({ title: "", description: "", discountPercent: "", startTime: "", endTime: "", daysOfWeek: [], menuItems: [] });
      fetchDeals();
    } catch (err) { alert("Error creating deal"); }
  };

  const deleteDeal = async (id) => {
    if (!window.confirm("Delete this deal?")) return;
    try { await axios.delete(`/api/flash-deals/${id}`); fetchDeals(); } catch {}
  };

  const toggleActive = async (deal) => {
    try { await axios.put(`/api/flash-deals/${deal._id}`, { active: !deal.active }); fetchDeals(); } catch {}
  };

  return (
    <div className="min-h-screen bg-black text-white pt-6 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Flash Deals / Happy Hours</h1>
        <button onClick={() => navigate("/admin")} className="bg-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-600">← Dashboard</button>
      </div>

      <form onSubmit={addDeal} className="bg-gray-900 p-6 rounded-xl mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="title" placeholder="Deal Title (e.g. Happy Hour)" value={form.title} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700" required />
        <input name="discountPercent" placeholder="Discount %" type="number" value={form.discountPercent} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700" required />
        <input name="startTime" placeholder="Start Time" type="time" value={form.startTime} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700" required />
        <input name="endTime" placeholder="End Time" type="time" value={form.endTime} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700" required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700 md:col-span-2" />
        
        <div className="md:col-span-2">
          <p className="text-gray-400 text-sm mb-2">Active Days (empty = every day):</p>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day, i) => (
              <button key={i} type="button" onClick={() => toggleDay(i)}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition ${form.daysOfWeek.includes(i) ? "bg-amber-500 text-black" : "bg-gray-700 text-white"}`}>
                {day}
              </button>
            ))}
          </div>
        </div>

        <button className="bg-amber-500 text-black py-3 rounded font-semibold hover:bg-amber-400 md:col-span-2">
          {editing ? "Update Deal" : "Create Deal"}
        </button>
      </form>

      <div className="space-y-4">
        {deals.length === 0 && <p className="text-gray-400">No flash deals yet</p>}
        {deals.map(deal => (
          <div key={deal._id} className="bg-gray-900 p-5 rounded-xl border border-gray-800 hover:border-amber-500 transition">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <h2 className="text-xl font-bold text-amber-400">{deal.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{deal.description}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                  <span>{deal.discountPercent}% OFF</span>
                  <span>{deal.startTime} - {deal.endTime}</span>
                  <span>{deal.daysOfWeek.length === 0 ? "Every day" : deal.daysOfWeek.map(d => DAYS[d]).join(", ")}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(deal)} className={`px-3 py-1.5 rounded text-sm font-semibold ${deal.active ? "bg-green-600" : "bg-gray-600"}`}>
                  {deal.active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => { setEditing(deal); setForm({ title: deal.title, description: deal.description || "", discountPercent: deal.discountPercent, startTime: deal.startTime, endTime: deal.endTime, daysOfWeek: deal.daysOfWeek || [], menuItems: deal.menuItems || [] }); }} className="bg-blue-600 px-3 py-1.5 rounded text-sm font-semibold hover:bg-blue-500">
                  Edit
                </button>
                <button onClick={() => deleteDeal(deal._id)} className="bg-red-600 px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-500">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
