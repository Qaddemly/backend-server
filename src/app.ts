import express, { Request, Response, NextFunction } from 'express';

import { globalErrorHandler } from './middlewares/error.middleWare';
import mountRoutes from './routes';

const app = express();
app.use(express.json());

//mount Routes
mountRoutes(app);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: `cant find ${req.url}`,
    });
});
app.use(globalErrorHandler);

export default app;
