🏥 HealthEase - Doctor Appointment System (Full Stack .NET & Angular)

A full-stack healthcare management system that allows users to book appointments, manage patient records, and order medicine seamlessly. The system ensures secure authentication, efficient doctor-patient interaction, and scalable API architecture.

🚀 Features

👤 User Features
* User Registration & Login (JWT based authentication)
* Browse doctors and specialties
* Book appointments
* Manage patient records
* Order medicines
* Order and appointment history

🔐 Security
* JWT Authentication
* Role-based Authorization (Admin / Doctor / Patient)
* Secure APIs with validation

🛠️ Core Functionalities
* Doctor & Patient management (CRUD)
* Appointment scheduling and tracking
* Medicine inventory & Order placement
* Interactive Dashboard (Chart.js via Angular)
* REST APIs with Swagger documentation

🏗️ Tech Stack

**Backend**
* ASP.NET Core Web API
* Entity Framework Core
* SQL Server (SSMS)
* JWT Authentication

**Frontend**
* Angular 21
* Angular Material
* Chart.js / ng2-charts

📁 Project Structure
```text
HealthEase/
│
├── HealthcareSystem-main/ (Backend)
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── AppointmentController.cs
│   │   ├── DoctorController.cs
│   │   ├── PatientController.cs
│   │   ├── MedicineController.cs
│   │   └── OrderController.cs
│   │
│   ├── DTOs/
│   │
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Doctor.cs
│   │   ├── Patient.cs
│   │   ├── Appointment.cs
│   │   ├── Order.cs
│   │   └── OrderItem.cs
│   │
│   ├── Data/
│   │   └── ApplicationDbContext.cs
│   │
│   ├── Helpers/
│   │
│   ├── Migrations/
│   │
│   ├── appsettings.json
│   └── Program.cs
│
└── healthcare-frontend-main/ (Frontend)
    ├── src/
    ├── package.json
    └── angular.json
```

⚙️ Setup Instructions

1️⃣ Clone Repository
```bash
git clone https://github.com/Sanya-19-tech/doctor-appointment-system
cd hackathon
```

2️⃣ Configure Database
Update `HealthcareSystem-main/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=HealthcareDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

3️⃣ Install Required Packages
**Backend:**
* Microsoft.EntityFrameworkCore.SqlServer
* Microsoft.EntityFrameworkCore.Tools
* Microsoft.AspNetCore.Authentication.JwtBearer
* Swashbuckle.AspNetCore

**Frontend:**
```bash
cd healthcare-frontend-main
npm install
```

4️⃣ Run Migrations
**Navigate to `HealthcareSystem-main` and run:**
```bash
dotnet ef database update
```

5️⃣ Run Project
**Backend:**
```bash
dotnet run
```
*Swagger will open at:*
`https://localhost:<port>/swagger`

**Frontend:**
```bash
cd healthcare-frontend-main
npm start
```
*Angular app will run at:*
`http://localhost:4200`

🔑 API Endpoints

**Auth**
* `POST /api/auth/register`
* `POST /api/auth/login`

**Doctors & Patients**
* `GET /api/doctor`
* `POST /api/doctor`
* `GET /api/patient`
* `POST /api/patient`

**Appointments**
* `GET /api/appointment`
* `POST /api/appointment`

**Medicines & Orders**
* `GET /api/medicine`
* `POST /api/order`

🔄 Authentication Flow
1. User registers/logs in
2. Server returns JWT token
3. Client stores token
4. Token sent in Authorization header
5. Backend validates token

👥 Roles
* **Patient** → book appointments, order medicine
* **Doctor** → view and manage appointments
* **Admin** → manage doctors, patients, and system settings

📌 Future Enhancements
* Email & SMS notifications for appointments
* Payment gateway integration for medicines
* Telemedicine / Video consultations
* Advanced Admin dashboard analytics

🤝 Contributors
* Sanya Shukla(API Testing + Backend)
* Sonal Bansal(Frontend(UI) + API Endpoints Design)
* Sumit Singh(Backend + Integration)
* Sarthak Srivastava(DB Design + EF Core(Models))

💡 Notes
* Designed for hackathon scalability
* Clean architecture with separation of concerns
* Easy to extend with new features

⭐ If you like this project
Give it a star on GitHub ⭐
