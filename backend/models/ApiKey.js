const mongoose = require('mongoose');

const apiKeySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    api: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Api',
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

const ApiKey = mongoose.model('ApiKey', apiKeySchema);
module.exports = ApiKey;
