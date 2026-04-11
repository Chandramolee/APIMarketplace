const mongoose = require('mongoose');

const apiSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    exampleRequest: {
      type: String,
      default: 'GET /api/example'
    },
    exampleResponse: {
      type: String,
      default: '{"status": "success"}'
    },
    tags: [
      {
        type: String,
      }
    ],
    docsLink: {
      type: String,
    },
    status: {
      type: String,
      default: 'approved',
    }
  },
  {
    timestamps: true,
  }
);

apiSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Api = mongoose.model('Api', apiSchema);
module.exports = Api;
