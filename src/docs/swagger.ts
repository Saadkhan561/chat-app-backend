import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./openapi.js";

export const generateSwaggerSpec = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const spec = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Chat API",
      version: "1.0.0",
      description: "Express + TypeORM API Documentation",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
  });

  // Add security components to the spec
  spec.components = {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  };

  spec.security = [
    {
      bearerAuth: [],
    },
  ];

  return spec;
};
