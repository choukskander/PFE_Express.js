const express = require('express');
const router = express.Router();

const {
  getCategories,
  createCategory,
  getTopicsByCategory,
  createTopic,
  lockTopic,
  getPostsByTopic,
  createPost,
  getForums,
  createForum,
  getForumById,
  submitForumResponse,
  getForumResponses,
} = require('../controllers/forumController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/categories', authMiddleware, getCategories); // Get all categories (accessible to all authenticated users)
router.post('/categories', authMiddleware, createCategory); // Create category (internaute only, checked in controller)
router.get('/topics/:categoryId', authMiddleware, getTopicsByCategory); // Get topics by category (accessible to all authenticated users)
router.post('/topics', authMiddleware, createTopic); // Create topic (internaute only, checked in controller)
router.put('/topics/:id/lock', authMiddleware, adminMiddleware, lockTopic); // Lock topic (admin only)
router.get('/posts/:topicId', authMiddleware, getPostsByTopic); // Get posts by topic (accessible to all authenticated users)
router.post('/posts', authMiddleware, createPost); // Create post (patient, admin, or internaute, checked in controller)
router.get('/', authMiddleware, getForums); // Get all forums (accessible to all authenticated users)
router.post('/', authMiddleware, createForum); // Create forum (internaute only, checked in controller)
router.get('/:id', authMiddleware, getForumById); // Get forum by ID (accessible to all authenticated users)
router.post('/responses', authMiddleware, submitForumResponse); // Submit forum response (patient, admin, or internaute)
router.get('/responses/:forumId', authMiddleware, getForumResponses); // Get forum responses (internaute and admin only)

module.exports = router;