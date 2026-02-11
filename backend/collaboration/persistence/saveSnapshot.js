// const Blog = require("../../models/Blog");
// const Y = require("yjs");

// const saveSnapshot = async (blogId, ydoc) => {
//   try {
//     const update = Y.encodeStateAsUpdate(ydoc);
//     await Blog.findByIdAndUpdate(blogId, { collabSnapshot: update });
//     setInterval(async () => {
//   for (const [blogId, ydoc] of docs) {
//     await saveSnapshot(blogId, ydoc);
//   }
// }, 30_000);
//   } catch (e) {
//     console.error("Failed to save snapshot", e);
//   }
// };

// module.exports = { saveSnapshot };
// collaboration/persistence/saveSnapshot.js
const Blog = require("../../models/Blog");
const Y = require("yjs");

const saveSnapshot = async (blogId, ydoc) => {
  const snapshot = Y.encodeStateAsUpdate(ydoc);
  await Blog.findByIdAndUpdate(blogId, { collabSnapshot: snapshot });

};

module.exports = { saveSnapshot };

