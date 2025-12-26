import express from 'express';
import { getAllProjects, createProject, deleteProject, updateProject } from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getAllProjects);
router.post('/', createProject);
router.delete('/:id', deleteProject);
router.put('/:id', updateProject);

export default router;