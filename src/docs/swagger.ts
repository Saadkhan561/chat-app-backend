import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./openapi.js";

export const generateSwaggerSpec = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const swaggerURL =
    process.env.NODE_ENV === "production"
      ? process.env.SWAGGER_PRODUCTION_URL
      : process.env.SWAGGER_LOCAL_URL;

  const spec = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Chat API",
      version: "1.0.0",
      description: "Express + TypeORM API Documentation",
    },
    servers: [
      {
        url: swaggerURL!,
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
