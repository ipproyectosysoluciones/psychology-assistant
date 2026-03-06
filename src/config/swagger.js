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
      version: '1.0.0',
      description: 'API para gestión de citas y usuarios en aplicación de asistencia psicológica',
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
            status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled', 'no-show'] },
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
