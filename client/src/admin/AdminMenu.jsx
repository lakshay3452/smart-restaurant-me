import { useState, useEffect } from "react"
import axios from "axios"

function AdminMenu() {

  const [items, setItems] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")

  const API = "http://localhost:5000/api/items"

  const fetchItems = async () => {
    const res = await axios.get(API)
    setItems(res.data)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const addItem = async () => {
    if (!name || !price || !image) return

    await axios.post(API, {
      name,
      price,
      image
    })

    setName("")
    setPrice("")
    setImage("")

    fetchItems()
  }

  const deleteItem = async (id) => {
    await axios.delete(`${API}/${id}`)
    fetchItems()
  }

  return (
    <div style={{ padding: "30px", background: "#111", minHeight: "100vh", color: "white" }}>

      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Admin Menu Panel
      </h1>

      {/* Add Item */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "30px"
      }}>

        <input
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "10px" }}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ padding: "10px" }}
        />

        <input
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={{ padding: "10px", width: "250px" }}
        />

        <button
          onClick={addItem}
          style={{
            background: "green",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Add Item
        </button>

      </div>

      {/* Menu Items */}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))",
        gap: "20px"
      }}>

        {items.map((item) => (

          <div key={item._id || item.id}
            style={{
              background: "#1e1e1e",
              padding: "15px",
              borderRadius: "10px",
              textAlign: "center"
            }}
          >

            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />

            <h3>{item.name}</h3>

            <p>₹ {item.price}</p>

            <button
              onClick={() => deleteItem(item._id || item.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "8px 15px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}

export default AdminMenu