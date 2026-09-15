import dotenv from "dotenv";
dotenv.config();

export const ENV_CONFIG = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",
};
