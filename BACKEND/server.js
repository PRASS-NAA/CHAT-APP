import dotenv from 'dotenv';
import findConfig from 'find-config';
dotenv.config({ path: findConfig('.env') });
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "../BACKEND/routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import bodyParser from "body-parser";
import messagerouter from "./routes/message.routes.js";
import usersrouter from "./routes/users.routes.js";
import cors from "cors";

const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true,               // Allow credentials (cookies, authorization headers, etc.)
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

//console.log("Mongo ui : ", process.env.MONGO_DB_URI);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting the server
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Hello World!");
});

connectToMongoDB();


app.use("/api/auth", authRoutes);
app.use("/api/message", messagerouter);
app.use("/api/users",usersrouter);

app.listen(PORT, () => {
    
    console.log(`Server Running On PORT ${PORT}`);
});
