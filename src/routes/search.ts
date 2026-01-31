import express from 'express';
import { searchUsers } from '../controllers/searchController';

const router = express.Router();

router.post('', searchUsers);

export default router;
