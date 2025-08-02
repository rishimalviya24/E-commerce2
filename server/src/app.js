import express from 'express'
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cartRoutes from './routes/cart.routes.js';
import productRoutes from './routes/product.routes.js'

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/product', productRoutes);

export default app;