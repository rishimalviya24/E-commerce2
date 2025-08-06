import app from './src/app.js';
import http from 'http';
import config from './src/config/config.js';
import connectToDB from './src/db/db.js';
import { connectRedis } from './src/utils/redisClient.js';

connectToDB();
await connectRedis();

const server = http.createServer(app);

const PORT = config.PORT;

server.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
    
})