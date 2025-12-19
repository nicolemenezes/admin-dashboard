import { body, param, query, validationResult } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().isLength({ min: 2, max: 50 }),
  body('email').trim().notEmpty().isEmail().normalizeEmail(),
  body('password')
    .notEmpty()
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/\d/)
    .matches(/[@$!%*?&#]/),
  body('role').optional().isIn(['user', 'admin', 'moderator'])
];

export const loginValidation = [
  body('email').trim().notEmpty().isEmail().normalizeEmail(),
  body('password').notEmpty()
];

export const updateUserValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
  body('role').optional().isIn(['user', 'admin', 'moderator'])
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty(),
  body('newPassword')
    .notEmpty()
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/\d/)
    .matches(/[@$!%*?&#]/)
];

export const createRevenueValidation = [
  body('date').notEmpty().isISO8601(),
  body('amount').notEmpty().isFloat({ min: 0 }),
  body('source').notEmpty().isIn(['subscription', 'one-time', 'refund', 'other']),
  body('category').trim().notEmpty(),
  body('description').optional().trim().isLength({ max: 500 }),
  body('currency').optional().isLength({ min: 3, max: 3 })
];

export const mongoIdValidation = [
  param('id').notEmpty().isMongoId()
];

export const dateRangeValidation = [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
];

export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};