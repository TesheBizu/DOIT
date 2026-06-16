import { validationResult } from 'express-validator';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';

const formatTask = (task) => ({
  id: task._id,
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate,
  order: task.order,
  project: task.project,
  createdBy: task.createdBy,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

const getOwnedProject = async (projectId, userId) =>
  Project.findOne({ _id: projectId, owner: userId });

const getOwnedTask = async (taskId, userId) => {
  const task = await Task.findById(taskId).populate('project', 'owner');
  if (!task || String(task.project.owner) !== String(userId)) return null;
  return task;
};

export const getProjectTasks = asyncHandler(async (req, res) => {
  const project = await getOwnedProject(req.params.projectId, req.user._id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const query = { project: project._id };
  if (req.query.status) query.status = req.query.status;

  const tasks = await Task.find(query).sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, data: { tasks: tasks.map(formatTask) } });
});

export const createTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const project = await getOwnedProject(req.params.projectId, req.user._id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { title, description, status, priority, dueDate } = req.body;
  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate: dueDate || null,
    project: project._id,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: { task: formatTask(task) } });
});

export const updateTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const task = await getOwnedTask(req.params.id, req.user._id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const { title, description, status, priority, dueDate } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate || null;

  await task.save();
  res.status(200).json({ success: true, data: { task: formatTask(task) } });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await getOwnedTask(req.params.id, req.user._id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();
  res.status(200).json({ success: true, data: { message: 'Task deleted successfully' } });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const task = await getOwnedTask(req.params.id, req.user._id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.status = req.body.status;
  await task.save();
  res.status(200).json({ success: true, data: { task: formatTask(task) } });
});
