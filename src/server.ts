import dotenv from 'dotenv';
import app from './app';
import databaseConnect from './config/database.connection';

dotenv.config();

// database connection

const port = process.env.PORT || 3000;

databaseConnect();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
