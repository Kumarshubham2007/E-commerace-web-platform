const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for ZenithStore...');

  // Clean existing tables in order
  try {
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log('Clean table notice:', e.message);
  }

  // 1. Create Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const userPassword = await bcrypt.hash('user123', salt);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Store Administrator',
      email: 'admin@store.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+1 (555) 019-2834',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
      country: 'United States',
    },
  });

  const johnUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'USER',
      phone: '+1 (555) 839-1029',
      street: '456 Elm Street',
      city: 'Seattle',
      postalCode: '98101',
      country: 'United States',
    },
  });

  const sarahUser = await prisma.user.create({
    data: {
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: userPassword,
      role: 'USER',
      phone: '+1 (555) 234-5678',
      street: '100 Sunset Boulevard',
      city: 'Los Angeles',
      postalCode: '90028',
      country: 'United States',
    },
  });

  console.log('✅ Users created: admin@store.com & john@example.com');

  // 2. Create Products
  const productsData = [
    {
      name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
      slug: 'sony-wh-1000xm5-wireless-headphones',
      description: 'Industry-leading noise cancellation optimized to your environment. Crystal-clear hands-free calling with 4 beamforming microphones, and up to 30 hours of battery life with quick charging.',
      price: 399.99,
      compareAtPrice: 449.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      ]),
      category: 'Electronics',
      brand: 'Sony',
      countInStock: 25,
      rating: 4.8,
      numReviews: 124,
      isFeatured: true,
      specs: JSON.stringify({
        'Battery Life': '30 Hours',
        'Connectivity': 'Bluetooth 5.2 / 3.5mm Aux',
        'Noise Cancellation': 'Dual Processor V1 + HD QN1',
        'Weight': '250g',
      }),
    },
    {
      name: 'Apple MacBook Air 15" M3 Chip',
      slug: 'apple-macbook-air-15-m3',
      description: 'Strikingly thin and fast with the M3 chip. Delivers incredible speed, 18 hours of all-day battery life, and a brilliant Liquid Retina display in an ultralight unibody design.',
      price: 1299.00,
      compareAtPrice: 1499.00,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
      ]),
      category: 'Electronics',
      brand: 'Apple',
      countInStock: 14,
      rating: 4.9,
      numReviews: 89,
      isFeatured: true,
      specs: JSON.stringify({
        'Processor': 'Apple M3 8-core CPU / 10-core GPU',
        'Memory': '16GB Unified Memory',
        'Storage': '512GB SSD Storage',
        'Display': '15.3-inch Liquid Retina Display',
      }),
    },
    {
      name: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Powered by Galaxy AI. Titanium shield exterior, built-in S Pen, 200MP camera zoom capabilities, and the fastest Snapdragon processor ever in a smartphone.',
      price: 1199.99,
      compareAtPrice: 1299.99,
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
      ]),
      category: 'Electronics',
      brand: 'Samsung',
      countInStock: 18,
      rating: 4.7,
      numReviews: 64,
      isFeatured: true,
      specs: JSON.stringify({
        'Screen': '6.8" Dynamic AMOLED 2X 120Hz',
        'Camera': '200MP Main + 50MP Periscope Telephoto',
        'Battery': '5000 mAh Super Fast Charge',
      }),
    },
    {
      name: 'Logitech MX Master 3S Wireless Performance Mouse',
      slug: 'logitech-mx-master-3s-mouse',
      description: 'Feel every single moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor.',
      price: 99.99,
      compareAtPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
      ]),
      category: 'Electronics',
      brand: 'Logitech',
      countInStock: 42,
      rating: 4.9,
      numReviews: 210,
      isFeatured: false,
      specs: JSON.stringify({
        'Sensor': 'Darkfield 8000 DPI',
        'Battery': 'Up to 70 days per charge',
        'Scroll Wheel': 'MagSpeed Electromagnetic scrolling',
      }),
    },
    {
      name: 'Nike Air Max 270 Responsive Running Sneakers',
      slug: 'nike-air-max-270-sneakers',
      description: 'Boasts Nike\'s biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks. Engineered mesh upper breathes easy and conforms to your foot.',
      price: 159.99,
      compareAtPrice: 180.00,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      ]),
      category: 'Footwear',
      brand: 'Nike',
      countInStock: 30,
      rating: 4.6,
      numReviews: 76,
      isFeatured: true,
      specs: JSON.stringify({
        'Material': 'Woven and synthetic upper',
        'Sole': 'Max Air 270 cushioning unit',
        'Color': 'Sport Red / Black / White',
      }),
    },
    {
      name: 'Patagonia Nano Puff Ultralight Insulated Jacket',
      slug: 'patagonia-nano-puff-jacket',
      description: 'Warm, windproof, water-resistant. The Nano Puff Jacket uses incredibly lightweight and highly compressible 60-g PrimaLoft Gold Insulation Eco with 100% recycled polyester shell.',
      price: 239.00,
      compareAtPrice: 269.00,
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
      ]),
      category: 'Apparel',
      brand: 'Patagonia',
      countInStock: 19,
      rating: 4.8,
      numReviews: 45,
      isFeatured: false,
      specs: JSON.stringify({
        'Material': '100% recycled polyester ripstop',
        'Insulation': '60g PrimaLoft Gold Insulation',
        'Fit': 'Regular Fit with drawcord hem',
      }),
    },
    {
      name: 'Nespresso VertuoPlus Deluxe Coffee & Espresso Maker',
      slug: 'nespresso-vertuoplus-coffee-maker',
      description: 'Brew 5 cup sizes at the touch of a single button with Centrifusion extraction technology. Read barcode on each capsule to automatically tailor brewing parameters.',
      price: 189.99,
      compareAtPrice: 229.00,
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
      ]),
      category: 'Home & Kitchen',
      brand: 'Nespresso',
      countInStock: 12,
      rating: 4.7,
      numReviews: 53,
      isFeatured: false,
      specs: JSON.stringify({
        'Water Tank': '60 oz movable reservoir',
        'Heat Up Time': '20 to 25 seconds',
        'Capsule Ejection': 'Automatic container holds 10 used pods',
      }),
    },
    {
      name: 'Ember Temperature Control Smart Ceramic Mug 2 (14 oz)',
      slug: 'ember-smart-temperature-mug-2',
      description: 'Keep your hot coffee or tea at your exact preferred drinking temperature (120°F - 145°F) for up to 80 minutes on a single charge, or all day on the included charging coaster.',
      price: 149.95,
      compareAtPrice: 169.95,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      ]),
      category: 'Home & Kitchen',
      brand: 'Ember',
      countInStock: 3, // Low stock demo!
      rating: 4.5,
      numReviews: 32,
      isFeatured: true,
      specs: JSON.stringify({
        'Capacity': '14 fl oz / 414 ml',
        'Battery': '80 mins on battery, all day on coaster',
        'App Control': 'iOS & Android Bluetooth Sync',
      }),
    },
    {
      name: 'Peak Design Everyday Backpack 20L V2',
      slug: 'peak-design-everyday-backpack-20l',
      description: 'An iconic, award-winning pack for everyday and photo carry. Built around access, organization, expansion, and protection with MagLatch hardware and FlexFold dividers.',
      price: 279.95,
      compareAtPrice: 299.95,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      ]),
      category: 'Accessories',
      brand: 'Peak Design',
      countInStock: 2, // Low stock demo!
      rating: 4.9,
      numReviews: 118,
      isFeatured: false,
      specs: JSON.stringify({
        'Capacity': '20L max',
        'Laptop Carry': 'Holds up to 16" MacBook Pro',
        'Weatherproofing': '100% recycled 400D nylon canvas shell',
      }),
    },
    {
      name: 'Ray-Ban Classic Aviator Polarized Sunglasses',
      slug: 'ray-ban-classic-aviator-polarized',
      description: 'Originally designed for US aviators in 1937. Legendary teardrop shape frame with crystal green polarized lenses offering 100% UV protection and supreme clarity.',
      price: 179.00,
      compareAtPrice: 210.00,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
      ]),
      category: 'Accessories',
      brand: 'Ray-Ban',
      countInStock: 16,
      rating: 4.8,
      numReviews: 95,
      isFeatured: false,
      specs: JSON.stringify({
        'Frame': 'Polished Gold Metal',
        'Lenses': 'G-15 Polarized Green',
        'UV Protection': 'UV400 100% Filter',
      }),
    },
    {
      name: 'Dyson V15 Detect Cordless Vacuum Cleaner',
      slug: 'dyson-v15-detect-vacuum',
      description: 'Dyson\'s most powerful, intelligent cordless vacuum. Features a laser that reveals invisible dust on hard floors and an acoustic piezo sensor that measures microscopic dust particles.',
      price: 749.99,
      compareAtPrice: 799.99,
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
      ]),
      category: 'Home & Kitchen',
      brand: 'Dyson',
      countInStock: 9,
      rating: 4.8,
      numReviews: 68,
      isFeatured: false,
      specs: JSON.stringify({
        'Suction Power': '230 AW in Boost Mode',
        'Run Time': 'Up to 60 minutes',
        'Bin Volume': '0.77 Liters',
      }),
    },
    {
      name: 'Dell UltraSharp 27" 4K UHD USB-C Hub Monitor (U2723QE)',
      slug: 'dell-ultrasharp-27-4k-monitor',
      description: 'Be your most productive on this 27-inch 4K monitor with brilliant color and contrast that features industry-first IPS Black technology and high connectivity USB-C hub.',
      price: 529.99,
      compareAtPrice: 599.99,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
      ]),
      category: 'Electronics',
      brand: 'Dell',
      countInStock: 11,
      rating: 4.7,
      numReviews: 41,
      isFeatured: true,
      specs: JSON.stringify({
        'Resolution': '3840 x 2160 at 60 Hz (4K UHD)',
        'Panel': 'IPS Black 2000:1 Contrast Ratio',
        'Charging': 'USB-C 90W Power Delivery',
      }),
    },
  ];

  const createdProducts = [];
  for (const prod of productsData) {
    const p = await prisma.product.create({ data: prod });
    createdProducts.push(p);
  }

  console.log(`✅ ${createdProducts.length} Products created successfully`);

  // 3. Add Customer Reviews
  await prisma.review.create({
    data: {
      userId: johnUser.id,
      productId: createdProducts[0].id,
      userName: johnUser.name,
      rating: 5,
      comment: 'The active noise cancellation is pure sorcery on long flights. Comfortable enough for 8-hour work sessions!',
    },
  });

  await prisma.review.create({
    data: {
      userId: sarahUser.id,
      productId: createdProducts[1].id,
      userName: sarahUser.name,
      rating: 5,
      comment: 'Blazing fast, sleek, and the battery literally lasts me two full days of coding and media editing.',
    },
  });

  console.log('✅ Customer reviews added');

  // 4. Create Sample Orders with Detailed Tracking Timelines
  // Order 1: Delivered
  const deliveredOrder = await prisma.order.create({
    data: {
      orderNumber: 'ORD-202610-8291',
      userId: johnUser.id,
      itemsPrice: 399.99,
      shippingPrice: 0,
      taxPrice: 32.00,
      discount: 0,
      totalPrice: 431.99,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      paidAt: new Date(Date.now() - 6 * 24 * 3600 * 1000),
      orderStatus: 'Delivered',
      carrier: 'FedEx Express',
      trackingNumber: 'TRK-982103842',
      estimatedDelivery: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      deliveredAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      shippingName: 'John Doe',
      shippingAddress: '456 Elm Street',
      shippingCity: 'Seattle',
      shippingPostalCode: '98101',
      shippingCountry: 'United States',
      shippingPhone: '+1 (555) 839-1029',
      statusHistory: JSON.stringify([
        {
          status: 'Placed',
          timestamp: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
          note: 'Order confirmed and payment verified via Visa ending in 4242.',
        },
        {
          status: 'Processing',
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
          note: 'Package inspected, sanitized, and packed in eco-friendly protective box.',
        },
        {
          status: 'Shipped',
          timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
          note: 'Dispatched from Seattle Distribution Hub via FedEx Express (TRK-982103842).',
        },
        {
          status: 'Delivered',
          timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
          note: 'Delivered at front porch. Signed by John Doe.',
        },
      ]),
      orderItems: {
        create: [
          {
            productId: createdProducts[0].id,
            name: createdProducts[0].name,
            image: createdProducts[0].image,
            price: createdProducts[0].price,
            quantity: 1,
          },
        ],
      },
    },
  });

  // Order 2: Shipped & In Transit
  const shippedOrder = await prisma.order.create({
    data: {
      orderNumber: 'ORD-202611-3942',
      userId: sarahUser.id,
      itemsPrice: 1299.00 + 99.99,
      shippingPrice: 15.00,
      taxPrice: 111.92,
      discount: 50.00,
      totalPrice: 1475.91,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      paidAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      orderStatus: 'Shipped',
      carrier: 'UPS Air Cargo',
      trackingNumber: 'TRK-492019385',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 3600 * 1000),
      shippingName: 'Sarah Connor',
      shippingAddress: '100 Sunset Boulevard',
      shippingCity: 'Los Angeles',
      shippingPostalCode: '90028',
      shippingCountry: 'United States',
      shippingPhone: '+1 (555) 234-5678',
      statusHistory: JSON.stringify([
        {
          status: 'Placed',
          timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
          note: 'Order placed online with promotional code SAVE50 applied.',
        },
        {
          status: 'Processing',
          timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
          note: 'Items consolidated and prepared for high-value logistics dispatch.',
        },
        {
          status: 'Shipped',
          timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
          note: 'Departed Los Angeles Hub sorted to final delivery carrier.',
        },
      ]),
      orderItems: {
        create: [
          {
            productId: createdProducts[1].id,
            name: createdProducts[1].name,
            image: createdProducts[1].image,
            price: createdProducts[1].price,
            quantity: 1,
          },
          {
            productId: createdProducts[3].id,
            name: createdProducts[3].name,
            image: createdProducts[3].image,
            price: createdProducts[3].price,
            quantity: 1,
          },
        ],
      },
    },
  });

  // Order 3: Processing
  const processingOrder = await prisma.order.create({
    data: {
      orderNumber: 'ORD-202611-9012',
      userId: johnUser.id,
      itemsPrice: 159.99,
      shippingPrice: 10.00,
      taxPrice: 12.80,
      discount: 0,
      totalPrice: 182.79,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
      carrier: 'DHL Express',
      trackingNumber: 'TRK-109283741',
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 3600 * 1000),
      shippingName: 'John Doe',
      shippingAddress: '456 Elm Street',
      shippingCity: 'Seattle',
      shippingPostalCode: '98101',
      shippingCountry: 'United States',
      shippingPhone: '+1 (555) 839-1029',
      statusHistory: JSON.stringify([
        {
          status: 'Placed',
          timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
          note: 'Order confirmed with Cash on Delivery payment option.',
        },
        {
          status: 'Processing',
          timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          note: 'Order being picked from warehouse section B-12.',
        },
      ]),
      orderItems: {
        create: [
          {
            productId: createdProducts[4].id,
            name: createdProducts[4].name,
            image: createdProducts[4].image,
            price: createdProducts[4].price,
            quantity: 1,
          },
        ],
      },
    },
  });

  console.log('✅ 3 Sample orders with tracking histories created');
  console.log('🎉 Seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

