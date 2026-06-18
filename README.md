# Inventory & Order Management System

A modular, containerized Inventory & Order Management System built with:

- FastAPI backend
- React frontend
- PostgreSQL database
- Docker and Docker Compose

## Features

- Product management
- Customer management
- Order creation, listing, details, and cancellation
- Inventory validation
- Automatic stock reduction on order placement
- Automatic stock restoration on order cancellation
- Dashboard summary
- Responsive UI
- Clear modular project structure

## Business Rules

- Product SKU is unique
- Customer email is unique
- Product quantity cannot be negative
- Orders cannot be created if stock is insufficient
- Order total is calculated by the backend
- Proper validation and HTTP error handling

## Project Structure

### Backend
- `backend/app/core` configuration
- `backend/app/db` database setup
- `backend/app/models` SQLAlchemy models
- `backend/app/schemas` Pydantic schemas
- `backend/app/crud` data operations
- `backend/app/api/routes` API endpoints

### Frontend
- `frontend/src/pages` page-level views
- `frontend/src/components` reusable UI components
- `frontend/src/services` API client

## Run Locally with Docker

1. Copy env file:
   ```bash
   cp .env.example .env
   ```

2. Start the stack:
   ```bash
   docker compose up --build
   ```

3. Open:
   - Frontend: http://localhost
   - Backend docs: https://inventory-order-management-system-ut0x.onrender.com/

## Deployment

- Backend: Render
- Frontend: Netlify

Set the frontend API URL to your deployed backend URL, and set the backend `DATABASE_URL` to your hosted PostgreSQL connection string.

## API Endpoints

- `GET /health`
- `GET /dashboard`
- `POST /products`
- `GET /products`
- `GET /products/{id}`
- `PUT /products/{id}`
- `DELETE /products/{id}`
- `POST /customers`
- `GET /customers`
- `GET /customers/{id}`
- `DELETE /customers/{id}`
- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `DELETE /orders/{id}`
