import express from "express";
import dotenv from "dotenv";
import estimateRoutes from "./routes/estimate";

dotenv.config();
const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

// request parsers friendly for Postman (JSON and x-www-form-urlencoded)
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// very simple CORS for manual testing tools (e.g., Postman, web UIs)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (_req, res) => res.json({ status: "ok", service: "foodprint-backend" }));
app.use("/", estimateRoutes);

// global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

app.listen(PORT, () => {
  console.log(`Foodprint backend listening on port ${PORT}`);
});