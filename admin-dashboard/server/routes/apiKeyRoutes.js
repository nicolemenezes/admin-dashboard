import express from 'express';
import { body, param } from 'express-validator';
import * as apiKeyController from '../controllers/apiKeyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Validation rules
const createApiKeyValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('API key name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
  
  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array')
    .custom((value) => {
      const validPermissions = ['read', 'write', 'delete', 'admin'];
      return value.every(p => validPermissions.includes(p));
    }).withMessage('Invalid permission type'),
  
  body('expiresAt')
    .optional()
    .isISO8601().withMessage('Invalid expiration date format'),
  
  body('ipWhitelist')
    .optional()
    .isArray().withMessage('IP whitelist must be an array')
];

const updateApiKeyValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
  
  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean')
];

const mongoIdValidation = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isMongoId().withMessage('Invalid ID format')
];

// All routes require authentication
router.use(protect);

// User's own API keys
router.route('/')
  .get(apiKeyController.listApiKeys)
  .post(createApiKeyValidation, handleValidationErrors, apiKeyController.createApiKey);

// Admin route to see all API keys
router.get('/all', isAdmin, apiKeyController.getAllApiKeys);

// Individual API key operations
router.route('/:id')
  .get(mongoIdValidation, handleValidationErrors, apiKeyController.getApiKeyById)
  .put(mongoIdValidation, updateApiKeyValidation, handleValidationErrors, apiKeyController.updateApiKey)
  .delete(mongoIdValidation, handleValidationErrors, apiKeyController.deleteApiKey);

// Revoke API key
router.post('/:id/revoke', mongoIdValidation, handleValidationErrors, apiKeyController.revokeApiKey);

export default router;