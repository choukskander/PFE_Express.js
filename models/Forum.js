const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: '#ffffff',
  },
  createdBy: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
  },
  fields: [
    {
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      options: [{ type: String }], // Add options field as an array of strings
      required: {
        type: Boolean,
        default: false,
      },
      labelColor: {
        type: String,
        default: '#000000',
      },
      labelFontSize: {
        type: Number,
        default: 14,
      },
      labelFontWeight: {
        type: Number,
        default: 400,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Forum', forumSchema);