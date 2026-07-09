import "reflect-metadata";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

// Route imports
import "./modules/auth-module/auth.docs.js";
import "./modules/project-module/project.docs.js";
import "./modules/worked-hours-module/worked-hours.docs.js";
import "./modules/conversations-module/conversations.docs.js";
import "./modules/message-module/message.docs.js";
import "./modules/bookmarks-module/bookmarks.docs.js";
import "./modules/pinned-message-module/pinned-message.docs.js";
import "./modules/workspace-module/workspace.docs.js";
import "./modules/user-module/user.docs.js";

import { generateSwaggerSpec } from "./docs/swagger.js";

// Route imports
import routes from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(generateSwaggerSpec(), {
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

// Routes
app.use("/", routes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
