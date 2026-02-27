// collaboration/yjs/createDoc.js
const Y = require("yjs");
const { loadSnapshot } = require("../persistence/loadSnapshot");

const docs = new Map();

const createDoc = async (blogId) => {
  if (docs.has(blogId)) return docs.get(blogId);

  const ydoc = new Y.Doc();

  const snapshot = await loadSnapshot(blogId);
  if (snapshot) Y.applyUpdate(ydoc, snapshot);

  docs.set(blogId, ydoc);
  return ydoc;
};

module.exports = { createDoc, docs };
