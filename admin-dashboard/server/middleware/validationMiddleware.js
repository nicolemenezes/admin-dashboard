import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key];
      if (typeof key === 'string' && key.startsWith('$')) {
        delete req.body[key];
      }
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.keys(value).forEach((nestedKey) => {
          if (typeof nestedKey === 'string' && nestedKey.startsWith('$')) {
            delete value[nestedKey];
          }
        });
      }
    });
  }
  next();
};

export const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Invalid pagination parameters. Page must be >= 1, limit between 1 and 100'
    });
  }
  req.pagination = { page, limit, skip: (page - 1) * limit };
  next();
};

export const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;
  if (startDate && isNaN(Date.parse(startDate))) {
    return res.status(400).json({ success: false, message: 'Invalid start date format' });
  }
  if (endDate && isNaN(Date.parse(endDate))) {
    return res.status(400).json({ success: false, message: 'Invalid end date format' });
  }
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ success: false, message: 'Start date must be before end date' });
  }
  next();
};