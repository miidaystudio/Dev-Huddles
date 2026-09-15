import cors from "cors";

export const corsConfig = {
  origin: process.env.CORS_ORIGINS.split(","),
  credentials: true,
};

export default cors(corsConfig);
