const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumTopic', required: true },
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  style: {
    backgroundColor: String,
    textColor: String,
  },
});

module.exports = mongoose.model('ForumPost', forumPostSchema);