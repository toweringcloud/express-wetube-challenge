import "dotenv/config";
import "./db";
import "./models/User";
import "./models/Video";
import "./models/Comment";

import app from "./server";

const HOST = process.env.SERVER_HOST;
const PORT = process.env.API_PORT_NO;
const handleListening = () => console.log(`✅ Server listenting on ${HOST} 🚀`);

app.listen(PORT, handleListening);
