// const mongoose = require('mongoose')

// const blogSchema = new mongoose.Schema(
//   {
//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     title: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true
//     },
//     content: {
//       type: Array,
//       required: true,
//       default: []
//     }
//   },
//   { timestamps: true }
// )

// module.exports = mongoose.model('Blog', blogSchema)


const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true
    },

    content: {
      type: Array,
      default: []
    },

    // 🔥 Yjs snapshot for collaboration
    collabSnapshot: {
      type: Buffer, // store encoded Yjs state
      default: null
    },

    // Optional: track who is currently editing
    activeEditors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    // Collaboration versioning (future-proof)
    collabVersion: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Blog', blogSchema)

