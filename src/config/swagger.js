const swaggerJsdoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 3000;

// Render sets RENDER_EXTERNAL_URL automatically to the service's public URL;
// fall back to the known deployed URL so local runs can also try the live API.
const DEPLOYED_URL = process.env.RENDER_EXTERNAL_URL || "https://e-commerce-rnofe-node-js.onrender.com";
const servers = [
  { url: DEPLOYED_URL, description: "Deployed server" },
  { url: `http://localhost:${PORT}`, description: "Local server" },
];

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description:
        "Basic REST API for an e-commerce app (register/login by email, products, cart, wishlist). Data is stored in PostgreSQL.",
    },
    servers,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            email: { type: "string", format: "email", example: "ada@example.com" },
            cart: {
              type: "array",
              items: { $ref: "#/components/schemas/CartItem" },
            },
            wishlist: {
              type: "array",
              items: { type: "integer" },
              example: [1, 3],
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Wireless Mouse" },
            description: { type: "string", example: "Ergonomic wireless mouse with USB receiver." },
            price: { type: "number", format: "float", example: 19.99 },
            category: { type: "string", example: "Electronics" },
            stock: { type: "integer", example: 150 },
            image: { type: "string", format: "uri", example: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7" },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            productId: { type: "integer", example: 1 },
            quantity: { type: "integer", example: 2 },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Something went wrong" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            error: { type: "string", example: "Validation failed" },
            details: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string", example: "email" },
                  message: { type: "string", example: "A valid email is required" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
