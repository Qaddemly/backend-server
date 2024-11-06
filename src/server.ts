import dotenv from 'dotenv';
import app from './app';

dotenv.config();

// database connection

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
