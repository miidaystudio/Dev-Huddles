import cors from "cors";
import { ENV_CONFIG } from "./env.js";

const allowedOrigins = (ENV_CONFIG.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const corsConfig = {
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  credentials: true,
};

export default cors(corsConfig);
