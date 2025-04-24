# 🚗 Parkify – Smart Parking Lot Management

> A fully test-driven, object-oriented backend system to manage parking lot operations using NestJS and TypeScript. Dockerized for easy container-based deployment.

---

## 📦 Project Overview

**Parkify** is a backend-only parking management application designed for real-world use cases. It features:

✅ Slot initialization & expansion  
✅ Vehicle parking and deallocation  
✅ Query features (color-based, registration-based, etc.)  
✅ Unit testing with Jest  
✅ Docker image for local or cloud deployment

---

## 🚀 Technologies Used

- **NestJS** (Backend framework)
- **TypeScript**
- **Heap-js** (MinHeap for optimal slot allocation)
- **Jest** (Unit Testing)
- **Docker** (Containerization)

---

## 📁 Folder Structure

```
src/
└── parking/
    ├── parking.controller.ts
    ├── parking.service.ts
    ├── parking.module.ts
    ├── parking.controller.spec.ts
    └── parking.service.spec.ts
```

---

## 🧪 Run Locally

```bash
npm install
npm run start:dev
```

Then access endpoints like:
```bash
GET http://localhost:3000/parking/status
```

---

## 📌 Available API Endpoints

### 🅿️ Initialization & Expansion
| Method | Route             | Body                       | Description                         |
|--------|-------------------|----------------------------|-------------------------------------|
| POST   | /parking/init     | { totalSlots }             | Initialize lot with total slots     |
| PATCH  | /parking/lot      | { increment_slot }         | Add new slots to lot                |

### 🚘 Slot Allocation
| Method | Route              | Body                                 | Description                     |
|--------|--------------------|--------------------------------------|---------------------------------|
| POST   | /parking/park      | { vehicle_number, color }            | Park vehicle                    |
| DELETE | /parking/clear     | { slot_number / car_registration_no }| Free slot                       |
| DELETE | /parking/reset     | -                                    | Clear all slots                |

### 🔎 Query
| Method | Route                                      | Description                                  |
|--------|--------------------------------------------|----------------------------------------------|
| GET    | /parking/status                            | Show all occupied slots                      |
| GET    | /parking/registration_numbers/:color       | Registration numbers for a color             |
| GET    | /parking/slot_number/:registration_no      | Slot(s) for a reg no                         |
| GET    | /parking/slot_numbers/:color               | Slot(s) of cars with that color              |
| GET    | /parking/count/:color                      | Count cars of a specific color               |

---

## ✅ Testing Instructions

```bash
npm run test
```

> 100% passing unit tests written for all core logic in `parking.service.spec.ts` and controller defined in `parking.controller.spec.ts`.

---

## 🐳 Docker Instructions

### Step 1 – Build the Image
```bash
docker build -t parkify-app .
```

### Step 2 – Run the Container
```bash
docker run -p 3333:3000 parkify-app
```

> Now access the backend at: `http://localhost:3333/parking/status`

---

## 📚 Documentation Checklist

✅ All API routes documented  
✅ Unit tests written and passing  
✅ Dockerized deployment available  
✅ Local testing via browser/Postman supported

---

## 🙌 Author

Made with ❤️ by **Adarsh Ranjan**

> *Feel free to reach out if you're testing this project or reviewing it for internship assignment purposes. All core logic, validations, edge cases, and clean structure are well tested and commented.*

---

## 🪪 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
