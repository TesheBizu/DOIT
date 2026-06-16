import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import protect from '../middleware/auth.js';
import requireDB from '../middleware/requireDB.js';

const router = Router();

router.use(requireDB);
router.use(protect);

const projectValidation = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('description').optional().trim().isLength({ max: 500 }),
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Color must be a valid hex code'),
];

router.get('/', getProjects);
router.post('/', projectValidation, createProject);
router.get('/:id', getProject);
router.put('/:id', projectValidation, updateProject);
router.delete('/:id', deleteProject);

export default router;
