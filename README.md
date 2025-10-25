# Event Organizer Platform - Backend

Backend API for the Event Organizer Platform built with Node.js, Express, and MongoDB.

## Features

- **Three User Roles**: Talent, Event Manager, Event Organizer
- **Authentication**: JWT-based authentication
- **Event Management**: Create, update, and manage events
- **Venue Booking**: Browse and book pre-listed venues
- **Talent Recruitment**: Invite and manage talents for events
- **Invitation System**: Send, accept, reject, and manage invitations
- **Rating System**: Rate talents after event completion
- **Add-ons Management**: Purchase event add-ons (sound, drinks, dinner, etc.)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-organizer
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Seed the database with sample venues (optional):
```bash
npm run seed
```

This will add 12 sample venues to your database including:
- The Purple Lounge (New York)
- Urban Garden Restaurant (Los Angeles)
- The Blue Rooftop Bar (Miami)
- Grand Ballroom Hotel Elite (Chicago)
- And 8 more venues across different cities

5. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Events
- `POST /api/events` - Create event (Organizer)
- `GET /api/events` - Get all events for user
- `GET /api/events/:id` - Get single event
- `PUT /api/events/:id` - Update event (Organizer)
- `DELETE /api/events/:id` - Delete event (Organizer)
- `POST /api/events/:id/invite-manager` - Invite event manager (Organizer)
- `POST /api/events/:id/addons` - Add event add-ons (Organizer)

### Venues
- `GET /api/venues` - Get all venues (with filters)
- `GET /api/venues/:id` - Get single venue
- `POST /api/venues` - Create venue (Admin/Demo)

### Invitations
- `GET /api/invitations/talents` - Browse talents (Manager)
- `POST /api/invitations` - Send invitation (Manager)
- `GET /api/invitations/event/:eventId` - Get event invitations
- `GET /api/invitations/my-invitations` - Get my invitations (Talent)
- `PUT /api/invitations/:id/respond` - Accept/Reject invitation (Talent)
- `PUT /api/invitations/:id/remove` - Remove/Replace talent (Manager)

### Talents
- `GET /api/talents/:id` - Get talent profile
- `PUT /api/talents/profile` - Update talent profile (Talent)

### Ratings
- `POST /api/ratings` - Create rating (Organizer/Manager)
- `GET /api/ratings/talent/:talentId` - Get talent ratings
- `GET /api/ratings/event/:eventId` - Get event ratings
- `PUT /api/ratings/:id` - Update rating

## User Roles

### Event Organizer
- Create and manage events
- Book venues
- Invite event managers
- Purchase add-ons
- Rate talents after events

### Event Manager
- View assigned events
- Browse and invite talents
- Manage talent invitations
- Remove/replace talents
- Rate talents after events

### Talent
- Set up skill-based profile
- View event invitations
- Accept/reject invitations
- Build portfolio with ratings

## Database Models

- **User**: Stores user information with role-based fields
- **Event**: Event details, venue, dates, required skills, add-ons
- **Venue**: Pre-listed venue information
- **Invitation**: Talent invitations with expiry dates
- **Rating**: Post-event ratings and reviews for talents

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── invitationController.js
│   │   ├── ratingController.js
│   │   ├── talentController.js
│   │   └── venueController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Event.js
│   │   ├── Invitation.js
│   │   ├── Rating.js
│   │   ├── User.js
│   │   └── Venue.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── invitationRoutes.js
│   │   ├── ratingRoutes.js
│   │   ├── talentRoutes.js
│   │   └── venueRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Technologies Used

- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
