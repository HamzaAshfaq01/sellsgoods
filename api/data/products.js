const products = [
  {
    title: 'Airpods Wireless Bluetooth Headphones',
    description:
      'Bluetooth technology lets you connect it with compatible devices wirelessly. High-quality AAC audio offers immersive listening experience. Built-in microphone allows you to take calls while working.',
    price: 89.99,
    categoryType: 'electronics', // Refers to a Category ObjectId, update this to the actual ObjectId later
    seller: 'SellerID123', // Update with actual seller's user ID
    condition: 'new',
    tags: ['Bluetooth', 'Wireless', 'Headphones', 'Apple'],
    images: ['/images/airpods.jpg'],
    location: 'New York, USA',
    isAvailable: true,
  },
  {
    title: 'iPhone 13 Pro 256GB Memory',
    description:
      'Introducing the iPhone 13 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life.',
    price: 599.99,
    categoryType: 'mobiles',
    seller: 'SellerID456', // Update with actual seller's user ID
    condition: 'new',
    tags: ['iPhone', 'Smartphone', 'Apple', 'Mobile'],
    images: ['/images/phone.jpg'],
    location: 'California, USA',
    isAvailable: true,
  },
  {
    title: 'Cannon EOS 80D DSLR Camera',
    description:
      'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design.',
    price: 929.99,
    categoryType: 'mobiles',
    seller: 'SellerID789', // Update with actual seller's user ID
    condition: 'new',
    tags: ['Camera', 'DSLR', 'Photography', 'Canon'],
    images: ['/images/camera.jpg'],
    location: 'Los Angeles, USA',
    isAvailable: true,
  },
  {
    title: 'Sony Playstation 5',
    description:
      'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music.',
    price: 399.99,
    categoryType: 'electronics',
    seller: 'SellerID123', // Update with actual seller's user ID
    condition: 'new',
    tags: ['Playstation', 'Gaming', 'Sony'],
    images: ['/images/playstation.jpg'],
    location: 'Texas, USA',
    isAvailable: true,
  },
  {
    title: 'Logitech G-Series Gaming Mouse',
    description:
      'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience.',
    price: 49.99,
    categoryType: 'mobiles',
    seller: 'SellerID456', // Update with actual seller's user ID
    condition: 'used',
    tags: ['Gaming', 'Mouse', 'Logitech'],
    images: ['/images/mouse.jpg'],
    location: 'Florida, USA',
    isAvailable: true,
  },
  {
    title: 'Amazon Echo Dot 3rd Generation',
    description:
      'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small spaces.',
    price: 29.99,
    categoryType: 'electronics',
    seller: 'SellerID789', // Update with actual seller's user ID
    condition: 'used',
    tags: ['Smart Speaker', 'Amazon', 'Echo Dot'],
    images: ['/images/alexa.jpg'],
    location: 'Chicago, USA',
    isAvailable: false, // Out of stock
  },
];

export default products;
