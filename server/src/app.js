import express from 'express'
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cartRoutes from './routes/cart.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import addressRoutes from './routes/address.routes.js';
import notificationRoutes from './models/notification.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/notifications', notificationRoutes);

export default app;