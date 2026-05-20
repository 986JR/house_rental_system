# Elite Rentals - House Rental Management System

Elite Rentals is a production-ready, monolithic web application for managing house rentals. It features a modern React frontend integrated with a robust Spring Boot backend and PostgreSQL database.

## 🚀 Features

- **JWT Authentication**: Secure registration, login, and session management.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `Tenant`, `Landlord`, and `Admin`.
- **Property Management**: Complete CRUD operations for properties with multiple image upload support.
- **Advanced Search**: Filter properties by location, price range, rooms, and availability.
- **Booking Workflow**: Streamlined booking requests with status tracking (Pending, Approved, Rejected).
- **Interactive Dashboard**: Role-specific dashboards for managing properties, bookings, and system statistics.
- **Modern UI**: A premium, responsive design with dark mode, glassmorphism, and smooth animations.

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.4**: Core framework
- **Spring Security + JWT**: Security and authentication
- **Spring Data JPA**: Database orchestration
- **PostgreSQL**: Primary data store
- **Flyway**: Database migrations
- **Java 17**: Language version

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Framer Motion**: Advanced animations
- **Lucide React**: Premium iconography
- **Vanilla CSS**: Custom design system with modern aesthetics

## 📂 Project Structure

```text
house_rental/
 ├── backend/            # Spring Boot Application
 │    ├── src/main/java  # Java Source Code
 │    └── src/main/resources
 │         ├── application.yaml  # Centralized Configuration
 │         └── db/migration      # Flyway SQL Migrations
 ├── frontend/           # React Application
 │    ├── src/           # React Components and Pages
 │    └── vite.config.js # Proxy and Build Configuration
 ├── pom.xml             # Root Maven configuration (Unified Build)
 └── README.md           # Project Documentation
```

## ⚙️ Getting Started

### Prerequisites
- Java 17+
- Node.js 20+
- PostgreSQL database

### Configuration
Create a `.env` file in the root directory based on `.env.example` to configure the system:

```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/house_rental
DB_USERNAME=postgres
DB_PASSWORD=your_password

# JWT & Cloudinary
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Frontend
VITE_API_URL=http://localhost:8080
```

### Installation & Deployment

The project is configured as a unified Maven build. Running the following command at the root will build the frontend, bundle it into the backend, and package everything into a single executable JAR.

```bash
# Build the entire project
./mvnw clean install

# Run the application
java -jar target/house_rental-0.0.1-SNAPSHOT.jar
```

The application will be available at [http://localhost:8080](http://localhost:8080).

### Development Mode

For faster development cycles, you can run the backend and frontend separately:

**Backend:**
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
(Frontend will proxy API requests to `:8080`)

## Admin Account

The system starts with only the predefined administrator account. Landlord and tenant users should be created from the registration page.

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@gmail.com` | `admin` |

---

Developed with ❤️ by The_Agaba.
