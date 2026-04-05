import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: "", discount: "", type: "percent", minOrder: "", maxDiscount: "", description: "", expiresAt: "", usageLimit: "" });
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/api/coupons/all");
      setCoupons(res.data);
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addCoupon = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, discount: Number(form.discount), minOrder: Number(form.minOrder) || 0, maxDiscount: Number(form.maxDiscount) || 0, usageLimit: Number(form.usageLimit) || 0 };
      if (form.expiresAt) data.expiresAt = new Date(form.expiresAt);
      else delete data.expiresAt;

      if (editing) {
        await axios.put(`/api/coupons/${editing._id}`, data);
        setEditing(null);
      } else {
        await axios.post("/api/coupons", data);
      }
      setForm({ code: "", discount: "", type: "percent", minOrder: "", maxDiscount: "", description: "", expiresAt: "", usageLimit: "" });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try { await axios.delete(`/api/coupons/${id}`); fetchCoupons(); } catch (err) { console.error(err); }
  };

  const toggleActive = async (coupon) => {
    try { await axios.put(`/api/coupons/${coupon._id}`, { active: !coupon.active }); fetchCoupons(); } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-6 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Coupon Management</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate("/admin")} className="bg-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-600">← Dashboard</button>
        </div>
      </div>

      {/* ADD/EDIT FORM */}
      <form onSubmit={addCoupon} className="bg-gray-900 p-6 rounded-xl mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input name="code" placeholder="Coupon Code (e.g. SAVE20)" value={form.code} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700" required />
        <input name="discount" placeholder="Discount Value" type="number" value={form.discount} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700" required />
        <select name="type" value={form.type} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700">
          <option value="percent">Percentage (%)</option>
          <option value="flat">Flat (₹)</option>
        </select>
        <input name="minOrder" placeholder="Min Order Amount" type="number" value={form.minOrder} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700" />
        <input name="maxDiscount" placeholder="Max Discount (for %)" type="number" value={form.maxDiscount} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700" />
        <input name="usageLimit" placeholder="Usage Limit (0=unlimited)" type="number" value={form.usageLimit} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700" />
        <input name="expiresAt" placeholder="Expiry Date" type="date" value={form.expiresAt} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700" />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="p-3 bg-black rounded border border-gray-700 md:col-span-2 lg:col-span-2" />
        <button className="bg-amber-500 text-black py-3 rounded font-semibold hover:bg-amber-400 transition">
          {editing ? "Update Coupon" : "Add Coupon"}
        </button>
      </form>

      {/* COUPONS LIST */}
      <div className="space-y-4">
        {coupons.length === 0 && <p className="text-gray-400">No coupons yet</p>}
        {coupons.map(coupon => (
          <div key={coupon._id} className="bg-gray-900 p-5 rounded-xl border border-gray-800 hover:border-amber-500 transition">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-mono font-bold text-amber-400">{coupon.code}</h2>
                <p className="text-gray-400 text-sm mt-1">{coupon.description}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                  <span>{coupon.type === "percent" ? `${coupon.discount}% off` : `₹${coupon.discount} off`}</span>
                  {coupon.minOrder > 0 && <span>Min: ₹{coupon.minOrder}</span>}
                  {coupon.maxDiscount > 0 && <span>Max: ₹{coupon.maxDiscount}</span>}
                  {coupon.usageLimit > 0 && <span>Used: {coupon.usedCount}/{coupon.usageLimit}</span>}
                  {coupon.expiresAt && <span>Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(coupon)} className={`px-3 py-1.5 rounded text-sm font-semibold ${coupon.active ? "bg-green-600" : "bg-gray-600"}`}>
                  {coupon.active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => { setEditing(coupon); setForm({ code: coupon.code, discount: coupon.discount, type: coupon.type, minOrder: coupon.minOrder || "", maxDiscount: coupon.maxDiscount || "", description: coupon.description || "", expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "", usageLimit: coupon.usageLimit || "" }); }} className="bg-blue-600 px-3 py-1.5 rounded text-sm font-semibold hover:bg-blue-500">
                  Edit
                </button>
                <button onClick={() => deleteCoupon(coupon._id)} className="bg-red-600 px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-500">
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
