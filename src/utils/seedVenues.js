const mongoose = require('mongoose');
require('dotenv').config();
const Venue = require('../models/Venue');

const sampleVenues = [
  {
    name: 'The Purple LoungeXYZ',
    location: {
      address: '123 Downtown Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    capacity: 200,
    pricePerDay: 500,
    amenities: ['Sound System', 'LED Lighting', 'Bar Area', 'Dance Floor', 'DJ Booth'],
    availableAddOns: [
      { name: 'Professional DJ Service', description: 'Experienced DJ with music library', price: 500, category: 'entertainment' },
      { name: 'Premium Bar Package', description: 'Full bar service with bartender', price: 800, category: 'catering' },
      { name: 'VIP Bottle Service', description: 'Premium bottles and table service', price: 1200, category: 'service' },
      { name: 'LED Dance Floor', description: 'Interactive LED lit dance floor', price: 400, category: 'equipment' },
      { name: 'Photo Booth', description: 'Photo booth with props and prints', price: 350, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1519167758481-83f29da8c608?w=800'],
    description: 'Modern nightclub with state-of-the-art sound and lighting systems. Perfect for concerts, DJ events, and nightlife experiences.',
    contactPerson: {
      name: 'John Smith',
      phone: '555-0101',
      email: 'john@purplelounge.com'
    },
    isAvailable: true
  },
  {
    name: 'Urban Garden Restaurant',
    location: {
      address: '456 Green Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    capacity: 150,
    pricePerDay: 800,
    amenities: ['Outdoor Seating', 'Kitchen', 'Parking', 'WiFi', 'Catering Service'],
    availableAddOns: [
      { name: 'Gourmet Catering Package', description: 'Three-course meal per person', price: 75, category: 'catering' },
      { name: 'Wine & Champagne Bar', description: 'Premium wine selection', price: 600, category: 'catering' },
      { name: 'Floral Centerpieces', description: 'Fresh flower arrangements for tables', price: 450, category: 'decoration' },
      { name: 'String Lights Installation', description: 'Outdoor ambient lighting', price: 300, category: 'decoration' },
      { name: 'Live Acoustic Band', description: '3-piece acoustic band', price: 900, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
    description: 'Elegant restaurant with beautiful outdoor garden space. Ideal for corporate events, weddings, and private dining.',
    contactPerson: {
      name: 'Sarah Johnson',
      phone: '555-0102',
      email: 'sarah@urbangardenla.com'
    },
    isAvailable: true
  },
  {
    name: 'The Blue Rooftop Bar',
    location: {
      address: '789 Skyline Boulevard',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    capacity: 120,
    pricePerDay: 1200,
    amenities: ['Rooftop Access', 'City Views', 'Bar Service', 'Lounge Seating', 'WiFi'],
    availableAddOns: [
      { name: 'Signature Cocktail Menu', description: 'Custom cocktail creation and service', price: 550, category: 'catering' },
      { name: 'Appetizer Platters', description: 'Gourmet finger foods', price: 400, category: 'catering' },
      { name: 'Skyline Photography', description: 'Professional photographer', price: 650, category: 'service' },
      { name: 'Lounge Furniture Upgrade', description: 'Premium seating arrangements', price: 350, category: 'equipment' },
      { name: 'Fire Pit Tables', description: 'Outdoor heating with ambiance', price: 300, category: 'equipment' }
    ],
    images: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'],
    description: 'Stunning rooftop bar with panoramic city views. Perfect for cocktail parties, networking events, and upscale gatherings.',
    contactPerson: {
      name: 'Michael Chen',
      phone: '555-0103',
      email: 'michael@bluerooftop.com'
    },
    isAvailable: true
  },
  {
    name: 'Grand Ballroom Hotel Elite',
    location: {
      address: '321 Luxury Lane',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    capacity: 500,
    pricePerDay: 2500,
    amenities: ['Grand Stage', 'Professional Lighting', 'Sound System', 'Projector & Screen', 'Catering Kitchen', 'Parking Lot'],
    availableAddOns: [
      { name: 'Full Catering Service', description: 'Buffet dinner for 500 guests', price: 12500, category: 'catering' },
      { name: 'Premium AV Package', description: 'Professional sound, lighting, and projection', price: 2000, category: 'equipment' },
      { name: 'Event Coordinator', description: 'On-site event management', price: 1500, category: 'service' },
      { name: 'Valet Parking Service', description: 'Professional valet staff', price: 800, category: 'service' },
      { name: 'Stage Backdrop & Decor', description: 'Custom stage design', price: 1200, category: 'decoration' },
      { name: 'Live Band Performance', description: '5-piece professional band', price: 2500, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1519167758481-83f29da8c608?w=800'],
    description: 'Luxurious grand ballroom perfect for large-scale events, conferences, weddings, and galas. Full-service event support available.',
    contactPerson: {
      name: 'Emily Rodriguez',
      phone: '555-0104',
      email: 'emily@hotelelite.com'
    },
    isAvailable: true
  },
  {
    name: 'Warehouse 44',
    location: {
      address: '44 Industrial Way',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA'
    },
    capacity: 300,
    pricePerDay: 600,
    amenities: ['Open Space', 'High Ceilings', 'Loading Dock', 'WiFi', 'Customizable Layout'],
    availableAddOns: [
      { name: 'Industrial Lighting Setup', description: 'Edison bulb string lights', price: 400, category: 'equipment' },
      { name: 'Food Truck Coordination', description: 'Multiple food truck vendors', price: 1500, category: 'catering' },
      { name: 'Art Installation Service', description: 'Temporary art displays', price: 800, category: 'decoration' },
      { name: 'DJ & Dance Floor', description: 'DJ with portable dance floor', price: 700, category: 'entertainment' },
      { name: 'Furniture Rental', description: 'Tables, chairs, and lounge seating', price: 900, category: 'equipment' }
    ],
    images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'],
    description: 'Industrial-chic warehouse space with exposed brick and high ceilings. Great for art exhibitions, trade shows, and creative events.',
    contactPerson: {
      name: 'David Kim',
      phone: '555-0105',
      email: 'david@warehouse44.com'
    },
    isAvailable: true
  },
  {
    name: 'Beachside Pavilion',
    location: {
      address: '100 Ocean Drive',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      country: 'USA'
    },
    capacity: 180,
    pricePerDay: 1500,
    amenities: ['Beach Access', 'Ocean View', 'Outdoor Seating', 'Pavilion Cover', 'BBQ Area', 'Parking'],
    availableAddOns: [
      { name: 'BBQ Catering Package', description: 'Beach BBQ with grilled seafood and meats', price: 2000, category: 'catering' },
      { name: 'Beach Bonfire Setup', description: 'Evening bonfire with seating', price: 400, category: 'equipment' },
      { name: 'Tiki Bar Service', description: 'Tropical drink bar with bartender', price: 700, category: 'catering' },
      { name: 'Beach Games Package', description: 'Volleyball, cornhole, and more', price: 250, category: 'entertainment' },
      { name: 'Sunset Photography', description: 'Professional beach photographer', price: 550, category: 'service' }
    ],
    images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
    description: 'Beautiful beachside pavilion with stunning ocean views. Perfect for beach weddings, summer parties, and outdoor celebrations.',
    contactPerson: {
      name: 'Lisa Martinez',
      phone: '555-0106',
      email: 'lisa@beachsidepavilion.com'
    },
    isAvailable: true
  },
  {
    name: 'The Jazz Club Downtown',
    location: {
      address: '88 Music Street',
      city: 'New Orleans',
      state: 'LA',
      zipCode: '70112',
      country: 'USA'
    },
    capacity: 100,
    pricePerDay: 400,
    amenities: ['Stage', 'Sound System', 'Bar', 'Intimate Seating', 'Piano'],
    availableAddOns: [
      { name: 'Live Jazz Trio', description: '3-hour jazz performance', price: 800, category: 'entertainment' },
      { name: 'Premium Spirits Package', description: 'Top-shelf liquor selection', price: 500, category: 'catering' },
      { name: 'Craft Beer Selection', description: 'Local craft beers on tap', price: 350, category: 'catering' },
      { name: 'Appetizer Spread', description: 'New Orleans style appetizers', price: 400, category: 'catering' },
      { name: 'Sound Engineer', description: 'Professional sound technician', price: 300, category: 'service' }
    ],
    images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'],
    description: 'Authentic jazz club with intimate atmosphere and excellent acoustics. Ideal for live music performances, jazz nights, and small concerts.',
    contactPerson: {
      name: 'Robert Williams',
      phone: '555-0107',
      email: 'robert@jazzclubdowntown.com'
    },
    isAvailable: true
  },
  {
    name: 'Mountain View Conference Center',
    location: {
      address: '500 Summit Road',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'USA'
    },
    capacity: 400,
    pricePerDay: 1800,
    amenities: ['Multiple Rooms', 'Projectors', 'WiFi', 'Catering', 'Parking', 'AV Equipment'],
    availableAddOns: [
      { name: 'Conference Catering Package', description: 'Breakfast, lunch, and snacks', price: 5000, category: 'catering' },
      { name: 'Video Recording Service', description: 'Multi-camera recording and editing', price: 1200, category: 'service' },
      { name: 'Live Streaming Setup', description: 'Professional streaming to online audience', price: 1000, category: 'equipment' },
      { name: 'Keynote Speaker Coordination', description: 'Speaker management and support', price: 800, category: 'service' },
      { name: 'Conference Materials Package', description: 'Programs, name tags, folders', price: 600, category: 'other' }
    ],
    images: ['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800'],
    description: 'Professional conference center with mountain views. Perfect for corporate events, seminars, conferences, and team building activities.',
    contactPerson: {
      name: 'Jennifer Brown',
      phone: '555-0108',
      email: 'jennifer@mountainviewcc.com'
    },
    isAvailable: true
  },
  {
    name: 'Art Gallery Loft',
    location: {
      address: '250 Creative Boulevard',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA'
    },
    capacity: 80,
    pricePerDay: 550,
    amenities: ['Gallery Space', 'Natural Lighting', 'WiFi', 'Movable Walls', 'Spotlights'],
    availableAddOns: [
      { name: 'Gallery Opening Reception', description: 'Wine and cheese reception', price: 600, category: 'catering' },
      { name: 'Art Installation Support', description: 'Professional art hanging and lighting', price: 450, category: 'service' },
      { name: 'Gallery Curator Service', description: 'Expert curation and setup', price: 700, category: 'service' },
      { name: 'Print Material Design', description: 'Exhibition catalogs and signage', price: 400, category: 'other' },
      { name: 'Opening Night Music', description: 'Live classical music ensemble', price: 500, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=800'],
    description: 'Sophisticated art gallery loft with natural lighting and flexible space. Great for art shows, product launches, and intimate gatherings.',
    contactPerson: {
      name: 'Amanda Taylor',
      phone: '555-0109',
      email: 'amanda@artgalleryloft.com'
    },
    isAvailable: true
  },
  {
    name: 'The Garden Estate',
    location: {
      address: '777 Mansion Drive',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37201',
      country: 'USA'
    },
    capacity: 250,
    pricePerDay: 2000,
    amenities: ['Gardens', 'Indoor/Outdoor Space', 'Fountain', 'Parking', 'Catering Kitchen', 'Bridal Suite'],
    availableAddOns: [
      { name: 'Wedding Ceremony Package', description: 'Complete ceremony setup with chairs and arch', price: 1500, category: 'decoration' },
      { name: 'Gourmet Wedding Catering', description: 'Plated dinner service for 250', price: 15000, category: 'catering' },
      { name: 'Wedding Coordinator', description: 'Full-day wedding coordination', price: 2000, category: 'service' },
      { name: 'Floral Design Package', description: 'Bouquets, centerpieces, and arrangements', price: 3000, category: 'decoration' },
      { name: 'Live String Quartet', description: 'Classical musicians for ceremony and cocktail hour', price: 1200, category: 'entertainment' },
      { name: 'Wedding Photography & Video', description: 'Full coverage photo and video', price: 2500, category: 'service' }
    ],
    images: ['https://images.unsplash.com/photo-1519167758481-83f29da8c608?w=800'],
    description: 'Elegant estate with beautiful gardens and stunning architecture. Perfect for weddings, formal events, and upscale celebrations.',
    contactPerson: {
      name: 'Christopher Davis',
      phone: '555-0110',
      email: 'chris@gardenestatetn.com'
    },
    isAvailable: true
  },
  {
    name: 'Tech Hub Event Space',
    location: {
      address: '1000 Innovation Way',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA'
    },
    capacity: 200,
    pricePerDay: 900,
    amenities: ['High-Speed WiFi', 'Video Conferencing', 'Projectors', 'Whiteboards', 'Lounge Area', 'Kitchen'],
    availableAddOns: [
      { name: 'Startup Pitch Competition Package', description: 'Stage setup with judging tables', price: 800, category: 'equipment' },
      { name: 'Tech Event Catering', description: 'Gourmet coffee bar and tech-friendly meals', price: 2000, category: 'catering' },
      { name: 'Hackathon Support Package', description: '24-hour food and beverage service', price: 3000, category: 'catering' },
      { name: 'Livestream Production', description: 'Multi-camera streaming setup', price: 1500, category: 'equipment' },
      { name: 'VR/AR Demo Stations', description: 'Tech demo equipment rental', price: 1200, category: 'equipment' }
    ],
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    description: 'Modern tech-focused event space with cutting-edge technology. Ideal for tech conferences, hackathons, startup events, and workshops.',
    contactPerson: {
      name: 'Ryan Patel',
      phone: '555-0111',
      email: 'ryan@techhubsf.com'
    },
    isAvailable: true
  },
  {
    name: 'Rustic Barn Venue',
    location: {
      address: '50 Country Road',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37205',
      country: 'USA'
    },
    capacity: 180,
    pricePerDay: 700,
    amenities: ['Barn Space', 'Outdoor Area', 'String Lights', 'Parking', 'Rustic Decor', 'Fire Pit'],
    availableAddOns: [
      { name: 'Country BBQ Catering', description: 'Southern BBQ buffet', price: 2500, category: 'catering' },
      { name: 'Hay Bale Seating', description: 'Rustic hay bale seating arrangements', price: 300, category: 'decoration' },
      { name: 'Country Band', description: 'Live country music performance', price: 1000, category: 'entertainment' },
      { name: 'Mason Jar Lighting', description: 'Hanging mason jar lights', price: 350, category: 'decoration' },
      { name: 'Petting Zoo', description: 'Small farm animal petting zoo', price: 600, category: 'entertainment' },
      { name: 'Horseshoe & Lawn Games', description: 'Outdoor game stations', price: 200, category: 'entertainment' }
    ],
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800'],
    description: 'Charming rustic barn with countryside views and vintage charm. Perfect for country weddings, barn parties, and rustic celebrations.',
    contactPerson: {
      name: 'Mary Anderson',
      phone: '555-0112',
      email: 'mary@rusticbarnvenue.com'
    },
    isAvailable: true
  }
];

const seedVenues = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing venues
    await Venue.deleteMany({});
    console.log('Cleared existing venues');

    // Insert sample venues
    const venues = await Venue.insertMany(sampleVenues);
    console.log(`✓ Successfully added ${venues.length} venues to the database`);

    // Display added venues
    console.log('\nAdded Venues:');
    venues.forEach((venue, index) => {
      console.log(`${index + 1}. ${venue.name} - ${venue.location.city}, ${venue.location.state} - $${venue.pricePerDay}/day`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding venues:', error);
    process.exit(1);
  }
};

// Run the seed function
seedVenues();
