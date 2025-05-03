const mongoose = require('mongoose');

const forumCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  style: {
    backgroundColor: String,
    textColor: String,
  },
});

module.exports = mongoose.model('ForumCategory', forumCategorySchema);