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
Update the database connection details in `backend/src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/house_rental}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:1234}
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

## 🧪 Sample Data

When running in `dev` profile, the system automatically seeds sample users:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@houserental.com` | `Admin@123` |
| **Landlord** | `landlord@houserental.com` | `Landlord@123` |
| **Tenant** | `tenant@houserental.com` | `Tenant@123` |

---

Developed with ❤️ by The_Agaba.
