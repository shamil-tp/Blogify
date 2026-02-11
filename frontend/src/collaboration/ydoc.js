import * as Y from 'yjs';

let ydoc = null;

export const initYDoc = () => {
  if (!ydoc) ydoc = new Y.Doc();
  return ydoc;
};

export const getYDoc = () => ydoc;

export const getSharedText = () => {
  if (!ydoc) throw new Error('YDoc missing');
  return ydoc.getText('content');
};

export const applyUpdate = (update, origin) => {
  Y.applyUpdate(ydoc, update, origin);
};