import express from "express";
import { globalErrorHandler } from "./middlewares/error.middleWare";
const app = express();
app.use(express.json());

app.use(globalErrorHandler);
export default app;
