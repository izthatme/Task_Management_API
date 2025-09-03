const { Task } = require('../models');
const { Op } = require('sequelize');

function buildWhere({ status, priority, dueFrom, dueTo, creatorId, assigneeId }) {
  const where = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (dueFrom || dueTo) {
    where.dueDate = {};
    if (dueFrom) where.dueDate[Op.gte] = new Date(dueFrom);
    if (dueTo) where.dueDate[Op.lte] = new Date(dueTo);
  }
  if (creatorId) where.createdBy = creatorId;
  if (assigneeId) where.assignedTo = assigneeId;
  return where;
}

async function createTask(payload, user) { return Task.create({ ...payload, createdBy: user.sub }); }

async function listTasks(query, user) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const offset = (page - 1) * limit;

  let scope = {};
  if (user.role === 'Admin') { /* no restriction */ }
  else { scope = { [Op.or]: [{ createdBy: user.sub }, { assignedTo: user.sub }] }; }

  const where = { ...buildWhere(query), ...scope };
  const { rows, count } = await Task.findAndCountAll({ where, limit, offset, order: [['dueDate','ASC']] });
  return { data: rows, page, limit, total: count, totalPages: Math.ceil(count / limit) };
}

async function getTask(id, user) {
  const task = await Task.findByPk(id);
  if (!task) return null;
  if (user.role !== 'Admin' && task.createdBy !== user.sub && task.assignedTo !== user.sub) return null;
  return task;
}

async function updateTask(id, updates, user) {
  const task = await Task.findByPk(id);
  if (!task) throw Object.assign(new Error('Not found'), { status: 404 });
  if (user.role !== 'Admin' && task.createdBy !== user.sub && task.assignedTo !== user.sub) throw Object.assign(new Error('Forbidden'), { status: 403 });
  Object.assign(task, updates); await task.save(); return task;
}

async function deleteTask(id, user) {
  const task = await Task.findByPk(id);
  if (!task) throw Object.assign(new Error('Not found'), { status: 404 });
  if (user.role !== 'Admin' && task.createdBy !== user.sub && task.assignedTo !== user.sub) throw Object.assign(new Error('Forbidden'), { status: 403 });
  await task.destroy(); return { success: true };
}

module.exports = { createTask, listTasks, getTask, updateTask, deleteTask };
