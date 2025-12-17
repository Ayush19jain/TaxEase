# TaxEase - Spring Boot Backend

This is a migrated version of TaxEase with **Java Spring Boot backend** and the same **React frontend**.

## Project Structure

```
TaxEase-SpringBoot/
├── backend/               # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/taxease/
│   │   │   │   ├── config/         # Security & CORS configuration
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── model/          # MongoDB entities
│   │   │   │   ├── repository/     # MongoDB repositories
│   │   │   │   ├── security/       # JWT authentication
│   │   │   │   ├── service/        # Business logic
│   │   │   │   └── TaxEaseApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml             # Maven dependencies
├── src/                    # React frontend (unchanged)
├── public/
├── package.json
└── README.md
```

## Prerequisites

### Backend
- **Java 17** or higher
- **Maven 3.6+**
- **MongoDB** (running on localhost:27017)

### Frontend
- **Node.js 18+**
- **npm** or **yarn**

## Setup Instructions

### 1. Backend Setup

#### Install Java and Maven
Make sure Java 17 and Maven are installed:
```bash
java -version
mvn -version
```

#### Configure MongoDB
Ensure MongoDB is running on `localhost:27017`. Update `backend/src/main/resources/application.properties` if using a different connection string.

#### Build and Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### 2. Frontend Setup

#### Install Dependencies
```bash
# From the root directory (TaxEase-SpringBoot/)
npm install
```

#### Run Development Server
```bash
npm run dev
```

The frontend will start on **http://localhost:5173**

## API Endpoints

All endpoints are prefixed with `/api`

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires JWT)

### Income
- `GET /api/income/{userId}?financialYear=` - Get income records
- `POST /api/income` - Create income record
- `PUT /api/income/{id}` - Update income record
- `DELETE /api/income/{id}` - Delete income record

### Investments
- `GET /api/investments/{userId}?financialYear=` - Get investments
- `GET /api/investments/{userId}/summary` - Get investment summary
- `POST /api/investments` - Create investment
- `PUT /api/investments/{id}` - Update investment
- `DELETE /api/investments/{id}` - Delete investment

### Tax
- `POST /api/tax/calculate` - Calculate tax
- `POST /api/tax/report` - Generate tax report
- `GET /api/tax/reports/{userId}` - Get all tax reports
- `GET /api/tax/report/{reportId}/download` - Download PDF report

## Key Technologies

### Backend
- **Spring Boot 3.2.0** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data MongoDB** - Database integration
- **JWT (jjwt 0.12.3)** - Token-based authentication
- **iText7** - PDF generation
- **Lombok** - Reduce boilerplate code
- **BCrypt** - Password hashing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Routing
- **Recharts** - Charts
- **Framer Motion** - Animations

## Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/taxease

# JWT
jwt.secret=your-secret-key-change-in-production
jwt.expiration=2592000000

# CORS
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration
The API base URL is configured in `src/services/api.js`:
```javascript
const API_URL = 'http://localhost:8080/api';
```

## Development

### Running Tests
```bash
cd backend
mvn test
```

### Building for Production

#### Backend
```bash
cd backend
mvn clean package
java -jar target/taxease-backend-1.0.0.jar
```

#### Frontend
```bash
npm run build
npm run preview
```

## Security Features

- **JWT-based authentication**
- **BCrypt password hashing**
- **CORS configuration**
- **Stateless session management**
- **Protected API endpoints**

## Differences from Node.js Version

1. **Backend Framework**: Express.js → Spring Boot
2. **Language**: JavaScript → Java
3. **Dependency Management**: npm → Maven
4. **ORM**: Mongoose → Spring Data MongoDB
5. **PDF Generation**: PDFKit → iText7
6. **Security**: Custom JWT middleware → Spring Security + JWT

## Notes

- The original TaxEase project files remain **untouched** in the parent directory
- All frontend code is **identical** to the original
- Only the API base URL was changed to point to the Spring Boot backend
- MongoDB database and collections remain the same

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify Java 17 is installed
- Check if port 8080 is available

### Frontend can't connect to backend
- Ensure backend is running on port 8080
- Check CORS configuration in `SecurityConfig.java`
- Verify API_URL in `src/services/api.js`

### PDF generation fails
- Ensure iText7 dependencies are properly loaded
- Check file permissions for temp directory

## License

MIT License
