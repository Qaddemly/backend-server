import "colors";
import dotenv from "dotenv";
import connectDB from "./config/dbConnection";
dotenv.config();
import app from "./app";
const dbUrl = process.env.DATA_BASE!;
connectDB(dbUrl);
// database connection

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`.green);
});
