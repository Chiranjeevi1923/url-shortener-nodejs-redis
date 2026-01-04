import 'dotenv/config';
import express from "express";
import userRouter from "./routes/user.routes.js";
import urlRouter from "./routes/url.routes.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import { authenticationMiddleware } from './middlewares/auth.middleware.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:4200", // Angular app
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(express.json());
app.use(loggerMiddleware);
app.use(authenticationMiddleware);



// Mount the user router at /user
app.use('/user', userRouter);

app.use(urlRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});