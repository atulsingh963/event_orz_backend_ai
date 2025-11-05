const mongoose = require('mongoose');
require('dotenv').config();
const Venue = require('../models/Venue');

const bhopalVenues = [
  {
    name: 'Jehan Numa Palace Hotel',
    location: {
      address: 'Shamla Hills',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462013',
      country: 'India'
    },
    capacity: 500,
    pricePerDay: 35000,
    amenities: ['Banquet Hall', 'Catering', 'Parking', 'AC', 'WiFi'],
    availableAddOns: [
      { name: 'Premium Catering Package', description: 'Multi-cuisine buffet with live counters', price: 1500, category: 'catering' },
      { name: 'Decoration Package', description: 'Floral and thematic decoration', price: 8000, category: 'decoration' },
      { name: 'Sound & Lighting System', description: 'Professional audio-visual setup', price: 5000, category: 'equipment' },
      { name: 'Valet Parking Service', description: 'Professional valet attendants', price: 3000, category: 'service' },
      { name: 'Live Band Performance', description: 'Professional entertainment band', price: 15000, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
    description: 'Heritage luxury hotel with royal banquet facilities. Perfect for grand weddings, corporate conferences, and high-profile events.',
    contactPerson: {
      name: 'Rajesh Kumar',
      phone: '+91-755-2661100',
      email: 'events@jehannuma.com'
    },
    isAvailable: true
  },
  {
    name: 'Noor-Us-Sabah Palace',
    location: {
      address: 'VIP Road, Koh-e-Fiza',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462001',
      country: 'India'
    },
    capacity: 600,
    pricePerDay: 28000,
    amenities: ['Heritage Venue', 'Lawn', 'Stage', 'Parking', 'Lighting'],
    availableAddOns: [
      { name: 'Royal Heritage Setup', description: 'Traditional royal decor and seating', price: 10000, category: 'decoration' },
      { name: 'Outdoor Catering', description: 'Buffet service for lawn events', price: 1200, category: 'catering' },
      { name: 'Stage & Backdrop', description: 'Custom stage with backdrop design', price: 6000, category: 'decoration' },
      { name: 'Photography Package', description: 'Professional photo and video coverage', price: 12000, category: 'service' },
      { name: 'Cultural Performance', description: 'Traditional dance or music performance', price: 8000, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427'],
    description: 'Historic palace venue with beautiful lawns and heritage architecture. Ideal for royal-themed weddings and cultural events.',
    contactPerson: {
      name: 'Amir Khan',
      phone: '+91-755-2540100',
      email: 'bookings@noorussabah.com'
    },
    isAvailable: true
  },
  {
    name: 'Taj Lakefront Bhopal',
    location: {
      address: 'Shahpura Lake',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462039',
      country: 'India'
    },
    capacity: 400,
    pricePerDay: 25000,
    amenities: ['Luxury', 'Poolside', 'Sound System', 'WiFi', 'Catering Kitchen'],
    availableAddOns: [
      { name: 'Lakeside Ceremony Setup', description: 'Romantic lakeside wedding setup', price: 15000, category: 'decoration' },
      { name: 'Gourmet Dining Package', description: 'Premium multi-cuisine buffet', price: 2000, category: 'catering' },
      { name: 'Poolside Bar Service', description: 'Premium bar with bartender', price: 8000, category: 'catering' },
      { name: 'DJ & Dance Floor', description: 'Professional DJ with LED dance floor', price: 10000, category: 'entertainment' },
      { name: 'Wedding Coordinator', description: 'Full-day event coordination', price: 7000, category: 'service' }
    ],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
    description: 'Luxury lakefront hotel with stunning views and world-class facilities. Perfect for destination weddings and corporate retreats.',
    contactPerson: {
      name: 'Priya Sharma',
      phone: '+91-755-6623333',
      email: 'events.bhopal@tajhotels.com'
    },
    isAvailable: true
  },
  {
    name: 'Radisson Hotel Bhopal',
    location: {
      address: 'DB City Area',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462023',
      country: 'India'
    },
    capacity: 350,
    pricePerDay: 22000,
    amenities: ['Banquet', 'Bar', 'Wi-Fi', 'Parking', 'Conference Rooms'],
    availableAddOns: [
      { name: 'Corporate Meeting Package', description: 'AV equipment with conference setup', price: 5000, category: 'equipment' },
      { name: 'Business Lunch Buffet', description: 'Executive lunch menu', price: 800, category: 'catering' },
      { name: 'Team Building Activities', description: 'Indoor team activities coordination', price: 6000, category: 'entertainment' },
      { name: 'Video Conferencing Setup', description: 'Multi-location video conference', price: 4000, category: 'equipment' },
      { name: 'Event Photography', description: 'Corporate event coverage', price: 8000, category: 'service' }
    ],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'],
    description: 'Contemporary hotel with modern banquet facilities. Excellent for corporate events, conferences, and business meetings.',
    contactPerson: {
      name: 'Suresh Patel',
      phone: '+91-755-4777777',
      email: 'events.bhopal@radisson.com'
    },
    isAvailable: true
  },
  {
    name: 'Courtyard by Marriott Bhopal',
    location: {
      address: 'Maharana Pratap Nagar',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462011',
      country: 'India'
    },
    capacity: 450,
    pricePerDay: 18000,
    amenities: ['Conference Hall', 'Catering', 'Parking', 'WiFi', 'AV Equipment'],
    availableAddOns: [
      { name: 'Conference Catering', description: 'Breakfast, lunch and tea breaks', price: 900, category: 'catering' },
      { name: 'Projector & Screen Setup', description: 'HD projection system', price: 3000, category: 'equipment' },
      { name: 'Stationery & Materials', description: 'Notepads, pens, badges', price: 2000, category: 'other' },
      { name: 'Breakout Room Access', description: 'Additional meeting rooms', price: 5000, category: 'service' },
      { name: 'Event Coordination', description: 'On-site event support staff', price: 4000, category: 'service' }
    ],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
    description: 'International brand hotel with spacious conference facilities. Great for seminars, workshops, and corporate gatherings.',
    contactPerson: {
      name: 'Anjali Verma',
      phone: '+91-755-6712345',
      email: 'events.bhopal@marriott.com'
    },
    isAvailable: true
  },
  {
    name: 'Jehan Numa Retreat',
    location: {
      address: 'Van Vihar Road',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462003',
      country: 'India'
    },
    capacity: 300,
    pricePerDay: 15000,
    amenities: ['Outdoor Lawn', 'Spa', 'Restaurant', 'WiFi', 'Nature Views'],
    availableAddOns: [
      { name: 'Garden Wedding Setup', description: 'Beautiful garden ceremony decoration', price: 8000, category: 'decoration' },
      { name: 'Wellness Package', description: 'Spa services for guests', price: 5000, category: 'service' },
      { name: 'Nature Photography', description: 'Outdoor photography session', price: 7000, category: 'service' },
      { name: 'Organic Catering', description: 'Farm-to-table organic menu', price: 1200, category: 'catering' },
      { name: 'Acoustic Music', description: 'Live acoustic performance', price: 6000, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
    description: 'Eco-friendly retreat surrounded by nature. Perfect for intimate weddings, wellness events, and nature-themed celebrations.',
    contactPerson: {
      name: 'Kavita Nair',
      phone: '+91-755-2661333',
      email: 'retreat@jehannuma.com'
    },
    isAvailable: true
  },
  {
    name: 'Golden Tulip Bhopal',
    location: {
      address: 'ISBT Area',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462003',
      country: 'India'
    },
    capacity: 250,
    pricePerDay: 12000,
    amenities: ['Stage', 'Sound System', 'Bar', 'WiFi', 'AC Halls'],
    availableAddOns: [
      { name: 'Entertainment Night Package', description: 'DJ with lighting and sound', price: 8000, category: 'entertainment' },
      { name: 'Premium Bar Setup', description: 'Full bar with mixologist', price: 6000, category: 'catering' },
      { name: 'Stage Decoration', description: 'Themed stage backdrop', price: 4000, category: 'decoration' },
      { name: 'Live Performance', description: 'Band or artist performance', price: 10000, category: 'entertainment' },
      { name: 'Photo Booth', description: 'Selfie booth with props', price: 3500, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'],
    description: 'Modern hotel with versatile event spaces. Suitable for parties, celebrations, and entertainment events.',
    contactPerson: {
      name: 'Rahul Mehta',
      phone: '+91-755-4000000',
      email: 'events@goldentulipbhopal.com'
    },
    isAvailable: true
  },
  {
    name: 'Lemon Tree Hotel Bhopal',
    location: {
      address: 'Maharana Pratap Nagar',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462011',
      country: 'India'
    },
    capacity: 200,
    pricePerDay: 10000,
    amenities: ['Indoor Hall', 'Wi-Fi', 'Parking', 'Catering', 'AC'],
    availableAddOns: [
      { name: 'Business Meeting Package', description: 'Meeting room with refreshments', price: 3000, category: 'catering' },
      { name: 'Presentation Equipment', description: 'Projector, screen, and podium', price: 2500, category: 'equipment' },
      { name: 'Working Lunch', description: 'Executive lunch buffet', price: 700, category: 'catering' },
      { name: 'Event Support Staff', description: 'Dedicated event coordinator', price: 3000, category: 'service' },
      { name: 'Transportation Service', description: 'Pick-up and drop shuttle', price: 4000, category: 'service' }
    ],
    images: ['https://images.unsplash.com/photo-1560347876-aeef00ee58a1'],
    description: 'Comfortable mid-range hotel with efficient event facilities. Good for small meetings, workshops, and intimate celebrations.',
    contactPerson: {
      name: 'Neha Singh',
      phone: '+91-755-6664444',
      email: 'events.bhopal@lemontreehotels.com'
    },
    isAvailable: true
  },
  {
    name: 'The Fern Residency Bhopal',
    location: {
      address: 'ISBT Commercial Area',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462003',
      country: 'India'
    },
    capacity: 220,
    pricePerDay: 9000,
    amenities: ['Sound System', 'Catering', 'AC Hall', 'WiFi', 'Parking'],
    availableAddOns: [
      { name: 'Eco-Friendly Setup', description: 'Sustainable decor and setup', price: 4000, category: 'decoration' },
      { name: 'Green Catering', description: 'Organic and sustainable menu', price: 850, category: 'catering' },
      { name: 'Audio-Visual Package', description: 'Sound and projection system', price: 3500, category: 'equipment' },
      { name: 'Event Photography', description: 'Professional event coverage', price: 6000, category: 'service' },
      { name: 'Entertainment Package', description: 'DJ or live music', price: 7000, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1576678927484-cc907957088c'],
    description: 'Eco-friendly hotel with modern amenities. Ideal for environmentally conscious events and gatherings.',
    contactPerson: {
      name: 'Vikram Rao',
      phone: '+91-755-4888888',
      email: 'events.bhopal@fernhotels.com'
    },
    isAvailable: true
  },
  {
    name: 'Sayaji Hotel Bhopal',
    location: {
      address: 'MP Nagar',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462011',
      country: 'India'
    },
    capacity: 350,
    pricePerDay: 8000,
    amenities: ['Banquet', 'Stage', 'Bar', 'WiFi', 'Valet Parking'],
    availableAddOns: [
      { name: 'Grand Banquet Setup', description: 'Premium banquet decoration', price: 7000, category: 'decoration' },
      { name: 'Multi-Cuisine Buffet', description: 'International buffet spread', price: 950, category: 'catering' },
      { name: 'Bar & Beverage Package', description: 'Premium drinks with service', price: 5500, category: 'catering' },
      { name: 'Stage Performance Setup', description: 'Professional stage with lighting', price: 6000, category: 'equipment' },
      { name: 'Wedding Coordination', description: 'Full-service wedding planning', price: 8000, category: 'service' }
    ],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
    description: 'Spacious hotel with grand banquet halls. Perfect for large weddings, receptions, and social gatherings.',
    contactPerson: {
      name: 'Deepak Gupta',
      phone: '+91-755-4777000',
      email: 'events@sayajihotels.com'
    },
    isAvailable: true
  },
  {
    name: 'Regenta Place Bhopal',
    location: {
      address: 'Near DB City Mall',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462023',
      country: 'India'
    },
    capacity: 180,
    pricePerDay: 7500,
    amenities: ['Conference Hall', 'Projector', 'Wi-Fi', 'AC', 'Parking'],
    availableAddOns: [
      { name: 'Conference Setup', description: 'Complete conference room setup', price: 3000, category: 'equipment' },
      { name: 'Coffee & Snacks', description: 'All-day refreshments', price: 600, category: 'catering' },
      { name: 'Video Recording', description: 'Event recording and editing', price: 4500, category: 'service' },
      { name: 'Name Badges & Materials', description: 'Conference materials package', price: 1500, category: 'other' },
      { name: 'Networking Dinner', description: 'Evening networking dinner', price: 5000, category: 'catering' }
    ],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'],
    description: 'Centrally located hotel with modern conference facilities. Great for business meetings and corporate training.',
    contactPerson: {
      name: 'Sanjay Joshi',
      phone: '+91-755-4999999',
      email: 'events@regentahotels.com'
    },
    isAvailable: true
  },
  {
    name: 'Giovanni Village Resort',
    location: {
      address: 'Kolar Road',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462042',
      country: 'India'
    },
    capacity: 400,
    pricePerDay: 7000,
    amenities: ['Lawn', 'Stage', 'Parking', 'Restaurant', 'Pool'],
    availableAddOns: [
      { name: 'Resort Wedding Package', description: 'Full lawn wedding setup', price: 12000, category: 'decoration' },
      { name: 'Poolside Party Setup', description: 'Pool deck with DJ and bar', price: 8000, category: 'entertainment' },
      { name: 'Outdoor Catering', description: 'BBQ and buffet service', price: 900, category: 'catering' },
      { name: 'Stage & Lighting', description: 'Professional stage setup', price: 5000, category: 'equipment' },
      { name: 'Resort Activities', description: 'Games and entertainment', price: 4000, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32'],
    description: 'Resort-style venue with spacious lawns and amenities. Perfect for destination weddings and outdoor events.',
    contactPerson: {
      name: 'Maria D\'Souza',
      phone: '+91-755-2467890',
      email: 'events@giovannivillage.com'
    },
    isAvailable: true
  },
  {
    name: 'Hotel Atishay',
    location: {
      address: 'MP Nagar Zone I',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462011',
      country: 'India'
    },
    capacity: 150,
    pricePerDay: 6800,
    amenities: ['Indoor Hall', 'Sound System', 'Catering', 'AC', 'WiFi'],
    availableAddOns: [
      { name: 'Birthday Party Package', description: 'Decoration and entertainment for parties', price: 4000, category: 'decoration' },
      { name: 'Party Catering', description: 'Snacks and meal buffet', price: 650, category: 'catering' },
      { name: 'DJ & Music', description: 'DJ with sound system', price: 5000, category: 'entertainment' },
      { name: 'Photography', description: 'Party photography coverage', price: 4000, category: 'service' },
      { name: 'Cake & Desserts', description: 'Custom cake and dessert table', price: 2500, category: 'catering' }
    ],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    description: 'Budget-friendly hotel with good facilities. Suitable for small parties, family gatherings, and intimate events.',
    contactPerson: {
      name: 'Amit Kumar',
      phone: '+91-755-2577000',
      email: 'bookings@hotelatishay.com'
    },
    isAvailable: true
  },
  {
    name: 'Touchwood Resort',
    location: {
      address: 'Hoshangabad Road',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462026',
      country: 'India'
    },
    capacity: 350,
    pricePerDay: 6500,
    amenities: ['Outdoor Lawn', 'Stage', 'Bar', 'Parking', 'Restaurant'],
    availableAddOns: [
      { name: 'Outdoor Event Setup', description: 'Lawn decoration and seating', price: 6000, category: 'decoration' },
      { name: 'Resort Catering', description: 'Outdoor buffet service', price: 850, category: 'catering' },
      { name: 'Bar Service', description: 'Outdoor bar with bartender', price: 5000, category: 'catering' },
      { name: 'Stage Performance', description: 'Live band or DJ', price: 8000, category: 'entertainment' },
      { name: 'Event Lighting', description: 'Professional outdoor lighting', price: 4000, category: 'equipment' }
    ],
    images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
    description: 'Scenic resort with excellent outdoor spaces. Great for garden weddings and outdoor celebrations.',
    contactPerson: {
      name: 'Ravi Saxena',
      phone: '+91-755-2330000',
      email: 'events@touchwoodresort.com'
    },
    isAvailable: true
  },
  {
    name: 'The Residency Bhopal',
    location: {
      address: 'Arera Colony',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462016',
      country: 'India'
    },
    capacity: 180,
    pricePerDay: 6000,
    amenities: ['Banquet', 'Catering', 'Wi-Fi', 'AC', 'Parking'],
    availableAddOns: [
      { name: 'Corporate Lunch', description: 'Business lunch buffet', price: 700, category: 'catering' },
      { name: 'Meeting Room Setup', description: 'Conference equipment', price: 2500, category: 'equipment' },
      { name: 'Tea & Coffee Service', description: 'All-day beverage service', price: 1500, category: 'catering' },
      { name: 'Event Coordinator', description: 'Professional event support', price: 3000, category: 'service' },
      { name: 'AV Equipment', description: 'Audio-visual setup', price: 3500, category: 'equipment' }
    ],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
    description: 'Well-located hotel with reliable event facilities. Good for meetings, seminars, and small functions.',
    contactPerson: {
      name: 'Pooja Agarwal',
      phone: '+91-755-2540000',
      email: 'events@residencybhopal.com'
    },
    isAvailable: true
  },
  {
    name: 'Hotel Shree Palace',
    location: {
      address: 'Hamidia Road',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462001',
      country: 'India'
    },
    capacity: 120,
    pricePerDay: 5800,
    amenities: ['Stage', 'Lighting', 'Parking', 'Catering', 'AC'],
    availableAddOns: [
      { name: 'Stage Decoration', description: 'Basic stage setup and backdrop', price: 3000, category: 'decoration' },
      { name: 'Party Buffet', description: 'Vegetarian buffet menu', price: 600, category: 'catering' },
      { name: 'Sound System', description: 'Basic PA system', price: 2500, category: 'equipment' },
      { name: 'Photography Service', description: 'Event photography', price: 4000, category: 'service' },
      { name: 'Entertainment', description: 'DJ or music system', price: 4500, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb'],
    description: 'Economical venue in the heart of the city. Suitable for small functions and budget-friendly events.',
    contactPerson: {
      name: 'Ramesh Gupta',
      phone: '+91-755-2740000',
      email: 'bookings@shreepalace.com'
    },
    isAvailable: true
  },
  {
    name: 'Enrise by Sayaji',
    location: {
      address: 'Near ISBT',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462003',
      country: 'India'
    },
    capacity: 200,
    pricePerDay: 5500,
    amenities: ['Banquet', 'Sound System', 'Wi-Fi', 'AC', 'Parking'],
    availableAddOns: [
      { name: 'Event Catering', description: 'Standard buffet package', price: 700, category: 'catering' },
      { name: 'Decoration Package', description: 'Simple event decoration', price: 3500, category: 'decoration' },
      { name: 'Sound & Lights', description: 'Basic AV setup', price: 3000, category: 'equipment' },
      { name: 'Event Photography', description: 'Basic coverage', price: 5000, category: 'service' },
      { name: 'DJ Service', description: 'DJ with playlist', price: 5500, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
    description: 'Contemporary budget hotel with decent facilities. Good value for small to medium-sized events.',
    contactPerson: {
      name: 'Karan Malhotra',
      phone: '+91-755-4777100',
      email: 'events@enrisebhopal.com'
    },
    isAvailable: true
  },
  {
    name: 'Hotel Amer Palace',
    location: {
      address: 'MP Nagar',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462011',
      country: 'India'
    },
    capacity: 180,
    pricePerDay: 5200,
    amenities: ['Conference Hall', 'Bar', 'Wi-Fi', 'AC', 'Parking'],
    availableAddOns: [
      { name: 'Conference Package', description: 'Meeting setup with refreshments', price: 2800, category: 'catering' },
      { name: 'Projector Setup', description: 'Presentation equipment', price: 2000, category: 'equipment' },
      { name: 'Lunch Buffet', description: 'Working lunch', price: 650, category: 'catering' },
      { name: 'Bar Service', description: 'Evening bar service', price: 4000, category: 'catering' },
      { name: 'Event Support', description: 'Staff and coordination', price: 2500, category: 'service' }
    ],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    description: 'Affordable hotel with basic conference facilities. Suitable for business meetings and small gatherings.',
    contactPerson: {
      name: 'Sunita Yadav',
      phone: '+91-755-2555000',
      email: 'events@amerpalace.com'
    },
    isAvailable: true
  },
  {
    name: 'Hotel Sangam Palace',
    location: {
      address: 'Habibganj',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462024',
      country: 'India'
    },
    capacity: 130,
    pricePerDay: 4800,
    amenities: ['Stage', 'Sound System', 'Lighting', 'AC', 'Parking'],
    availableAddOns: [
      { name: 'Party Setup', description: 'Basic party decoration', price: 2500, category: 'decoration' },
      { name: 'Snacks & Meals', description: 'Party menu buffet', price: 550, category: 'catering' },
      { name: 'Music System', description: 'DJ or music setup', price: 4000, category: 'entertainment' },
      { name: 'Stage Lighting', description: 'Colored lighting setup', price: 2000, category: 'equipment' },
      { name: 'Photography', description: 'Event photo coverage', price: 3500, category: 'service' }
    ],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
    description: 'Budget venue near railway station. Convenient for small functions and family events.',
    contactPerson: {
      name: 'Manoj Tiwari',
      phone: '+91-755-2462000',
      email: 'bookings@sangampalace.com'
    },
    isAvailable: true
  },
  {
    name: 'Hotel Rajhans Regent',
    location: {
      address: 'MP Nagar Zone II',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462011',
      country: 'India'
    },
    capacity: 160,
    pricePerDay: 4500,
    amenities: ['Banquet', 'Catering', 'Bar', 'WiFi', 'Parking'],
    availableAddOns: [
      { name: 'Banquet Decoration', description: 'Simple hall decoration', price: 2500, category: 'decoration' },
      { name: 'Buffet Dinner', description: 'Standard dinner buffet', price: 600, category: 'catering' },
      { name: 'Bar Setup', description: 'Bar with basic drinks', price: 3500, category: 'catering' },
      { name: 'Sound System', description: 'PA system rental', price: 2000, category: 'equipment' },
      { name: 'Event Coordination', description: 'Basic event support', price: 2000, category: 'service' }
    ],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
    description: 'Economical banquet facility in central location. Good for budget weddings and social functions.',
    contactPerson: {
      name: 'Vinod Sharma',
      phone: '+91-755-2570000',
      email: 'events@rajhansregent.com'
    },
    isAvailable: true
  }
];

const seedBhopalVenues = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing venues
    await Venue.deleteMany({});
    console.log('✓ Cleared existing venues');

    // Insert Bhopal venues
    const venues = await Venue.insertMany(bhopalVenues);
    console.log(`✓ Successfully added ${venues.length} Bhopal venues to the database`);

    // Display added venues
    console.log('\n📍 Added Bhopal Venues:\n');
    venues.forEach((venue, index) => {
      console.log(`${index + 1}. ${venue.name}`);
      console.log(`   📍 ${venue.location.address}, ${venue.location.city}`);
      console.log(`   👥 Capacity: ${venue.capacity} people`);
      console.log(`   💰 Price: ₹${venue.pricePerDay}/day`);
      console.log('');
    });

    console.log('✅ Venue seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding venues:', error);
    process.exit(1);
  }
};

// Run the seed function
seedBhopalVenues();
