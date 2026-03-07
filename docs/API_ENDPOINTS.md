# Psychology Assistant API Documentation

## Overview

Complete REST API for Psychology Assistant Platform - a comprehensive solution for psychological practice management.

**Base URL:** `http://localhost:3000`  
**API Version:** v1  
**Default Port:** 3000

---

## Authentication

### Register
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "Dr. Juan Pérez",
    "email": "juan@example.com",
    "password": "SecurePassword123!",
    "role": "psychologist"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "statusCode": 201,
    "data": { "id": "...", "email": "..." },
    "message": "User registered successfully"
  }
  ```

### Login
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "juan@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": { "accessToken": "...", "refreshToken": "..." },
    "message": "Login successful"
  }
  ```

---

## Clinics (v1)

Full multi-clinic management system.

### Create Clinic
- **Method:** `POST`
- **Endpoint:** `/api/v1/clinics`
- **Auth:** Bearer Token (Required)
- **Body:**
  ```json
  {
    "name": "Clínica Psicología Integral",
    "email": "info@clinica.com",
    "phone": "+57 1 234 5678",
    "address": "Cra. 5 #45-27",
    "city": "Bogotá",
    "country": "Colombia",
    "currency": "COP"
  }
  ```
- **Response:** `201 Created`

### Get Clinic
- **Method:** `GET`
- **Endpoint:** `/api/v1/clinics/:id`
- **Auth:** Bearer Token (Required)
- **Response:** `200 OK`

### Update Clinic
- **Method:** `PUT`
- **Endpoint:** `/api/v1/clinics/:id`
- **Auth:** Bearer Token (Required)
- **Response:** `200 OK`

### Delete Clinic
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/clinics/:id`
- **Auth:** Bearer Token (Required)
- **Response:** `200 OK`

---

## Therapists (v1)

Professional psychologist management with licensing and availability.

### Create Therapist
- **Method:** `POST`
- **Endpoint:** `/api/v1/therapists`
- **Auth:** Bearer Token (Required)
- **Body:**
  ```json
  {
    "user": "user_id",
    "licenseNumber": "12345-PSI",
    "licenseExpiry": "2026-12-31",
    "specializations": ["TCB", "Mindfulness"],
    "hourlyRate": 150,
    "bio": "Specialista en ansiedad",
    "clinic": "clinic_id"
  }
  ```

### Get Therapist
- **Method:** `GET`
- **Endpoint:** `/api/v1/therapists/:id`

### List Therapists by Clinic
- **Method:** `GET`
- **Endpoint:** `/api/v1/clinics/:clinicId/therapists`

### Update Therapist
- **Method:** `PUT`
- **Endpoint:** `/api/v1/therapists/:id`

### Delete Therapist
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/therapists/:id`

---

## Patients (v1)

Patient registry with comprehensive demographic and contact information.

### Create Patient
- **Method:** `POST`
- **Endpoint:** `/api/v1/patients`
- **Auth:** Bearer Token (Required)
- **Body:**
  ```json
  {
    "firstName": "Carlos",
    "lastName": "González",
    "email": "carlos@example.com",
    "phone": "+57 301 234 5678",
    "dateOfBirth": "1990-05-15",
    "gender": "male",
    "idType": "CC",
    "idNumber": "123456789",
    "clinic": "clinic_id"
  }
  ```

### Get Patient
- **Method:** `GET`
- **Endpoint:** `/api/v1/patients/:id`

### List Patients by Clinic
- **Method:** `GET`
- **Endpoint:** `/api/v1/clinics/:clinicId/patients`
- **Query Params:** `page=1&limit=10&status=active`

### Update Patient
- **Method:** `PUT`
- **Endpoint:** `/api/v1/patients/:id`

### Delete Patient
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/patients/:id`

---

## Medical Records (v1)

Clinical documentation with CIE-10 diagnosis codes and treatment planning.

### Create Medical Record
- **Method:** `POST`
- **Endpoint:** `/api/v1/medical-records`
- **Auth:** Bearer Token (Required)
- **Body:**
  ```json
  {
    "patient": "patient_id",
    "therapist": "therapist_id",
    "appointmentDate": "2026-03-10",
    "diagnosis": "F41.1",
    "symptoms": ["Ansiedad", "Insomnio"],
    "treatmentPlan": "Terapia semanal + ejercicios",
    "nextSteps": "Seguimiento en 2 semanas"
  }
  ```

### Get Medical Record
- **Method:** `GET`
- **Endpoint:** `/api/v1/medical-records/:id`

### List Records by Patient
- **Method:** `GET`
- **Endpoint:** `/api/v1/patients/:patientId/medical-records`

### Update Medical Record
- **Method:** `PUT`
- **Endpoint:** `/api/v1/medical-records/:id`

### Delete Medical Record
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/medical-records/:id`

---

## Billing (v1)

Integrated invoicing and payment management system.

### Create Invoice
- **Method:** `POST`
- **Endpoint:** `/api/v1/billings`
- **Auth:** Bearer Token (Required)
- **Body:**
  ```json
  {
    "patient": "patient_id",
    "clinic": "clinic_id",
    "therapist": "therapist_id",
    "amount": 150,
    "description": "Sesión individual",
    "paymentMethod": "card",
    "lineItems": [
      {
        "description": "Sesión 60 min",
        "quantity": 1,
        "unitPrice": 150,
        "total": 150
      }
    ]
  }
  ```
- **Response:** `201 Created`

### Get Invoice
- **Method:** `GET`
- **Endpoint:** `/api/v1/billings/:id`

### List Invoices by Patient
- **Method:** `GET`
- **Endpoint:** `/api/v1/patients/:patientId/billings`
- **Query Params:** `page=1&limit=10&status=paid`

### Update Invoice
- **Method:** `PUT`
- **Endpoint:** `/api/v1/billings/:id`

### Mark as Paid
- **Method:** `POST`
- **Endpoint:** `/api/v1/billings/:id/pay`

### Delete Invoice
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/billings/:id`

---

## Clinical Reports (v1)

Progress tracking and clinical documentation system.

### Create Report
- **Method:** `POST`
- **Endpoint:** `/api/v1/clinical-reports`
- **Auth:** Bearer Token (Required)
- **Body:**
  ```json
  {
    "patient": "patient_id",
    "therapist": "therapist_id",
    "reportType": "progress",
    "reportDate": "2026-03-07",
    "diagnosis": "F41.1",
    "findings": "Mejoría significativa",
    "recommendations": "Continuar tratamiento",
    "status": "completed"
  }
  ```

### Get Report
- **Method:** `GET`
- **Endpoint:** `/api/v1/clinical-reports/:id`

### List Reports by Patient
- **Method:** `GET`
- **Endpoint:** `/api/v1/patients/:patientId/clinical-reports`

### Update Report
- **Method:** `PUT`
- **Endpoint:** `/api/v1/clinical-reports/:id`

### Mark as Reviewed
- **Method:** `POST`
- **Endpoint:** `/api/v1/clinical-reports/:id/review`

### Delete Report
- **Method:** `DELETE`
- **Endpoint:** `/api/v1/clinical-reports/:id`

---

## Error Responses

All error responses follow this format:

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error description",
  "success": false
}
```

### Common Error Codes
- **400** Bad Request - Invalid input
- **401** Unauthorized - Missing or invalid token
- **403** Forbidden - Permission denied
- **404** Not Found - Resource doesn't exist
- **409** Conflict - Resource already exists
- **500** Internal Server Error

---

## Rate Limiting

- General API: 100 requests/hour
- Auth endpoints: 5 requests/hour
- Includes `X-RateLimit-*` headers in responses

---

## Best Practices

1. **Always include Authorization header** with Bearer token
2. **Use pagination** for list endpoints (page, limit)
3. **Validate input** before sending requests
4. **Handle errors** gracefully with appropriate error codes
5. **Cache responses** when appropriate (GET requests)

---

## Getting Started

1. **Register:** Create account via `/api/auth/register`
2. **Login:** Get tokens via `/api/auth/login`
3. **Create Clinic:** Set up your first clinic
4. **Add Therapists:** Register your professionals
5. **Add Patients:** Register patient information
6. **Start Managing:** Create appointments, records, and billing

---

## Support

- **Email:** support@psychologyassistant.com
- **Documentation:** https://docs.psychologyassistant.com
- **Status:** https://status.psychologyassistant.com

---

*Last Updated: March 7, 2026*  
*API Version: 1.0.0*
