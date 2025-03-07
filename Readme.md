# 💰 Financial Management API

This is a **Financial Management API** built with **Spring Boot, MySQL, and JWT Authentication**. It allows users to manage financial accounts, track income/expenses, set budgets, and generate reports.

## 🚀 Features
- ✅ **User Authentication & Authorization** (JWT-based)
- ✅ **Accounts Management** (Checking, Savings, Investment)
- ✅ **Transactions Tracking** (Income, Expenses, Transfers)
- ✅ **Budgeting & Savings Goals**
- ✅ **Financial Reports & Audit Logs**
- ✅ **Secure API with Spring Security**

---

## 📦 Setup Instructions

### 🛠 **1. Prerequisites**
- **Java 17**
- **Spring Boot**
- **MySQL**
- **Postman / cURL (for testing)**

### 📥 **2. Clone the repository**
```sh
git clone https://github.com/yourusername/financial-management-api.git
cd financial-management-api
```

### ⚙️ **3. Configure MySQL**
Create a database named **`finance_db`** and update the **`application.properties`** file:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### ▶ **4. Run the Application**
```sh
./mvnw spring-boot:run
```
or
```sh
mvn spring-boot:run
```

---

## 🔑 **Authentication (JWT)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & get JWT token |
| `POST` | `/api/auth/logout` | Logout user |

📌 **Login Example:**
```json
{
  "email": "user1@finance.com",
  "password": "password123"
}
```
📌 **Response (JWT Token)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

---

## 📜 **API Endpoints**

### 👤 **Users API (`/api/users`)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | Get all users (Admin only) |
| `GET` | `/api/users/{id}` | Get user details |
| `PUT` | `/api/users/{id}` | Update user profile |
| `DELETE` | `/api/users/{id}` | Delete user account |

---

### 💳 **Accounts API (`/api/accounts`)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/accounts` | Get all accounts |
| `POST` | `/api/accounts` | Create a new account |
| `GET` | `/api/accounts/{id}` | Get account details |
| `PUT` | `/api/accounts/{id}` | Update account balance |
| `DELETE` | `/api/accounts/{id}` | Delete account |

📌 **Example Request:**
```json
{
  "accountName": "Checking Account",
  "accountType": "Checking",
  "balance": 5000.00,
  "currency": "USD"
}
```

---

### 💰 **Transactions API (`/api/transactions`)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/transactions` | Get all transactions |
| `POST` | `/api/transactions` | Add a new transaction |
| `GET` | `/api/transactions/{id}` | Get transaction details |
| `PUT` | `/api/transactions/{id}` | Update transaction |
| `DELETE` | `/api/transactions/{id}` | Delete transaction |

📌 **Example Request (Add Transaction):**
```json
{
  "accountId": 1,
  "transactionType": "Expense",
  "amount": 200.00,
  "categoryId": 2,
  "description": "Groceries"
}
```

---

### 📊 **Reports API (`/api/reports`)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reports/monthly-summary?userId=2&month=3&year=2024` | Get user’s monthly financial summary |

📌 **Response Example:**
```json
{
  "total_income": 3000.00,
  "total_expense": 1000.00,
  "net_savings": 2000.00
}
```

---

## 🔐 **Security & Authentication**
- **Spring Security** is used to secure API endpoints.
- Users must log in to obtain a **JWT token**.
- Each request must include an `Authorization: Bearer <token>` header.

---

## 📝 **Stored Procedures**
📌 **Get Monthly Summary**
```sql
CALL GetMonthlySummary(2, 3, 2024);
```

📌 **Get User Transactions**
```sql
CALL GetUserTransactions(2);
```

---

## 🛠 **Tech Stack**
- **Backend:** Spring Boot, Spring Security, Hibernate, MySQL
- **Auth:** JWT-based authentication
- **Database:** MySQL
- **API Documentation:** Postman / Swagger (TBD)

---

## 🤝 **Contributing**
1. Fork the repo
2. Create a new branch (`feature/new-feature`)
3. Commit changes & push
4. Open a pull request

---

## 📄 **License**
This project is licensed under the **MIT License**.

