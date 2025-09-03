const { body, query } = require('express-validator');
const createTaskRules = [
  body('title').notEmpty(),
  body('status').optional().isIn(['todo','in_progress','done']),
  body('priority').optional().isIn(['low','medium','high']),
  body('dueDate').optional().isISO8601().toDate(),
  body('assignedTo').optional().isInt()
];
const updateTaskRules = [
  body('title').optional().notEmpty(),
  body('status').optional().isIn(['todo','in_progress','done']),
  body('priority').optional().isIn(['low','medium','high']),
  body('dueDate').optional().isISO8601().toDate(),
  body('assignedTo').optional().isInt()
];
const listQueryRules = [
  query('status').optional().isIn(['todo','in_progress','done']),
  query('priority').optional().isIn(['low','medium','high']),
  query('dueFrom').optional().isISO8601(),
  query('dueTo').optional().isISO8601(),
  query('page').optional().toInt(),
  query('limit').optional().toInt()
];
module.exports = { createTaskRules, updateTaskRules, listQueryRules };
