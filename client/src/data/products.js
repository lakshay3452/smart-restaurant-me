const categories = [
  "South Indian",
  "North Indian",
  "Chinese",
  "Italian",
  "Fast Food"
];

const baseProducts = [
  "Dosa", "Idli", "Vada", "Uttapam", "Sambar Rice",
  "Paneer Butter Masala", "Dal Makhani", "Chole", "Rajma", "Kadhai Paneer",
  "Noodles", "Fried Rice", "Manchurian", "Spring Roll", "Chilli Paneer",
  "Pizza", "Pasta", "Lasagna", "Garlic Bread", "Risotto",
  "Burger", "Sandwich", "Fries", "Wrap", "Hotdog"
];

const imageMap = {
  "Dosa": "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
  "Idli": "https://images.pexels.com/photos/5560762/pexels-photo-5560762.jpeg",
  "Vada": "https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg",
  "Uttapam": "https://images.pexels.com/photos/5560760/pexels-photo-5560760.jpeg",
  "Sambar Rice": "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",

  "Paneer Butter Masala": "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg",
  "Dal Makhani": "https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg",
  "Chole": "https://images.pexels.com/photos/5949888/pexels-photo-5949888.jpeg",
  "Rajma": "https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg",
  "Kadhai Paneer": "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg",

  "Noodles": "https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg",
  "Fried Rice": "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg",
  "Manchurian": "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
  "Spring Roll": "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
  "Chilli Paneer": "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",

  "Pizza": "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
  "Pasta": "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
  "Lasagna": "https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg",
  "Garlic Bread": "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg",
  "Risotto": "https://images.pexels.com/photos/6287525/pexels-photo-6287525.jpeg",

  "Burger": "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg",
  "Sandwich": "https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg",
  "Fries": "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg",
  "Wrap": "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
  "Hotdog": "https://images.pexels.com/photos/4518656/pexels-photo-4518656.jpeg"
};

let products = [];

for (let i = 1; i <= 20; i++) {
  baseProducts.forEach((item, index) => {
    products.push({
      id: products.length + 1,
      name: item + " " + i,
      price: 100 + (index * 10),
      category: categories[Math.floor(index / 5)],
      image: imageMap[item]
    });
  });
}

export default products;