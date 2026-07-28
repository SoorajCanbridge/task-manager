const { body, query, param, validationResult } = require('express-validator');

const status = ['pending', 'in_progress', 'completed'];

const registerRules = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const taskCreateRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(status)
    .withMessage('Invalid status value'),
];

const taskUpdateRules = [
  param('id').isUUID().withMessage('Invalid task id'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(status)
    .withMessage('Invalid status value'),
];

const taskIdRules = [
  param('id').isUUID().withMessage('Invalid task id'),
];

const taskListRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('search').optional().trim(),
  query('status')
    .optional()
    .isIn(status)
    .withMessage('Invalid status filter'),
];

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = {
  status,
  registerRules,
  loginRules,
  taskCreateRules,
  taskUpdateRules,
  taskIdRules,
  taskListRules,
  validate,
};
