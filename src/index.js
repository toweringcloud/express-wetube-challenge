import "dotenv/config";
import "./db";
import "./models/User";
import "./models/Video";
import "./models/Comment";

import app from "./server";

const PORT = process.env.API_PORT_NO;
const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
