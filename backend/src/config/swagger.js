import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ReviewHub API',
      version: '1.0.0',
      description: 'API para ReviewHub - Plataforma de reseñas sociales para juegos, películas, series y libros',
      contact: {
        name: 'ReviewHub Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token almacenado en cookie HTTP-only',
        },
      },
      schemas: {
        Category: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID de la categoría',
            },
            name: {
              type: 'string',
              description: 'Nombre de la categoría',
            },
            slug: {
              type: 'string',
              enum: ['game', 'movie', 'series', 'book'],
              description: 'Slug de la categoría',
            },
          },
        },
        Item: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID del item',
            },
            title: {
              type: 'string',
              description: 'Título del item',
            },
            description: {
              type: 'string',
              description: 'Descripción del item',
            },
            imageUrl: {
              type: 'string',
              description: 'URL de la imagen del item',
            },
            category: {
              $ref: '#/components/schemas/Category',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID del usuario',
            },
            name: {
              type: 'string',
              description: 'Nombre del usuario',
            },
            username: {
              type: 'string',
              description: 'Nombre de usuario',
            },
            email: {
              type: 'string',
              description: 'Email del usuario',
            },
            avatar: {
              $ref: '#/components/schemas/Avatar',
            },
          },
        },
        Avatar: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID del avatar',
            },
            name: {
              type: 'string',
              description: 'Nombre del avatar',
            },
            imageUrl: {
              type: 'string',
              description: 'URL de la imagen en Cloudinary',
            },
            publicId: {
              type: 'string',
              description: 'Public ID de Cloudinary',
            },
            isDefault: {
              type: 'boolean',
              description: 'Si es un avatar por defecto',
            },
            category: {
              type: 'string',
              enum: ['human', 'animal', 'fantasy', 'abstract', 'custom'],
              description: 'Categoría del avatar',
            },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID de la review',
            },
            content: {
              type: 'string',
              description: 'Contenido de la review',
            },
            rating: {
              type: 'object',
              properties: {
                value: {
                  type: 'number',
                  description: 'Valor del rating',
                },
                max: {
                  type: 'number',
                  description: 'Valor máximo del rating',
                },
              },
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            item: {
              $ref: '#/components/schemas/Item',
            },
            likes: {
              type: 'number',
              description: 'Número de likes',
            },
            comments: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
