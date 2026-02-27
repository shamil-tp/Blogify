import { Awareness } from 'y-protocols/awareness';
import { getYDoc } from './ydoc';

let awareness = null;

export const initAwareness = () => {
  const ydoc = getYDoc();
  if (!ydoc) throw new Error('YDoc not initialized');

  if (awareness) return awareness;

  awareness = new Awareness(ydoc);

  awareness.setLocalState({
    user: {
      id: `user-${Math.random().toString(36).slice(2)}`,
      name: 'User',
      color: `hsl(${Math.random() * 360},70%,50%)`,
    },
    cursor: null,
  });

  return awareness;
};

export const getAwareness = () => awareness;

export const updateLocalState = (updates) => {
  if (!awareness) return;
  awareness.setLocalState({
    ...awareness.getLocalState(),
    ...updates,
  });
};