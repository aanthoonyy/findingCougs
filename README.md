# Finding Cougs

A social networking platform designed for WSU students to connect, share experiences, and find opportunities within the Cougar community.

## Features

### User Management

- User registration and authentication
- Profile management with customizable information
- User search functionality
- Follow/unfollow other users
- Personalized feed based on following

### Social Features

- Create and view posts
- Follow other users
- Real-time notifications for social interactions
- User profiles with customizable information (about me, major, age)

### Communities

- Create and join communities
- View community information
- Network with other students in similar communities
- Leave communities

### Job Board

- Browse available job listings
- Filter jobs by type
- Apply to job postings
- View job applications

## Tech Stack

### Backend

- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Database**:
  - MongoDB
  - Mongoose ODM for MongoDB object modeling
- **API Architecture**: RESTful
- **Middleware**:
  - CORS for cross-origin resource sharing
- **Development Tools**:
  - npm for package management
  - nodemon for development

### Frontend

- **Framework**: React.js
- **Language**:
  - Modern JavaScript (ES6+)
  - JSX for component templating
- **State Management**: React's built-in state management
- **Routing**: React Router for SPA navigation
- **Styling**: Material-UI for component styling
- **Development Tools**:
  - npm for package management
  - Vite for fast development and building
  - ESLint for code linting
  - TypeScript for type safety

### Development & Deployment

- **Version Control**: Git
- **Package Management**: npm
- **Environment Variables**: .env for configuration
- **API Documentation**: RESTful API with comprehensive endpoint documentation
- **Code Quality**:
  - ESLint for code linting
  - Modern JavaScript best practices
  - RESTful API design patterns

### Security

- CORS enabled for secure cross-origin requests
- Environment variable management for sensitive data
- MongoDB with Mongoose for data validation and sanitization

## API Endpoints

### Authentication

- `POST /register` - Register a new user
  - Required fields: email, password, name, username
- `POST /login` - User login
  - Required fields: email, password

### User Management

- `GET /users/:id` - Get user profile
- `POST /users/:userId/aboutme` - Update user profile information
  - Fields: aboutMe, major, age, ethnicity
- `DELETE /users/:userId` - Delete user account
- `GET /search` - Search users by name or username

### Posts & Feed

- `POST /users/:userId/posts` - Create a new post
- `GET /users/:userId/feed` - Get user's feed (posts from user and followed users)

### Social Features

- `POST /users/:userId/follow/:targetId` - Follow a user
- `GET /users/:userId/notifications` - Get user notifications
- `POST /notifications/:notificationId/read` - Mark notification as read

### Communities

- `GET /network` - List all communities
- `POST /network` - Create a new community
- `POST /network/:communityId/join` - Join a community
- `POST /network/:communityId/leave` - Leave a community
- `POST /network/community` - Get community information
- `DELETE /network/:communityId` - Delete a community

### Job Board

- `GET /jobs` - List all jobs (with optional type filter)
- `POST /jobs` - Create a new job posting
- `POST /jobs/:jobId/apply` - Apply for a job
- `DELETE /jobs/:jobId` - Delete a job posting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/findingCougs.git
cd findingCougs
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the development servers:

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm start
```

The application should now be running at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## License

This project is licensed under the MIT License - see the LICENSE file for details.
