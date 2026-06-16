import { Router } from 'express';
import { body } from 'express-validator';
import protect from '../middleware/auth.js';
import requireDB from '../middleware/requireDB.js';
import {
  createTask,
  deleteTask,
  getProjectTasks,
  updateTask,
  updateTaskStatus,
} from '../controllers/taskController.js';

const router = Router();

router.use(requireDB);
router.use(protect);

const taskValidation = [
  body('title').optional().trim().notEmpty().withMessage('Task title is required'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'done'])
    .withMessage('Invalid task status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid task priority'),
];

router.get('/projects/:projectId/tasks', getProjectTasks);
router.post('/projects/:projectId/tasks', taskValidation, createTask);
router.put('/tasks/:id', taskValidation, updateTask);
router.delete('/tasks/:id', deleteTask);
router.patch(
  '/tasks/:id/status',
  body('status').isIn(['todo', 'in_progress', 'done']).withMessage('Invalid task status'),
  updateTaskStatus
);

export default router;
