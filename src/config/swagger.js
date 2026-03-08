import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import environment from './environment.js';

/**
 * @module swaggerConfig
 * @description Configuración de Swagger/OpenAPI para documentación de la API.
 * ES: Genera documentación automática de endpoints con ejemplos.
 * EN: Generates automatic API documentation with examples.
 */

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Psychology Assistant API',
      version: '0.2.0',
      description:
        'API para gestión integral de clínicas psicológicas con CRM completo',
      contact: {
        name: 'Psychology Assistant Team',
        email: 'support@psychology-assistant.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${environment.PORT}`,
        description: 'Development server'
      },
      {
        url: 'https://api.psychology-assistant.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Clinic: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', minLength: 3, maxLength: 100 },
            description: { type: 'string', maxLength: 500 },
            address: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string', format: 'email' },
            country: { type: 'string', default: 'Colombia' },
            currency: {
              type: 'string',
              enum: ['COP', 'USD', 'ARS', 'MXN', 'CLP', 'PEN']
            },
            owner: { type: 'string' },
            admins: { type: 'array', items: { type: 'string' } },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended']
            },
            settings: { type: 'object' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Therapist: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            clinic: { type: 'string' },
            specializations: { type: 'array', items: { type: 'string' } },
            licenseNumber: { type: 'string' },
            licenseExpiry: { type: 'string', format: 'date' },
            hourlyRate: { type: 'number', minimum: 0 },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'on_leave']
            },
            availability: { type: 'object' }
          }
        },
        Patient: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            clinic: { type: 'string' },
            dateOfBirth: { type: 'string', format: 'date' },
            gender: {
              type: 'string',
              enum: ['M', 'F', 'Other', 'Prefer not to say']
            },
            idType: { type: 'string', enum: ['CC', 'TI', 'CE', 'PA', 'RC'] },
            idNumber: { type: 'string' },
            insurance: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive', 'paused'] }
          }
        },
        MedicalRecord: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            patient: { type: 'string' },
            clinic: { type: 'string' },
            therapist: { type: 'string' },
            primaryDiagnosis: { type: 'string' },
            secondaryDiagnosis: { type: 'array', items: { type: 'string' } },
            symptoms: { type: 'array', items: { type: 'string' } },
            treatmentPlan: { type: 'string' },
            clinicalNotes: { type: 'string' },
            progressRating: { type: 'number', minimum: 1, maximum: 10 },
            status: {
              type: 'string',
              enum: ['draft', 'completed', 'archived']
            }
          }
        },
        Billing: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            patient: { type: 'string' },
            clinic: { type: 'string' },
            invoiceNumber: { type: 'string' },
            amount: { type: 'number', minimum: 0 },
            status: {
              type: 'string',
              enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled']
            },
            paymentMethod: {
              type: 'string',
              enum: ['cash', 'card', 'transfer', 'check', 'insurance']
            },
            paymentDate: { type: 'string', format: 'date-time' }
          }
        },
        ClinicalReport: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            patient: { type: 'string' },
            clinic: { type: 'string' },
            therapist: { type: 'string' },
            reportType: {
              type: 'string',
              enum: [
                'progress',
                'discharge',
                'assessment',
                'evaluation',
                'summary'
              ]
            },
            title: { type: 'string' },
            summary: { type: 'string' },
            diagnosis: { type: 'string' },
            overallProgress: { type: 'number', minimum: 1, maximum: 10 },
            status: {
              type: 'string',
              enum: ['draft', 'completed', 'reviewed', 'archived']
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'psychologist', 'admin'] },
            twoFAEnabled: { type: 'boolean' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Appointment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            psychologist: { $ref: '#/components/schemas/User' },
            date: { type: 'string', format: 'date-time' },
            duration: { type: 'number', minimum: 15, maximum: 180 },
            description: { type: 'string', maxLength: 500 },
            notes: { type: 'string', maxLength: 1000 },
            status: {
              type: 'string',
              enum: ['scheduled', 'completed', 'cancelled', 'no-show']
            },
            qrCode: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/models/*.js'] // Paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
