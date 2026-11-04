# Student Management System

A full-stack student record manager with a React/Vite interface, a Spring Boot REST API, and a local H2 database. The repository also retains the original Core Java console version in `StudentManagementSystem.java`.

## Requirements

- Java 17 or later
- Maven 3.9 or later (or use the Maven wrapper if you add one)
- Node.js 20.19+ or 22.12+

## Run the full-stack app

Start the backend in one terminal:

```powershell
cd student-backend
mvn spring-boot:run
```

Start the frontend in a second terminal:

```powershell
cd student-frontend
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`). Vite forwards `/api` requests to the backend at `http://localhost:8080`.

Student records are stored in `student-backend/data/studentdb` and remain after restarting the backend. The H2 console is available at `http://localhost:8080/h2-console` while the backend is running. Use JDBC URL `jdbc:h2:file:./data/studentdb`, username `sa`, and an empty password.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/students` | List all students |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/{id}` | Update a student |
| DELETE | `/api/students/{id}` | Delete a student |

Student fields: `name` (required, up to 100 characters), `age` (1–150), and `course` (required, up to 100 characters).

## Original console app

Open the repository in IntelliJ and run `StudentManagementSystem.java` to launch the original in-memory console version. Its data is temporary and is separate from the full-stack app.
