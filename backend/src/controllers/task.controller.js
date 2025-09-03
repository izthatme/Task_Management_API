// src/controllers/task.controller.js
const { Task } = require('../models'); // model [4]
const { Op } = require('sequelize'); // operators [4]

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10)); // page 
    const limit = Math.min(50, parseInt(req.query.limit || '10', 10)); // limit 
    const offset = (page - 1) * limit; // offset 

    const filters = {}; // filters 
    if (req.query.status) filters.status = req.query.status; // status 
    if (req.query.priority) filters.priority = req.query.priority; // priority 

    let visibility = {}; // ownership filter [2]
    if (req.user.role !== 'Admin') {
      visibility = { [Op.or]: [{ createdBy: req.user.id }, { assignedTo: req.user.id }] }; // own/assigned [2]
    }

    const where = { ...filters, ...visibility }; // combined 
    const { rows, count } = await Task.findAndCountAll({
      where, limit, offset, order: [['createdAt', 'DESC']],
    }); // query [4]
    return res.json({ data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) }); // response 
  } catch (e) { next(e); }
};

exports.getOne = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10); // id [4]
    const where = { id }; // base [4]
    if (req.user.role !== 'Admin') where[Op.or] = [{ createdBy: req.user.id }, { assignedTo: req.user.id }]; // ownership [2]
    const task = await Task.findOne({ where }); // fetch [4]
    if (!task) return res.status(404).json({ message: 'Not found' }); // 404 [1]
    return res.json(task); // ok [4]
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description || null,
      status: req.body.status || 'todo',
      priority: req.body.priority || 'medium',
      dueDate: req.body.dueDate || null,
      createdBy: req.user.id,
      assignedTo: req.body.assignedTo || null,
    }; // payload [9]
    const task = await Task.create(payload); // create [4]
    return res.status(201).json(task); // 201 [1]
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10); // id [4]
    const where = { id };
    if (req.user.role !== 'Admin') where[Op.or] = [{ createdBy: req.user.id }, { assignedTo: req.user.id }]; // ownership [2]
    const task = await Task.findOne({ where }); // fetch [4]
    if (!task) return res.status(404).json({ message: 'Not found' }); // 404 [1]
    const updatable = ['title','description','status','priority','dueDate','assignedTo']; // fields [9]
    for (const k of updatable) if (k in req.body) task[k] = req.body[k]; // assign [9]
    await task.save(); // persist [4]
    return res.json(task); // ok [4]
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10); // id [4]
    let where = { id };
    if (req.user.role !== 'Admin') where[Op.or] = [{ createdBy: req.user.id }]; // delete only creator/user [9]
    const deleted = await Task.destroy({ where }); // delete [4]
    if (!deleted) return res.status(404).json({ message: 'Not found or not allowed' }); // 404/403-ish [9]
    return res.json({ success: true }); // ok [1]
  } catch (e) { next(e); }
};
