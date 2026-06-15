import express from 'express';
import cors from 'cors';
import resourceRoutes from './routes/resource.routes';

const app = express();
app.use(cors());

app.use('/api', resourceRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`[Resource Server] Đang chạy tại http://localhost:${PORT}`);
});