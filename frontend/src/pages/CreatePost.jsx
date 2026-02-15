import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import api from '../api/axios'
import axios from 'axios'
import GridEditor from '../components/GridEditor/GridEditor'
import ShareModal from '../components/ShareModal'
import { v4 as uuidv4 } from 'uuid';
import * as Y from 'yjs';
import { initSocket, disconnectSocket, getSocket } from '../collaboration/socket';
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from 'y-protocols/awareness';
import VideoCallPanel from '../components/VideoCallPanel';
import IncomingCallModal from "../components/IncomingCallModal";
import OutgoingCallModal from "../components/OutgoingCallModal";


const initialWidgets = [
    {
        id: 'init-1',
        type: 'text',
        content: '<p>Start writing your story here...</p>',
        layout: { x: 0, y: 0, w: 12, h: 4 }
    }
]


const ToolbarContainer = ({ children }) => (
    <div className="flex flex-wrap gap-2 items-center pb-4 mb-4 border-b border-slate-200 dark:border-gray-700/50 transition-colors duration-300">
        {children}
    </div>
)

const ToolbarButton = ({ onClick, children, title }) => (
    <button
        onClick={onClick}
        title={title}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700 dark:!bg-gray-300 dark:border-gray-400 dark:text-gray-900 dark:hover:!bg-gray-400"
    >
        {children}
    </button>
)

const ToolbarIcon = ({ children }) => (
    <span className="material-icons-outlined text-[18px] leading-none">
        {children}
    </span>
)


// --- MAIN COMPONENT ---
const CreatePost = () => {
    const [socket, setSocket] = useState(null);

    const [incomingCall, setIncomingCall] = useState(null);
    const [outgoingCall, setOutgoingCall] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);

    const acceptCall = () => {
        if (!socket || !incomingCall) return;

        socket.emit("call:accept", {
            to: incomingCall.from,
            blogId: docId,
        });
        socket.emit("call:join", docId);
        setCallAccepted(true);
        setIncomingCall(null);
    };

    const declineCall = () => {
        if (!socket || !incomingCall) return;

        socket.emit("call:decline", {
            to: incomingCall.from,
        });

        setIncomingCall(null);
    };

    const cancelCall = () => {
        if (!socket || !outgoingCall) return;
        socket.emit("call:decline", { to: outgoingCall.socketId }); // Using decline as a generic signal to end
        setOutgoingCall(null);
    };

    const { id } = useParams();
    const isCreateMode = !id;
    const [docId, setDocId] = useState(id || null);
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(isEditMode);
    const [shareOpen, setShareOpen] = useState(false);

    const [widgets, setWidgets] = useState(initialWidgets)
    const [title, setTitle] = useState('')
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false)
    const [ydoc, setYdoc] = useState(null);
    const [awareness, setAwareness] = useState(null);
    const [collaborators, setCollaborators] = useState([]);
    const [canEdit, setCanEdit] = useState(true);

    const [yWidgets, setYWidgets] = useState(null);

    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark" ||
                (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
        }
        return true;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    const fileInputRef = useRef(null);

    // --- SYNC TITLE ACROSS COLLABORATORS ---
    useEffect(() => {
        if (!ydoc) return;
        const yTitle = ydoc.getText('title');

        const observer = () => {
            const currentYTitle = yTitle.toString();
            // Using functional update to avoid stale title in closure
            setTitle(prev => {
                if (prev !== currentYTitle) return currentYTitle;
                return prev;
            });
        };

        yTitle.observe(observer);
        // Initial sync if title is already in ydoc
        const initialTitle = yTitle.toString();
        if (initialTitle && initialTitle !== title) {
            setTitle(initialTitle);
        }

        return () => yTitle.unobserve(observer);
    }, [ydoc]);

    useEffect(() => {
        if (!isEditMode) return;

        const fetchPost = async () => {
            try {
                const url = `/api/blog/${id}`;
                console.log(`🔍 Fetching blog from: ${api.defaults.baseURL}${url}`);
                const res = await api.get(url);

                if (res.data && res.data.blog) {
                    const blog = res.data.blog;
                    setTitle(blog.title);
                    const loadedContent = blog.content;

                    // Check permissions
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (user && blog.author !== user._id) {
                        const collab = blog.collaborators?.find(c => c.email === user.email);
                        if (!collab || collab.role === 'view') {
                            setCanEdit(false);
                        }
                    }

                    if (Array.isArray(loadedContent) && loadedContent.length > 0) {
                        if (loadedContent[0].layout && loadedContent[0].id) {
                            const fixedWidgets = loadedContent.map(w => ({
                                ...w,
                                layout: {
                                    ...w.layout,
                                    y: typeof w.layout.y === "number" ? w.layout.y : Infinity
                                }
                            }));
                            setWidgets(fixedWidgets);
                        } else {
                            setWidgets([{
                                id: uuidv4(),
                                type: 'text',
                                content: '<p><em>(Legacy Post Content)</em></p>',
                                layout: { x: 0, y: 0, w: 12, h: 20 }
                            }]);
                        }
                    } else {
                        setWidgets(initialWidgets);
                    }
                } else {
                    console.warn("⚠️ Blog data is missing in response", res.data);
                    setWidgets(initialWidgets);
                }
            } catch (err) {
                console.error("❌ Failed to load blog:", err);
                if (err.response) {
                    console.error("   Status:", err.response.status);
                    console.error("   Data:", err.response.data);

                    if (err.response.status === 404) {
                        alert("The requested blog post was not found (404). Redirecting to home.");
                        navigate("/home");
                        return; // Don't set loading to false here as we are navigating
                    }
                } else {
                    console.error("   Message:", err.message);
                    alert("Network error: Could not connect to the backend server.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, isEditMode, navigate]);

    // Cleanup socket on unmount
    useEffect(() => {
        return () => {
            disconnectSocket();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("call:incoming", (data) => {
            setIncomingCall(data);
        });

        socket.on("call:accepted", () => {
            setCallAccepted(true);
            setOutgoingCall(null);
        });

        socket.on("call:declined", () => {
            alert("Call rejected");
            setOutgoingCall(null);
        });

        return () => {
            socket.off("call:incoming");
            socket.off("call:accepted");
            socket.off("call:declined");
        };
    }, [socket]);

    useEffect(() => {
        console.log("📞 incomingCall =", incomingCall);
    }, [incomingCall]);


    // Initialize Yjs and Socket when docId is available
    useEffect(() => {
        if (!docId) return;

        const doc = new Y.Doc();
        setYdoc(doc);
        const widgetsArray = doc.getArray('widgets');
        setYWidgets(widgetsArray);

        const yTitle = doc.getText('title');

        const awarenessInstance = new Awareness(doc);
        setAwareness(awarenessInstance);

        const socket = initSocket(docId);
        setSocket(socket);

        socket.emit("doc:join", docId);


        socket.on("doc:sync", (update) => {
            console.log("Received doc:sync, applying update...");
            Y.applyUpdate(doc, new Uint8Array(update), 'server');

            // If local title is empty but Yjs title has content, update local state
            if (title === '' && yTitle.toString() !== '') {
                setTitle(yTitle.toString());
            }
        });

        socket.on("doc:update", (update) => {
            console.log("Received doc:update, applying update...");
            Y.applyUpdate(doc, new Uint8Array(update), 'server');
        });


        // Track active users (legacy indicator)
        socket.on("doc:users", (users) => {
            setCollaborators(users);
        });

        // Awareness events
        socket.on("doc:awareness", (update) => {
            applyAwarenessUpdate(awarenessInstance, new Uint8Array(update), 'server');
        });

        awarenessInstance.on('update', ({ added, updated, removed }, origin) => {
            if (origin !== 'server') {
                const update = encodeAwarenessUpdate(awarenessInstance, added.concat(updated).concat(removed));
                socket.emit("doc:awareness", {
                    blogId: docId,
                    awareness: Array.from(update)
                });
            }
        });


        // Set local awareness state (name/color)
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        awarenessInstance.setLocalStateField('user', {
            name: userData.name || `Guest ${socket.id?.substring(0, 4) || ''}`,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color
        });

        doc.on('update', (update, origin) => {
            if (origin !== 'server') {
                console.log("Sending doc:update to server...");
                socket.emit('doc:update', {
                    blogId: docId,
                    update: Array.from(update)
                });
            }
        });


        // Sync Widgets Array
        widgetsArray.observe((event) => {
            if (event.transaction.origin === 'local') return;
            setWidgets(widgetsArray.toArray());
        });

        // Sync Title
        yTitle.observe((event) => {
            if (event.transaction.origin === 'local') return;
            setTitle(yTitle.toString());
        });

        return () => {
            doc.destroy();
            disconnectSocket(); // Re-connect if docId changes
        };
    }, [docId]);


    // Initial sync from state to Yjs if Yjs is empty (e.g. first user to load doc)
    useEffect(() => {
        if (ydoc && title !== '') {
            const yTitle = ydoc.getText('title');
            if (yTitle.toString() === '') {
                yTitle.doc.transact(() => {
                    yTitle.insert(0, title);
                }, 'local');
            }
        }
    }, [title, ydoc]);


    // Helper to update both local state and Yjs array
    const updateWidgets = (newWidgets) => {
        setWidgets(newWidgets);

        if (!yWidgets) return;


        const shouldSync = () => {
            if (newWidgets.length !== widgets.length) return true;

            return newWidgets.some((nw, i) => {
                const ow = widgets[i];
                if (!ow) return true;
                if (nw.id !== ow.id) return true;
                if (nw.type !== ow.type) return true;

                // Check layout changes
                if (nw.layout.x !== ow.layout.x ||
                    nw.layout.y !== ow.layout.y ||
                    nw.layout.w !== ow.layout.w ||
                    nw.layout.h !== ow.layout.h) return true;

                // Check content changes ONLY for non-text widgets
                if (nw.type !== 'text' && nw.content !== ow.content) return true;

                return false;
            });
        };

        if (shouldSync()) {
            yWidgets.doc.transact(() => {
                yWidgets.delete(0, yWidgets.length);
                yWidgets.insert(0, newWidgets);
            }, 'local');
        }
    };


    useEffect(() => {
        if (!isCreateMode) return

        const createDraft = async () => {
            const res = await api.post('/api/blog/create-draft')
            const newId = res.data.blog._id

            setDocId(newId)
            navigate(`/create/${newId}`, { replace: true })
        }

        createDraft()
    }, [isCreateMode, docId])

    const saveDraft = async () => {
        if (!docId) return
        await api.post(`/api/blog/updateblog/${docId}`, {
            title,
            content: widgets
        })
    }

    useEffect(() => {
        if (!isCreateMode) return

        const timer = setTimeout(saveDraft, 2000)
        return () => clearTimeout(timer)
    }, [widgets, title, isCreateMode])

    const addTextWidget = () => {
        const newWidget = {
            id: uuidv4(),
            type: 'text',
            content: '',
            layout: { x: 0, y: Infinity, w: 12, h: 4 }
        };
        const newWidgets = [...widgets, newWidget];
        updateWidgets(newWidgets);
    };

    const triggerImageUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleImageUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        setIsUploading(true)
        const cloudName = "dqs9ysc7b"
        const uploadPreset = "blog_uploads"
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", uploadPreset)

        try {
            const res = await axios.post(url, formData, { withCredentials: false })
            let imageUrl = res.data.secure_url
            imageUrl = imageUrl.replace('/upload/', '/upload/w_1200,c_limit,q_auto,f_auto/')

            const newWidget = {
                id: uuidv4(),
                type: 'image',
                content: imageUrl,
                layout: { x: 0, y: Infinity, w: 4, h: 8 }
            };
            const newWidgets = [...widgets, newWidget];
            updateWidgets(newWidgets);

        } catch (err) {
            console.error("Cloudinary upload error", err)
            alert("Upload failed.")
        } finally {
            setIsUploading(false)
        }
        event.target.value = null;
    }

    const addVideoWidget = () => {
        const url = window.prompt('Enter YouTube/Video URL:');
        if (url) {
            const newWidget = {
                id: uuidv4(),
                type: 'video',
                content: url,
                layout: { x: 0, y: Infinity, w: 6, h: 8 }
            };
            const newWidgets = [...widgets, newWidget];
            updateWidgets(newWidgets);
        }
    };




    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        console.log('🚀 Publish button clicked');

        if (!title.trim()) {
            alert("Please enter a title for your post.");
            setIsSaving(false);
            return;
        }

        if (!docId) {
            alert("Document ID is missing. Please try refreshing the page.");
            setIsSaving(false);
            return;
        }

        try {
            console.log('📦 Preparing widgets for save...', { widgetCount: widgets.length, ydoc: !!ydoc });

            const sanitizedWidgets = widgets.map(w => {
                let content = w.content;
                if (w.type === 'text' && ydoc) {
                    const ytext = ydoc.getText(w.id);
                    content = ytext.toString();
                    console.log(`   Widget ${w.id}: Y.Text content length = ${content.length}`);
                }
                return {
                    ...w,
                    content,
                    layout: {
                        ...w.layout,
                        y: w.layout.y
                    }
                };
            });

            const payload = {
                title,
                content: sanitizedWidgets,
            };

            const response = await api.post(`/api/blog/updateblog/${docId}`, {
                ...payload,
                published: true
            });

            console.log('✅ Published successfully!');
            navigate("/home");
        } catch (error) {
            console.error('❌ Publish failed:', error);
            alert("Failed to publish document.");
        } finally {
            setIsSaving(false);
        }
    };


    if (loading) {
        return <div className="text-center mt-20">Loading editor...</div>;
    }

    return (
        <div className="min-h-screen py-10 px-4 bg-slate-50 dark:bg-black font-['Inter',_sans-serif]">


            <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12 px-4 py-4 rounded-lg">
                <h2 className="font-['Outfit',_sans-serif] text-2xl font-bold tracking-tight text-slate-900 dark:!text-gray-400">
                    New Story
                </h2>

                <div className="flex items-center gap-6">
                    {/* Active Collaborators Indicator */}
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {collaborators.length} Online
                    </div>

                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-300 transition-colors"
                    >
                        {isDark ? <i className="bi bi-sun h3"></i> : <i className="bi bi-moon h3"></i>}
                    </button>

                    <button
                        disabled={!docId}
                        onClick={() => setShareOpen(true)}
                        className={`px-4 py-2 rounded text-xs uppercase tracking-widest font-bold
    flex items-center gap-2 transition-all
    ${docId
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-400 text-gray-200 cursor-not-allowed"
                            }`}
                    >
                        Share
                    </button>

                    {canEdit && (
                        <button
                            disabled={collaborators.length < 2}
                            onClick={() => {
                                const otherUsers = collaborators.filter(
                                    c => c.socketId && c.socketId !== socket.id
                                );

                                if (otherUsers.length === 0) {
                                    alert("No other collaborators online");
                                    return;
                                }


                                otherUsers.forEach(user => {
                                    socket.emit("call:invite", {
                                        blogId: docId,
                                        to: user.socketId,
                                    });
                                });

                                setOutgoingCall(otherUsers[0]);
                            }}
                            className="px-4 py-2 rounded bg-green-600 text-white text-xs uppercase font-bold"
                        >
                            📹 Start Call
                        </button>
                    )}



                    {canEdit && (
                        <button
                            disabled={isSaving}
                            onClick={handleSave}
                            className={`px-6 py-2 rounded bg-slate-900 dark:bg-gray-600 text-slate-50 dark:text-white text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-all active:scale-95 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSaving ? 'Publishing...' : 'Publish'}
                        </button>
                    )}
                </div>
            </nav>

            <div className="max-w-[1400px] mx-auto">
                <div className="bg-white dark:!bg-gray-300 rounded-2xl shadow-xl border border-slate-200 dark:border-gray-200 transition-colors duration-500 overflow-hidden">

                    <div className="p-4 sm:p-8 min-h-[80vh]">

                        <input
                            readOnly={!canEdit}
                            placeholder="Title..."
                            value={title}
                            onChange={e => {
                                if (!canEdit) return;
                                const newTitle = e.target.value;
                                setTitle(newTitle);
                                if (ydoc) {
                                    const yTitle = ydoc.getText('title');
                                    yTitle.doc.transact(() => {
                                        yTitle.delete(0, yTitle.length);
                                        yTitle.insert(0, newTitle);
                                    }, 'local');
                                }
                            }}
                            style={{
                                padding: "1rem",
                                margin: "1rem",
                                borderRadius: "1rem",
                                border: "none",
                                outline: "none",
                                fontSize: "2rem",
                                fontWeight: "bold",
                                backgroundColor: "transparent",
                                transition: "all 0.3s ease",
                            }}
                            className="w-full font-['Outfit',_sans-serif] text-[#ffffffff] text-2xl md:text-4xl font-bold bg-transparent border-none focus:outline-none p-0 text-slate-700 placeholder:text-slate-300 dark:placeholder:text-gray-400 dark:text-gray-400"
                        />

                        {/* TOOLBAR */}
                        {canEdit && (
                            <div className="sticky top-0 z-20 bg-white/95 dark:!bg-gray-300/95 backdrop-blur-sm transition-colors duration-500 rounded mb-5 shadow-sm">
                                <ToolbarContainer>
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-600 uppercase tracking-wider mr-2 ml-1">Add Content:</span>

                                    <ToolbarButton onClick={addTextWidget} title="Add Text Block">
                                        <ToolbarIcon>text_fields</ToolbarIcon> Text
                                    </ToolbarButton>

                                    <ToolbarButton onClick={triggerImageUpload} title="Add Image">
                                        <ToolbarIcon>{isUploading ? 'sync' : 'add_photo_alternate'}</ToolbarIcon> Image
                                    </ToolbarButton>
                                    {/* Hidden Input */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                    />

                                    <ToolbarButton onClick={addVideoWidget} title="Add Video Embed">
                                        <ToolbarIcon>smart_display</ToolbarIcon> Video
                                    </ToolbarButton>
                                </ToolbarContainer>
                            </div>
                        )}

                        {/* GRID EDITOR CANVAS */}
                        <div className="dark:bg-gray-300">
                            <GridEditor widgets={widgets} setWidgets={updateWidgets} ydoc={ydoc} awareness={awareness} readOnly={!canEdit} />
                        </div>

                    </div>
                </div>
            </div>

            <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                docId={docId}
            />
            {incomingCall && (
                <IncomingCallModal
                    caller={incomingCall}
                    onAccept={acceptCall}
                    onDecline={declineCall}
                />
            )}

            {outgoingCall && (
                <OutgoingCallModal
                    callee={outgoingCall}
                    onCancel={cancelCall}
                />
            )}

            {callAccepted && (
                <VideoCallPanel
                    socket={socket}
                    blogId={docId}
                    onLeave={() => {
                        setCallAccepted(false);
                        setIncomingCall(null);
                    }}
                />
            )}

        </div>

    )
}

export default CreatePost