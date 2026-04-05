import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminTables() {
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [seats, setSeats] = useState("4");
  const navigate = useNavigate();

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    try { const res = await axios.get("/api/tables"); setTables(res.data); } catch {}
  };

  const addTable = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tables", { tableNumber: Number(tableNumber), seats: Number(seats) });
      setTableNumber("");
      setSeats("4");
      fetchTables();
    } catch (err) { alert(err.response?.data?.message || "Error"); }
  };

  const deleteTable = async (id) => {
    if (!window.confirm("Delete this table?")) return;
    try { await axios.delete(`/api/tables/${id}`); fetchTables(); } catch {}
  };

  const getQRUrl = (tnum) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/menu?table=${tnum}`;
  };

  const printQR = (tnum) => {
    const url = getQRUrl(tnum);
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
      <head><title>Table ${tnum} QR Code</title></head>
      <body style="text-align:center;font-family:sans-serif;padding:40px;">
        <h1 style="color:#f59e0b;">LaCasa</h1>
        <h2>Table ${tnum}</h2>
        <img src="${qrApi}" alt="QR Code" style="margin:20px auto;" />
        <p style="color:#666;">Scan to order from your table</p>
        <p style="font-size:12px;color:#999;">${url}</p>
        <script>setTimeout(()=>window.print(),500)</script>
      </body>
      </html>
    `);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-6 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Table QR Management</h1>
        <button onClick={() => navigate("/admin")} className="bg-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-600">← Dashboard</button>
      </div>

      <form onSubmit={addTable} className="bg-gray-900 p-6 rounded-xl mb-8 flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-gray-400 text-sm block mb-1">Table Number</label>
          <input type="number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="p-3 bg-black rounded border border-gray-700 w-40" required min="1" />
        </div>
        <div>
          <label className="text-gray-400 text-sm block mb-1">Seats</label>
          <input type="number" value={seats} onChange={(e) => setSeats(e.target.value)} className="p-3 bg-black rounded border border-gray-700 w-40" min="1" />
        </div>
        <button className="bg-amber-500 text-black py-3 px-6 rounded font-semibold hover:bg-amber-400">Add Table</button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map(table => (
          <div key={table._id} className="bg-gray-900 p-5 rounded-xl border border-gray-800 text-center">
            <h2 className="text-2xl font-bold text-amber-400">Table {table.tableNumber}</h2>
            <p className="text-gray-400 text-sm mt-1">{table.seats} seats</p>
            
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getQRUrl(table.tableNumber))}`}
              alt={`QR Table ${table.tableNumber}`}
              className="mx-auto my-4 rounded-lg"
            />

            <div className="flex gap-2 justify-center">
              <button onClick={() => printQR(table.tableNumber)} className="bg-blue-600 px-3 py-1.5 rounded text-sm font-semibold hover:bg-blue-500">
                Print QR
              </button>
              <button onClick={() => deleteTable(table._id)} className="bg-red-600 px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-500">
                Delete
              </button>
            </div>
          </div>
        ))}
        {tables.length === 0 && <p className="text-gray-400 col-span-full text-center py-10">No tables added yet</p>}
      </div>
    </div>
  );
}
