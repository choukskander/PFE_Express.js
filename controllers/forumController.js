const asyncHandler = require('express-async-handler');
const ForumCategory = require('../models/ForumCategory');
const ForumTopic = require('../models/ForumTopic');
const ForumPost = require('../models/ForumPost');
const Forum = require('../models/Forum');
const ForumResponse = require('../models/ForumResponse');

// Get all categories (accessible to all authenticated users)
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await ForumCategory.find().populate('createdBy', 'nom prenom role');
  res.json({ data: categories });
});

// Create a category (internaute only)
exports.createCategory = asyncHandler(async (req, res) => {
  if (req.user.role !== 'internaute') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les médecins peuvent créer des catégories.' });
  }

  const { name, description, style } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Le nom de la catégorie est requis.' });
  }

  const category = new ForumCategory({
    name,
    description,
    createdBy: req.user._id,
    style,
  });
  await category.save();
  res.status(201).json({ data: category });
});

// Get topics by category (accessible to all authenticated users)
exports.getTopicsByCategory = asyncHandler(async (req, res) => {
  const topics = await ForumTopic.find({ categoryId: req.params.categoryId })
    .populate('createdBy', 'nom prenom role');
  res.json({ data: topics });
});

// Create a topic (internaute only)
exports.createTopic = asyncHandler(async (req, res) => {
  if (req.user.role !== 'internaute') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les médecins peuvent créer des sujets.' });
  }

  const { categoryId, title, description, style } = req.body;
  if (!categoryId || !title) {
    return res.status(400).json({ message: 'L’ID de la catégorie et le titre sont requis.' });
  }

  const category = await ForumCategory.findById(categoryId);
  if (!category) {
    return res.status(404).json({ message: 'Catégorie non trouvée.' });
  }

  const topic = new ForumTopic({
    categoryId,
    title,
    description,
    createdBy: req.user._id,
    style,
  });
  await topic.save();
  res.status(201).json({ data: topic });
});

// Lock a topic (admin only, enforced by adminMiddleware)
exports.lockTopic = asyncHandler(async (req, res) => {
  const topic = await ForumTopic.findById(req.params.id);
  if (!topic) {
    return res.status(404).json({ message: 'Sujet non trouvé.' });
  }

  topic.isLocked = true;
  await topic.save();
  res.json({ message: 'Sujet verrouillé.' });
});

// Get posts by topic (accessible to all authenticated users)
exports.getPostsByTopic = asyncHandler(async (req, res) => {
  const posts = await ForumPost.find({ topicId: req.params.topicId })
    .populate('createdBy', 'nom prenom role');
  res.json({ data: posts });
});

// Create a post (patient, admin, or internaute)
exports.createPost = asyncHandler(async (req, res) => {
  if (!['patient', 'admin', 'internaute'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé. Seuls les patients, administrateurs et médecins peuvent créer des posts.' });
  }

  const { topicId, content, style } = req.body;
  if (!topicId || !content) {
    return res.status(400).json({ message: 'L’ID du sujet et le contenu sont requis.' });
  }

  const topic = await ForumTopic.findById(topicId);
  if (!topic) {
    return res.status(404).json({ message: 'Sujet non trouvé.' });
  }
  if (topic.isLocked) {
    return res.status(403).json({ message: 'Sujet verrouillé.' });
  }

  const post = new ForumPost({
    topicId,
    content,
    createdBy: req.user._id,
    style,
  });
  await post.save();
  res.status(201).json({ data: post });
});

// Get all forums (accessible to all authenticated users)
exports.getForums = asyncHandler(async (req, res) => {
  const forums = await Forum.find().populate('createdBy.id', 'nom prenom role');
  res.json({ data: forums });
});

// Create a forum (internaute only)
exports.createForum = asyncHandler(async (req, res) => {
  if (req.user.role !== 'internaute') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les médecins peuvent créer des forums.' });
  }

  const { title, description, backgroundColor, createdBy, fields } = req.body;
  if (!title || !description || !createdBy || !fields) {
    return res.status(400).json({ message: 'Titre, description, créateur et champs sont requis.' });
  }

  // Validate options for select, checkbox, and radio fields
  for (const field of fields) {
    if (['select', 'checkbox', 'radio'].includes(field.type)) {
      if (!field.options || !Array.isArray(field.options) || field.options.length === 0) {
        return res.status(400).json({
          message: `Le champ "${field.label}" de type "${field.type}" doit avoir au moins une option.`,
        });
      }
    }
  }

  console.log('Received fields:', JSON.stringify(fields, null, 2)); // Debug log

  const forum = new Forum({
    title,
    description,
    backgroundColor,
    createdBy: {
      id: createdBy.id,
      name: createdBy.name,
      specialty: createdBy.specialty,
    },
    fields,
  });
  await forum.save();
  res.status(201).json({ data: forum });
});

// Get a forum by ID (accessible to all authenticated users)
exports.getForumById = asyncHandler(async (req, res) => {
  const forum = await Forum.findById(req.params.id).populate('createdBy.id', 'nom prenom role');
  if (!forum) {
    return res.status(404).json({ message: 'Forum non trouvé.' });
  }
  res.json({ data: forum });
});

// Submit a response to a forum (patient, admin, or internaute)
exports.submitForumResponse = asyncHandler(async (req, res) => {
  if (!['patient', 'admin', 'internaute'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé. Seuls les patients, administrateurs et médecins peuvent répondre aux forums.' });
  }

  const { forumId, responses } = req.body;
  if (!forumId || !responses) {
    return res.status(400).json({ message: 'L’ID du forum et les réponses sont requis.' });
  }

  const forum = await Forum.findById(forumId);
  if (!forum) {
    return res.status(404).json({ message: 'Forum non trouvé.' });
  }

  const forumResponse = new ForumResponse({
    forumId,
    responses,
    submittedBy: req.user._id,
  });
  await forumResponse.save();
  res.status(201).json({ data: forumResponse });
});

// Get responses for a forum (accessible to internaute and admin)
exports.getForumResponses = asyncHandler(async (req, res) => {
  if (!['internaute', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé. Seuls les médecins et administrateurs peuvent voir les réponses.' });
  }

  const responses = await ForumResponse.find({ forumId: req.params.forumId })
    .populate('submittedBy', 'nom prenom role');
  res.json({ data: responses });
});

// Delete a forum (admin only, enforced by adminMiddleware)
exports.deleteForum = asyncHandler(async (req, res) => {
  const forum = await Forum.findById(req.params.id);
  if (!forum) {
    return res.status(404).json({ message: 'Forum non trouvé.' });
  }

  // Supprimer toutes les réponses associées au forum
  await ForumResponse.deleteMany({ forumId: req.params.id });

  // Supprimer le forum
  await Forum.deleteOne({ _id: req.params.id });

  res.json({ message: 'Forum et ses réponses supprimés avec succès.' });
});