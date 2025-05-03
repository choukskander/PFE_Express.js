const mongoose = require('mongoose');

const forumTopicSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory', required: true },
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isLocked: { type: Boolean, default: false },
  style: {
    backgroundColor: String,
    textColor: String,
  },
});

module.exports = mongoose.model('ForumTopic', forumTopicSchema);