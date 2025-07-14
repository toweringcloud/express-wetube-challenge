import "dotenv/config";
import "./db";
import "./models/User";
import "./models/Video";
import "./models/Comment";

import app from "./server";

const PORT = process.env.API_PORT_NO;
const HOST =
  process.env.MODE === "DEV"
    ? `${process.env.API_SERVER_URL}:${PORT}`
    : process.env.API_SERVER_URL;
const handleListening = () => console.log(`✅ Server listenting on ${HOST}`);

app.listen(PORT, handleListening);
