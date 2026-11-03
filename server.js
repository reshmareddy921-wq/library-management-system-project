import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/books.js';
import memberRoutes from './routes/members.js';
import transactionRoutes from './routes/transactions.js';
import { Book } from './models/Book.js';
import { Member } from './models/Member.js';
import { Transaction } from './models/Transaction.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/dashboard', async (_req, res) => {
  try {
    const [books, members, issued, returned] = await Promise.all([
      Book.countDocuments(), Member.countDocuments(),
      Transaction.countDocuments({ status: 'Issued' }),
      Transaction.countDocuments({ status: 'Returned' })
    ]);
    res.json({ books, members, issued, returned });
  } catch (e) { res.status(500).json({ message: e.message }); }
});
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/transactions', transactionRoutes);
app.get('/', (_req,res)=>res.send('Library Management API is running'));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/library_management')
  .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
