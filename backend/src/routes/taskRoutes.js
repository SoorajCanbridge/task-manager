const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/auth');
const {
  taskListRules,
  taskCreateRules,
  taskUpdateRules,
  taskIdRules,
  validate,
} = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.get('/', taskListRules, validate, taskController.getTasks);
router.post('/', taskCreateRules, validate, taskController.createTask);
router.put('/:id', taskUpdateRules, validate, taskController.updateTask);
router.delete('/:id', taskIdRules, validate, taskController.deleteTask);

module.exports = router;
