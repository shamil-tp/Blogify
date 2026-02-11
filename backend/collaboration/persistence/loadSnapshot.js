// const Blog = require("../../models/Blog");

// const loadSnapshot = async (blogId) => {
//   const blog = await Blog.findById(blogId);
//   if (blog && blog.collabSnapshot) {
//     return blog.collabSnapshot;
//   }
//   return null;
// };

// module.exports = { loadSnapshot };
// collaboration/persistence/loadSnapshot.js
const Blog = require("../../models/Blog");

const loadSnapshot = async (blogId) => {
  const blog = await Blog.findById(blogId);
  return blog?.collabSnapshot || null;
};

module.exports = { loadSnapshot };
