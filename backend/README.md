# EduTech Backend API

A MongoDB-based backend API for the EduTech platform built with Node.js, Express, and Mongoose.

## 🚀 Features

- **MongoDB Integration**: Full MongoDB Atlas integration with Mongoose ODM
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Complete user registration, login, and profile management
- **Course Management**: Course creation and management system (models ready)
- **Security**: Helmet, CORS, rate limiting, input sanitization
- **Validation**: Express-validator for request validation
- **Error Handling**: Comprehensive error handling middleware

## 📋 Prerequisites

- Node.js (v14+ recommended)
- MongoDB Atlas account (already configured)
- npm or yarn package manager

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   The `.env` file is already configured with:
   ```env
   MONGO_URI=mongodb+srv://abdulmoominishaq_db_user:ishaq@cluster0.o2k6kqx.mongodb.net/edutech_db
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
   JWT_EXPIRES_IN=7d
   API_VERSION=v1
   ```

   **Important**: Change the `JWT_SECRET` in production!

3. **Start the Server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## 🌐 API Endpoints

### Health Check
- `GET /health` - Server and database health check

### API Info
- `GET /api` - API information and status

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/test-db` - Test database connection

## 📝 API Usage Examples

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Get User Profile (Protected Route)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Database Connection
```bash
curl -X GET http://localhost:5000/api/auth/test-db
```

## 🏗️ Project Structure

```
src/
├── app.js                    # Express app configuration
├── server.js                 # Server startup file
├── controllers/
│   ├── coreController/
│   │   └── authController.js # Authentication logic
│   └── appController/        # Application-specific controllers
├── models/
│   ├── coreModels/
│   │   └── User.js          # User model
│   └── appModels/
│       └── Course.js        # Course model
├── routes/
│   ├── coreRoutes/
│   │   └── authRoutes.js    # Authentication routes
│   └── appRoutes/           # Application routes
├── middlewares/
│   ├── authMiddleware.js    # JWT authentication
│   └── validationMiddleware.js # Request validation
└── utils/                   # Utility functions
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Register or login to receive a JWT token
2. Include the token in the Authorization header: `Bearer YOUR_TOKEN`
3. Access protected routes with the token

### User Roles
- `student` - Default role for learners
- `instructor` - For course creators
- `admin` - For platform administrators

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Sanitization**: NoSQL injection prevention
- **Password Hashing**: Bcrypt with salt rounds
- **JWT**: Secure token-based authentication

## 🗄️ Database Models

### User Model
- Personal information (name, email)
- Authentication (password, role)
- Profile data (bio, avatar)
- Course enrollments with progress tracking

### Course Model
- Course information (title, description, pricing)
- Lessons with video content
- Reviews and ratings
- Enrollment tracking

## 🚧 Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restarts on file changes.

### Testing Database Connection
Visit `http://localhost:5000/api/auth/test-db` to verify MongoDB connection.

### Environment Variables
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT signing
- `NODE_ENV`: Environment (development/production)

## 🔧 Configuration

### MongoDB Database
- **Database Name**: `edutech_db`
- **Connection**: MongoDB Atlas cluster
- **ODM**: Mongoose for object modeling

### CORS Configuration
Development origins:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)

Update CORS origins in `app.js` for production deployment.

## 📊 Monitoring

The server includes:
- Health check endpoint with MongoDB status
- Graceful shutdown handling
- Error logging
- Connection monitoring

## 🚀 Next Steps

1. **Change JWT Secret**: Update `JWT_SECRET` for production
2. **Add More Routes**: Users, courses, enrollment endpoints
3. **Email Verification**: Implement email verification system
4. **File Upload**: Add avatar/course thumbnail upload
5. **Search**: Implement course search functionality
6. **Testing**: Add unit and integration tests

## 📄 License

ISC License