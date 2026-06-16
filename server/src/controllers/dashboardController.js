import Project from '../models/Project.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

const formatTaskSummary = (task) => ({
  id: task._id,
  title: task.title,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate,
  project: {
    id: task.project?._id,
    title: task.project?.title,
    color: task.project?.color,
  },
  createdAt: task.createdAt,
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const userProjects = await Project.find({ owner: req.user._id }).select('_id');
  const projectIds = userProjects.map((p) => p._id);

  const [totalProjects, totalTasks, todoCount, inProgressCount, doneCount, overdueCount, recentTasks] =
    await Promise.all([
      Project.countDocuments({ owner: req.user._id, isArchived: false }),
      Task.countDocuments({ project: { $in: projectIds } }),
      Task.countDocuments({ project: { $in: projectIds }, status: 'todo' }),
      Task.countDocuments({ project: { $in: projectIds }, status: 'in_progress' }),
      Task.countDocuments({ project: { $in: projectIds }, status: 'done' }),
      Task.countDocuments({
        project: { $in: projectIds },
        dueDate: { $lt: new Date() },
        status: { $ne: 'done' },
      }),
      Task.find({ project: { $in: projectIds } })
        .populate('project', 'title color')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

  res.status(200).json({
    success: true,
    data: {
      totals: {
        projects: totalProjects,
        tasks: totalTasks,
      },
      byStatus: {
        todo: todoCount,
        in_progress: inProgressCount,
        done: doneCount,
      },
      overdue: overdueCount,
      recentTasks: recentTasks.map(formatTaskSummary),
    },
  });
});

export const searchTasks = asyncHandler(async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) {
    return res.status(200).json({ success: true, data: { tasks: [] } });
  }

  const userProjects = await Project.find({ owner: req.user._id }).select('_id');
  const projectIds = userProjects.map((p) => p._id);

  const tasks = await Task.find({
    project: { $in: projectIds },
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ],
  })
    .populate('project', 'title color')
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({
    success: true,
    data: { tasks: tasks.map(formatTaskSummary) },
  });
});
