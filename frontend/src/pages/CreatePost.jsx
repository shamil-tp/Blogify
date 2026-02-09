import React, { useState, useEffect, useRef } from 'react' 
import { useParams, useNavigate } from "react-router-dom";
import api from '../api/axios'
import axios from 'axios'
import GridEditor from '../components/GridEditor/GridEditor'
import { v4 as uuidv4 } from 'uuid';

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
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(isEditMode);

    const [widgets, setWidgets] = useState(initialWidgets)
    const [title, setTitle] = useState('')
    const [isUploading, setIsUploading] = useState(false)

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

    useEffect(() => {
        if (!isEditMode) return;

        const fetchPost = async () => {
            try {
                const res = await api.get(`/api/blog/${id}`);
                setTitle(res.data.blog.title);

                const loadedContent = res.data.blog.content;

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

                setLoading(false);
            } catch (err) {
                console.error("Failed to load blog", err);
            }
        };

        fetchPost();
    }, [id, isEditMode]);


    const addTextWidget = () => {
        const newWidget = {
            id: uuidv4(),
            type: 'text',
            content: '', 
            layout: { x: 0, y: Infinity, w: 12, h: 4 }
        };
        setWidgets([...widgets, newWidget]);
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
            setWidgets([...widgets, newWidget]);

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
            setWidgets([...widgets, newWidget]);
        }
    };


    const handleSave = async () => {
        if (!title.trim()) {
            alert("Please enter a title for your post.");
            return;
        }

        try {
            const sanitizedWidgets = widgets.map(w => ({
                ...w,
                layout: {
                    ...w.layout,
                    y: w.layout.y
                }
            }));



            const payload = {
                title,
                content: sanitizedWidgets,
            };

            if (isEditMode) {
                await api.post(`/api/blog/updateblog/${id}`, payload);
                alert("Blog updated");
            } else {
                await api.post("/api/blog/postblog", payload);
                alert("Blog published");
            }
            navigate("/home");
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                alert("Cannot save: " + JSON.stringify(error.response.data));
            } else {
                alert("Error saving post");
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-20">Loading editor...</div>;
    }

    return (
        <div className="min-h-screen py-10 px-4 bg-slate-50 dark:bg-black font-['Inter',_sans-serif]">
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@700;800&display=swap');
          @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
          @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css");
        `}
            </style>

            <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12 px-4 py-4 rounded-lg">
                <h2 className="font-['Outfit',_sans-serif] text-2xl font-bold tracking-tight text-slate-900 dark:!text-gray-400">
                    New Story
                </h2>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-300 transition-colors"
                    >
                        {isDark ? <i className="bi bi-sun h3"></i> : <i className="bi bi-moon h3"></i>}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded bg-slate-900 dark:bg-gray-600 text-slate-50 dark:text-white text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-all active:scale-95"
                    >
                        Publish
                    </button>
                </div>
            </nav>

            <div className="max-w-[1400px] mx-auto">
                <div className="bg-white dark:!bg-gray-300 rounded-2xl shadow-xl border border-slate-200 dark:border-gray-200 transition-colors duration-500 overflow-hidden">

                    <div className="p-4 sm:p-8 min-h-[80vh]">

                        <input
                            type="text"
                            placeholder="Title..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
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

                        {/* GRID EDITOR CANVAS */}
                        <div className="dark:bg-gray-300">
                            <GridEditor widgets={widgets} setWidgets={setWidgets} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost