import React, { useEffect } from 'react';
import { QuillBinding } from 'y-quill';
import { initYDoc, getSharedText, applyUpdate } from '../../collaboration/ydoc';
import { initAwareness } from '../../collaboration/awareness';
import { initSocket, emitUpdate, onUpdate } from '../../collaboration/socket';

const withCollaboration = (Editor) => {
  return (props) => {
    const { docId = 'default-doc', quillRef, serverUrl = 'http://localhost:3001' } = props;

    useEffect(() => {
      if (!docId) return;

      try {
        initYDoc(docId);
        const awareness = initAwareness();

        const socket = initSocket(serverUrl, docId);
        socket.emit("doc:join", docId); 

        socket.on("doc:users", (users) => {
          // store in state / context / redux
          console.log("Active collaborators:", users);
          // setCollaborators(users);
        });

        // Yjs document updates (you already had this)
        onUpdate(docId, (update, clientId) => {
          applyUpdate(update, `remote-${clientId}`);
        });

        const ydoc = getSharedText().doc;

        ydoc.on("update", (update, origin) => {
          if (!origin?.startsWith("remote")) {
            socket.emit("doc:update", {
              blogId: docId,
              update: Array.from(update),
            });
          }
        });

        // AWARENESS SYNC (ADD THIS)

        // Send local awareness changes to server
        awareness.on("update", () => {
          socket.emit("doc:awareness", {
            blogId: docId,
            awareness: awareness.getStates(),
          });
        });

        // Receive awareness from others
        socket.on("doc:awareness", (states) => {
          awareness.setStates(states);
        });

      } catch (err) {
        console.error("Collaboration setup failed:", err);
      }
    }, [docId, serverUrl]);



    useEffect(() => {
      if (quillRef?.current) {
        try {
          new QuillBinding(getSharedText(), quillRef.current);
        } catch (err) {
          console.warn('Quill binding failed:', err);
        }
      }
    }, [quillRef]);

    return <Editor {...props} />;
  };
};

export default withCollaboration;