import { useState, useEffect } from "react"
import axios from "axios"

const INITIAL_FORM = {
  name: "", price: "", category: "", image: "", description: "", isVeg: true, rating: "4.0", bestseller: false
}

/* Hardcoded fallback — used for seeding DB */
const SEED_DATA = [
  { name: "Paneer Tikka", description: "Succulent paneer cubes marinated in aromatic tandoori spices, grilled to smoky perfection in clay oven", price: 220, category: "Starters", image: "/paneer-tikka.jpg", isVeg: true, rating: 4.5, bestseller: true },
  { name: "Veg Spring Rolls", description: "Crispy golden rolls stuffed with seasoned vegetables, served with sweet chili sauce", price: 180, category: "Starters", image: "/spring-roll.jpg", isVeg: true, rating: 4.2, bestseller: false },
  { name: "Mushroom Galawati", description: "Melt-in-mouth mushroom kebabs inspired by Lucknowi royal kitchens", price: 240, category: "Starters", image: "/mushroom-galawati.jpg", isVeg: true, rating: 4.6, bestseller: true },
  { name: "Chicken Tikka", description: "Tender chicken pieces marinated in yogurt and spices, char-grilled in tandoor", price: 280, category: "Starters", image: "/chicken-tikka.jpg", isVeg: false, rating: 4.7, bestseller: true },
  { name: "Fish Amritsari", description: "Crispy batter-fried fish fillets seasoned with ajwain and chaat masala", price: 320, category: "Starters", image: "/fish-amritsari.jpg", isVeg: false, rating: 4.4, bestseller: false },
  { name: "Paneer Butter Masala", description: "Rich and creamy tomato-based curry with soft paneer cubes, finished with butter and cream", price: 260, category: "Main Course", image: "/paneer-butter-masala.jpg", isVeg: true, rating: 4.7, bestseller: true },
  { name: "Dal Makhani", description: "Slow-cooked black lentils in a rich buttery gravy, simmered overnight for deep flavour", price: 240, category: "Main Course", image: "/dal-makhani.jpg", isVeg: true, rating: 4.6, bestseller: true },
  { name: "Mix Veg Curry", description: "Fresh seasonal vegetables cooked in aromatic gravy with whole spices", price: 230, category: "Main Course", image: "/mix-veg.jpg", isVeg: true, rating: 4.1, bestseller: false },
  { name: "Kadai Paneer", description: "Paneer cubes tossed with capsicum in a spicy kadai masala gravy", price: 270, category: "Main Course", image: "/kadai-paneer.jpg", isVeg: true, rating: 4.4, bestseller: false },
  { name: "Butter Chicken", description: "Tender chicken in a luscious tomato-butter gravy, a timeless North Indian classic", price: 300, category: "Main Course", image: "/butter-chicken.jpg", isVeg: false, rating: 4.8, bestseller: true },
  { name: "Mutton Rogan Josh", description: "Aromatic Kashmiri-style mutton curry slow-cooked with whole spices", price: 380, category: "Main Course", image: "/mutton-rogan-josh.jpg", isVeg: false, rating: 4.5, bestseller: false },
  { name: "Veg Biryani", description: "Fragrant basmati rice layered with spiced vegetables and saffron, cooked dum style", price: 250, category: "Rice & Biryani", image: "/veg-biryani.jpg", isVeg: true, rating: 4.3, bestseller: false },
  { name: "Plain Rice", description: "Steamed long-grain basmati rice, perfectly fluffy", price: 120, category: "Rice & Biryani", image: "/plain-rice.jpg", isVeg: true, rating: 4.0, bestseller: false },
  { name: "Jeera Rice", description: "Aromatic basmati rice tempered with cumin seeds and ghee", price: 160, category: "Rice & Biryani", image: "/jeera-rice.jpg", isVeg: true, rating: 4.2, bestseller: false },
  { name: "Chicken Biryani", description: "Royal Hyderabadi-style dum biryani with tender chicken and aromatic spices", price: 320, category: "Rice & Biryani", image: "/chicken-biryani.jpg", isVeg: false, rating: 4.8, bestseller: true },
  { name: "Mutton Biryani", description: "Slow-cooked mutton biryani with layered basmati rice and saffron", price: 380, category: "Rice & Biryani", image: "/mutton-biryani.jpg", isVeg: false, rating: 4.7, bestseller: true },
  { name: "Butter Naan", description: "Soft leavened bread baked in tandoor, brushed with butter", price: 60, category: "Breads", image: "/butter-naan.jpg", isVeg: true, rating: 4.5, bestseller: true },
  { name: "Lachha Paratha", description: "Flaky layered paratha made with whole wheat, crispy and buttery", price: 60, category: "Breads", image: "/lachha-paratha.jpg", isVeg: true, rating: 4.3, bestseller: false },
  { name: "Garlic Naan", description: "Tandoor-baked naan topped with garlic, butter and fresh coriander", price: 70, category: "Breads", image: "/garlic-naan.jpg", isVeg: true, rating: 4.6, bestseller: true },
  { name: "Tandoori Roti", description: "Traditional whole wheat flatbread baked in clay oven", price: 40, category: "Breads", image: "/tandoori-roti.jpg", isVeg: true, rating: 4.1, bestseller: false },
  { name: "Veg Hakka Noodles", description: "Stir-fried noodles tossed with crunchy vegetables in Indo-Chinese soy sauce", price: 190, category: "Chinese", image: "/hakka-noodles.jpg", isVeg: true, rating: 4.2, bestseller: false },
  { name: "Chilli Garlic Noodles", description: "Spicy noodles wok-tossed with garlic, green chillies and soy sauce", price: 220, category: "Chinese", image: "/chilli-noodles.jpg", isVeg: true, rating: 4.3, bestseller: false },
  { name: "Veg Manchurian", description: "Crispy vegetable balls in a tangy, spicy Manchurian sauce", price: 200, category: "Chinese", image: "/veg-manchurian.jpg", isVeg: true, rating: 4.1, bestseller: false },
  { name: "Chicken Fried Rice", description: "Wok-tossed rice with tender chicken, eggs, and vegetables", price: 240, category: "Chinese", image: "/chicken-fried-rice.jpg", isVeg: false, rating: 4.4, bestseller: false },
  { name: "Veg Burger", description: "Crispy aloo tikki burger with fresh lettuce, tomato and special sauce", price: 80, category: "Fast Food", image: "/veg-burger.jpg", isVeg: true, rating: 4.0, bestseller: false },
  { name: "French Fries", description: "Golden crispy potato fries seasoned with peri-peri masala", price: 100, category: "Fast Food", image: "/fries.jpg", isVeg: true, rating: 4.1, bestseller: false },
  { name: "Cheese Burger", description: "Juicy patty loaded with melted cheese, pickles, and house sauce", price: 150, category: "Fast Food", image: "/cheese-burger.jpg", isVeg: false, rating: 4.3, bestseller: false },
  { name: "Chicken Wrap", description: "Grilled chicken wrapped in tortilla with veggies and mayo", price: 180, category: "Fast Food", image: "/chicken-wrap.jpg", isVeg: false, rating: 4.2, bestseller: false },
  { name: "Mineral Water", description: "Packaged drinking water 500ml", price: 30, category: "Beverages", image: "/mineral-water.jpg", isVeg: true, rating: 4.0, bestseller: false },
  { name: "Cold Coffee", description: "Creamy cold coffee blended with ice cream and chocolate drizzle", price: 120, category: "Beverages", image: "/cold-coffee.jpg", isVeg: true, rating: 4.5, bestseller: true },
  { name: "Mango Shake", description: "Fresh Alphonso mango milkshake, thick and creamy", price: 80, category: "Beverages", image: "/mango-shake.jpg", isVeg: true, rating: 4.6, bestseller: true },
  { name: "Masala Chai", description: "Traditional Indian spiced tea brewed with cardamom and ginger", price: 40, category: "Beverages", image: "/masala-chai.jpg", isVeg: true, rating: 4.4, bestseller: false },
  { name: "Fresh Lime Soda", description: "Refreshing lime soda with mint, sweet or salted", price: 60, category: "Beverages", image: "/lime-soda.jpg", isVeg: true, rating: 4.3, bestseller: false },
  { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten chocolate center, served with vanilla ice cream", price: 170, category: "Desserts", image: "/chocolate-lava.jpg", isVeg: true, rating: 4.7, bestseller: true },
  { name: "Vanilla Ice Cream", description: "Two scoops of premium vanilla bean ice cream", price: 80, category: "Desserts", image: "/vanilla-ice-cream.jpg", isVeg: true, rating: 4.2, bestseller: false },
  { name: "Rasmalai", description: "Soft cottage cheese dumplings soaked in saffron-flavored milk", price: 100, category: "Desserts", image: "/rasmalai.jpg", isVeg: true, rating: 4.5, bestseller: true },
  { name: "Brownie with Ice Cream", description: "Warm fudgy brownie topped with vanilla ice cream and chocolate sauce", price: 150, category: "Desserts", image: "/brownie.jpg", isVeg: true, rating: 4.6, bestseller: false },
  { name: "Gulab Jamun", description: "Soft milk-solid dumplings soaked in rose-flavored sugar syrup", price: 40, category: "Desserts", image: "/gulab-jamun.jpg", isVeg: true, rating: 4.4, bestseller: false },
];

export default function AdminMenu(){

const [items,setItems] = useState([])
const [search,setSearch] = useState("")
const [editing,setEditing] = useState(null)
const [seeding,setSeeding] = useState(false)

const [form,setForm] = useState({...INITIAL_FORM})

useEffect(()=>{
fetchItems()
},[])

const fetchItems = async()=>{
try {
const res = await axios.get("/api/menu")
setItems(res.data)
} catch(error) {
console.error("Error fetching items:", error)
}
}

const handleChange = (e)=>{
const { name, value, type, checked } = e.target
setForm({...form, [name]: type === "checkbox" ? checked : value })
}

const addItem = async(e)=>{
e.preventDefault()
try {
await axios.post("/api/menu", { ...form, price: Number(form.price), rating: Number(form.rating) })
fetchItems()
setForm({...INITIAL_FORM})
} catch(error) {
console.error("Error adding item:", error)
}
}

const deleteItem = async(id)=>{
if(!window.confirm("Delete this item?")) return
try {
await axios.delete(`/api/menu/${id}`)
fetchItems()
} catch(error) {
console.error("Error deleting item:", error)
}
}

const toggleAvailability = async(item)=>{
try {
await axios.patch(`/api/menu/${item._id}/toggle`)
fetchItems()
} catch(error) {
console.error("Error toggling availability:", error)
}
}

const startEdit = (item)=>{
setEditing(item)
setForm({ ...item })
}

const cancelEdit = ()=>{
setEditing(null)
setForm({...INITIAL_FORM})
}

const updateItem = async()=>{
try {
await axios.put(`/api/menu/${editing._id}`, { ...form, price: Number(form.price), rating: Number(form.rating) })
setEditing(null)
setForm({...INITIAL_FORM})
fetchItems()
} catch(error) {
console.error("Error updating item:", error)
}
}

const seedMenu = async()=>{
if(!window.confirm("This will add all default menu items to the database. Continue?")) return
setSeeding(true)
try {
const res = await axios.post("/api/menu/seed", SEED_DATA)
alert(res.data.message)
fetchItems()
} catch(error) {
alert(error.response?.data?.message || "Seed failed")
}
setSeeding(false)
}

const filteredItems = items.filter(item =>
item.name?.toLowerCase().includes(search.toLowerCase())
)

return(

<div className="min-h-screen bg-[#0f0f0f] text-white p-4 md:p-8">

<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
  <h1 className="text-2xl md:text-3xl text-yellow-400">Admin Menu</h1>
  <div className="flex items-center gap-3">
    <span className="text-white/40 text-sm">{items.length} items in DB</span>
    {items.length === 0 && (
      <button onClick={seedMenu} disabled={seeding} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50">
        {seeding ? "Seeding..." : "🌱 Seed Default Menu"}
      </button>
    )}
  </div>
</div>

{/* ADD ITEM */}
<form onSubmit={addItem} className="bg-[#1a1a1a] p-4 md:p-6 rounded-xl mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">

<input name="name" placeholder="Food Name" value={form.name} onChange={handleChange} className="p-3 bg-black rounded" required />
<input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} className="p-3 bg-black rounded" required />

<select name="category" value={form.category} onChange={handleChange} className="p-3 bg-black rounded">
  <option value="">Select Category</option>
  <option>Starters</option>
  <option>Main Course</option>
  <option>Rice & Biryani</option>
  <option>Breads</option>
  <option>Chinese</option>
  <option>Fast Food</option>
  <option>Beverages</option>
  <option>Desserts</option>
</select>

<input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="p-3 bg-black rounded" />

<textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="p-3 bg-black rounded md:col-span-2" />

<div className="flex flex-wrap items-center gap-6 md:col-span-2">
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="checkbox" name="isVeg" checked={form.isVeg} onChange={handleChange} className="w-4 h-4 accent-green-500" />
    <span className="text-sm">Veg</span>
  </label>
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="checkbox" name="bestseller" checked={form.bestseller} onChange={handleChange} className="w-4 h-4 accent-yellow-500" />
    <span className="text-sm">Bestseller</span>
  </label>
  <div className="flex items-center gap-2">
    <span className="text-sm text-white/60">Rating:</span>
    <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} className="p-2 bg-black rounded w-20 text-sm" />
  </div>
</div>

<button className="bg-yellow-500 text-black py-3 rounded font-semibold md:col-span-2">
  Add Item
</button>

</form>

{/* SEARCH */}
<input placeholder="Search food..." value={search} onChange={(e)=>setSearch(e.target.value)} className="mb-8 p-3 rounded bg-[#1a1a1a] w-full" />

{/* FOOD CARDS */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

{filteredItems.map(item=>(
<div key={item._id} className="bg-[#1a1a1a] rounded-xl p-4">

<img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded" />

<div className="flex items-center gap-2 mt-3">
  <h3 className="text-lg flex-1">{item.name}</h3>
  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${item.isVeg ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}>
    {item.isVeg ? "VEG" : "NON"}
  </span>
</div>

<p className="text-gray-400 text-sm">{item.category}</p>
<p className="text-white/40 text-xs mt-1 line-clamp-2">{item.description}</p>

<div className="flex items-center justify-between mt-2">
  <p className="text-yellow-400 text-lg font-semibold">₹{item.price}</p>
  <div className="flex items-center gap-1 text-xs text-white/50">
    ⭐ {item.rating || "—"}
    {item.bestseller && <span className="ml-1 bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded text-[10px]">Best</span>}
  </div>
</div>

<button onClick={()=>toggleAvailability(item)} className={`mt-2 w-full px-3 py-1.5 rounded text-sm font-medium ${item.available ? "bg-green-600/20 text-green-400 border border-green-600/30" : "bg-gray-600/20 text-gray-400 border border-gray-600/30"}`}>
  {item.available ? "✓ Available":"✗ Out of Stock"}
</button>

<div className="flex gap-2 mt-3">
<button onClick={()=>startEdit(item)} className="flex-1 bg-yellow-500 text-black px-3 py-1.5 rounded text-sm font-semibold">Edit</button>
<button onClick={()=>deleteItem(item._id)} className="flex-1 bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1.5 rounded text-sm font-semibold">Delete</button>
</div>

</div>
))}

</div>

{items.length === 0 && !seeding && (
  <div className="text-center py-20 text-white/30">
    <p className="text-xl mb-2">No menu items in database</p>
    <p className="text-sm mb-4">Click "Seed Default Menu" above to add all items, or add them manually</p>
  </div>
)}

{/* EDIT MODAL */}
{editing && (
<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={cancelEdit}>
<div className="bg-[#1a1a1a] p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>

<h2 className="text-xl text-yellow-400 mb-4">Edit Item</h2>

<input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="p-3 bg-black rounded w-full mb-3" />
<input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} className="p-3 bg-black rounded w-full mb-3" />

<select name="category" value={form.category} onChange={handleChange} className="p-3 bg-black rounded w-full mb-3">
  <option value="">Select Category</option>
  <option>Starters</option>
  <option>Main Course</option>
  <option>Rice & Biryani</option>
  <option>Breads</option>
  <option>Chinese</option>
  <option>Fast Food</option>
  <option>Beverages</option>
  <option>Desserts</option>
</select>

<input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="p-3 bg-black rounded w-full mb-3" />
<textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="p-3 bg-black rounded w-full mb-3" rows={3} />

<div className="flex flex-wrap items-center gap-6 mb-4">
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="checkbox" name="isVeg" checked={form.isVeg} onChange={handleChange} className="w-4 h-4 accent-green-500" />
    <span className="text-sm">Veg</span>
  </label>
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="checkbox" name="bestseller" checked={form.bestseller} onChange={handleChange} className="w-4 h-4 accent-yellow-500" />
    <span className="text-sm">Bestseller</span>
  </label>
  <div className="flex items-center gap-2">
    <span className="text-sm text-white/60">Rating:</span>
    <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} className="p-2 bg-black rounded w-20 text-sm" />
  </div>
</div>

<div className="flex gap-3">
  <button onClick={updateItem} className="flex-1 bg-yellow-500 text-black px-4 py-2.5 rounded font-semibold">Update</button>
  <button onClick={cancelEdit} className="flex-1 bg-gray-700 px-4 py-2.5 rounded font-semibold">Cancel</button>
</div>

</div>
</div>
)}

</div>

)

}