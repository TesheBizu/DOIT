import { validationResult } from 'express-validator';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

const formatProject = (project) => ({
  id: project._id,
  title: project.title,
  description: project.description,
  color: project.color,
  isArchived: project.isArchived,
  taskCount: project.taskCount ?? 0,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.aggregate([
    { $match: { owner: req.user._id, isArchived: false } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'tasks',
        localField: '_id',
        foreignField: 'project',
        as: 'tasks',
      },
    },
    { $addFields: { taskCount: { $size: '$tasks' } } },
    { $project: { tasks: 0 } },
  ]);

  res.status(200).json({ success: true, data: { projects: projects.map(formatProject) } });
});

export const createProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { title, description, color } = req.body;
  const project = await Project.create({ title, description, color, owner: req.user._id });

  res.status(201).json({
    success: true,
    data: { project: formatProject({ ...project.toObject(), taskCount: 0 }) },
  });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const taskCount = await Task.countDocuments({ project: project._id });
  res.status(200).json({
    success: true,
    data: { project: formatProject({ ...project.toObject(), taskCount }) },
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { title, description, color } = req.body;
  if (title !== undefined) project.title = title;
  if (description !== undefined) project.description = description;
  if (color !== undefined) project.color = color;
  await project.save();

  const taskCount = await Task.countDocuments({ project: project._id });
  res.status(200).json({
    success: true,
    data: { project: formatProject({ ...project.toObject(), taskCount }) },
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.status(200).json({
    success: true,
    data: { message: 'Project deleted successfully' },
  });
});
