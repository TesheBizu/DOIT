import { Router } from 'express';
import protect from '../middleware/auth.js';
import requireDB from '../middleware/requireDB.js';
import { getDashboardStats, searchTasks } from '../controllers/dashboardController.js';

const router = Router();

router.use(requireDB);
router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/tasks/search', searchTasks);

export default router;
