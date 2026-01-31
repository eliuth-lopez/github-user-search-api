import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRoutes from './routes/search';
import { auth } from './services/authService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/search', auth, searchRoutes);

app.get('/', (req, res) => {
    res.send('GitHub User Search API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
