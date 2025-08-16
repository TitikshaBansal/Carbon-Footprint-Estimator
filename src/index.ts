import express from "express";
import dotenv from "dotenv";
import estimateRoutes from "./routes/estimate";

dotenv.config();
const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

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