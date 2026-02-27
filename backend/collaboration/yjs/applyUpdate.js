// collaboration/yjs/applyUpdate.js
const Y = require("yjs");

const applyUpdate = (ydoc, update) => {
  const uint8Update = update instanceof Uint8Array ? update : new Uint8Array(update);
  Y.applyUpdate(ydoc, uint8Update);
};

module.exports = { applyUpdate };
