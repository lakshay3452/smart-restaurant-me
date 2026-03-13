const express = require("express")
const router = express.Router()

let items = []

// Get All Items
router.get("/", (req,res)=>{
    res.json(items)
})

// Add Item
router.post("/", (req,res)=>{
    const newItem = {
        id: Date.now(),
        name: req.body.name,
        price: req.body.price,
        image: req.body.image
    }

    items.push(newItem)

    res.json({
        message:"Item Added",
        item:newItem
    })
})

// Update Item
router.put("/:id",(req,res)=>{

    const item = items.find(i=>i.id == req.params.id)

    if(item){
        item.name = req.body.name
        item.price = req.body.price
        item.image = req.body.image
    }

    res.json({message:"Item Updated"})
})

// Delete Item
router.delete("/:id",(req,res)=>{

    items = items.filter(i=>i.id != req.params.id)

    res.json({message:"Item Deleted"})
})

module.exports = router