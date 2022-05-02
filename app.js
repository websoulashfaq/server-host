import express from 'express';
import dotenv from 'dotenv'
import colors from 'colors';
import bodyParser from 'body-parser';
import cors from 'cors'

//helpers 
const app = express();
dotenv.config();
import { connectDB } from './config/db.js'
import authRouter from './routes/authRouter.js'

//middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser());

//database connection
connectDB();

//routes
app.use('/api', authRouter)

//application listen
const PORT = process.env.PORT;
const server = app.listen(PORT, () => console.log(`Server running at PORT ${PORT}`.bgCyan.black.underline.bold))

process.on('unhandledRejection', (err, promise) => {
    console.log(`Logged Error ${err}`.bgRed.red.bold)
    server.close(() => process.exit(1));
})