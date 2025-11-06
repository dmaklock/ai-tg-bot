import 'dotenv/config';
import { startBot } from './bot';
import express from 'express';
import path from 'path';
import { adminAuth } from './server/middleware';
import routes from './server/routes';

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'admin/views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin routes with auth
app.use('/', adminAuth, routes);

// Start bot
startBot().catch(console.error);

// Start server
app.listen(PORT, () => {
  console.log(`Admin server running on port ${PORT}`);
});


