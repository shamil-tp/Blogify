
/* 
    BLOG RENDERING LIBRARY (Grid + Quill Edition)
    ---------------------------------------------
    Usage: 
    1. Include this script.
    2. Ensure there is a <div id="canvas"></div> in your HTML.
    3. Call generateBlog('my-blog-slug', 'themeName');
*/

const themes = [
    // 1. TOKYO NIGHT (Your existing theme)
    {
        names: ['tokyoNight', 'tokyo_night', 'TokyoNight', 'Tokyo_night', 'Tokyo_Night'],
        canvas: {
            width: "90%",
            maxWidth: "1200px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#24283b",
            border: "1px solid #414868",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            padding: "40px",
            fontFamily: "'JetBrains Mono', monospace",
            color: "#a9b1d6",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#24283b", fontFamily: "'JetBrains Mono', monospace", color: "#a9b1d6", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#7aa2f7" },
        publlishedOn: { fontWeight: '200', color: '#565f89' },
        hr: { color: '#414868' },
        text: { color: "#a9b1d6" },
        // Quill content often uses these tags, we can style them generally
        contentStyles: `
            a { color: #7aa2f7; text-decoration: none; }
            strong, b { color: #7dcfff; font-weight: 800; }
            em, i { color: #bb9af7; }
            code { color: #7dcfff; background-color: #292e42; padding: 2px 6px; border-radius: 4px; }
            blockquote { border-left: 3px solid #7aa2f7; padding-left: 1em; color: #7a8cba; }
            h1 { color: #c0caf5; } h2 { color: #f7768e; } h3 { color: #9aa5ce; }
        `
    },

    // 2. DRACULA
    {
        names: ['dracula', 'Dracula', 'vampire'],
        canvas: {
            width: "90%",
            maxWidth: "1200px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#282a36",
            border: "1px solid #44475a",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
            padding: "40px",
            fontFamily: "'Fira Code', monospace",
            color: "#f8f8f2",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#282a36", fontFamily: "'Fira Code', monospace", color: "#f8f8f2", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#bd93f9" },
        publlishedOn: { fontWeight: '200', color: '#6272a4' },
        hr: { color: '#44475a' },
        text: { color: "#f8f8f2" },
        contentStyles: `
            a { color: #8be9fd; }
            strong, b { color: #ffb86c; font-weight: 800; }
            em, i { color: #f1fa8c; }
            code { color: #f1fa8c; background-color: #44475a; padding: 2px 6px; border-radius: 4px; }
            blockquote { border-left: 3px solid #bd93f9; padding-left: 1em; color: #6272a4; }
            h1 { color: #ff79c6; } h2 { color: #50fa7b; } 
        `
    },

    // 3. SOLARIZED LIGHT
    {
        names: ['solarized', 'solarizedLight', 'Solarized', 'day'],
        canvas: {
            width: "90%",
            maxWidth: "1200px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#fdf6e3",
            border: "1px solid #eee8d5",
            borderRadius: "8px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
            padding: "40px",
            fontFamily: "'Merriweather', serif",
            color: "#657b83",
            lineHeight: "1.8",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#fdf6e3", fontFamily: "'Merriweather', serif", color: "#657b83", lineHeight: "1.8", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#b58900" },
        publlishedOn: { fontWeight: '200', color: '#93a1a1' },
        hr: { color: '#eee8d5' },
        text: { color: "#657b83" },
        contentStyles: `
            a { color: #268bd2; }
            strong, b { color: #d33682; font-weight: 800; }
            em, i { color: #859900; }
            code { color: #2aa198; background-color: #eee8d5; padding: 2px 6px; border-radius: 4px; }
            h1 { color: #cb4b16; } h2 { color: #268bd2; }
        `
    },

    // 4. GITHUB MODERN
    {
        names: ['github', 'clean', 'light', 'GitHub'],
        canvas: {
            width: "90%",
            maxWidth: "1200px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            border: "1px solid #d0d7de",
            borderRadius: "6px",
            boxShadow: "0 3px 6px rgba(140, 149, 159, 0.15)",
            padding: "40px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
            color: "#24292f",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#ffffff", fontFamily: "sans-serif", color: "#24292f", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#1f2328" },
        publlishedOn: { fontWeight: '200', color: '#6e7781' },
        hr: { color: '#d0d7de' },
        text: { color: "#24292f" },
        contentStyles: `
            a { color: #0969da; text-decoration: underline; }
            strong, b { color: #24292f; font-weight: 600; }
            code { color: #24292f; background-color: #f6f8fa; padding: 2px 6px; border-radius: 4px; }
            blockquote { border-left: 3px solid #d0d7de; color: #6e7781; padding-left: 1em; }
            h1, h2, h3 { color: #24292f; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
        `
    },

    // 5. MONOKAI PRO
    {
        names: ['monokai', 'Monokai', 'sublime'],
        canvas: {
            width: "90%",
            maxWidth: "1200px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#2d2a2e",
            border: "1px solid #403e41",
            borderRadius: "12px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
            padding: "40px",
            fontFamily: "'Operator Mono', 'Fira Code', monospace",
            color: "#fcfcfa",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#2d2a2e", fontFamily: "monospace", color: "#fcfcfa", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#ffd866" },
        publlishedOn: { fontWeight: '200', color: '#939293' },
        hr: { color: '#403e41' },
        text: { color: "#fcfcfa" },
        contentStyles: `
            a { color: #78dce8; }
            strong, b { color: #ff6188; font-weight: 800; }
            em, i { color: #ab9df2; }
            code { color: #ff6188; background-color: #403e41; padding: 2px 6px; border-radius: 4px; }
            h1 { color: #ff6188; } h2 { color: #a9dc76; }
        `
    },

    // 6. NORD
    {
        names: ['nord', 'arctic', 'Nord'],
        canvas: {
            width: "90%",
            maxWidth: "1200px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#2e3440",
            border: "1px solid #3b4252",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            padding: "40px",
            fontFamily: "'Rubik', sans-serif",
            color: "#d8dee9",
            lineHeight: "1.7",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#2e3440", fontFamily: "sans-serif", color: "#d8dee9", lineHeight: "1.7", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#88c0d0" },
        publlishedOn: { fontWeight: '200', color: '#4c566a' },
        hr: { color: '#434c5e' },
        text: { color: "#d8dee9" },
        contentStyles: `
            a { color: #88c0d0; }
            strong, b { color: #ebcb8b; font-weight: 800; }
            em, i { color: #a3be8c; }
            code { color: #d8dee9; background-color: #3b4252; padding: 2px 6px; border-radius: 4px; }
            h1 { color: #81a1c1; } h2 { color: #5e81ac; }
        `
    },

    // 7. CYBERPUNK
    {
        names: ['cyberpunk', 'neon', 'future'],
        canvas: {
            width: "90%",
            maxWidth: "1200px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#000b1e",
            border: "2px solid #00f3ff",
            borderRadius: "0px",
            boxShadow: "0 0 15px rgba(0, 243, 255, 0.3), 0 0 30px rgba(0, 243, 255, 0.1)",
            padding: "40px",
            fontFamily: "'Orbitron', 'Roboto', sans-serif",
            color: "#e0e0e0",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#000b1e", fontFamily: "sans-serif", color: "#e0e0e0", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#fee801" },
        publlishedOn: { fontWeight: '200', color: '#00f3ff' },
        hr: { color: '#ff003c' },
        text: { color: "#e0e0e0" },
        contentStyles: `
            a { color: #00f3ff; text-decoration: underline; }
            strong, b { color: #fee801; font-weight: 800; text-shadow: 0 0 5px rgba(254, 232, 1, 0.5); }
            em, i { color: #ff00ff; }
            code { color: #fee801; background-color: #111; border: 1px solid #fee801; }
            h1 { color: #ff003c; text-transform: uppercase; letter-spacing: 2px; }
            h2 { color: #00f3ff; }
        `
    },

    // 8. SPIDER-MAN
    {
        names: ['spiderman', 'spider-man', 'spidey', 'peter_parker'],
        canvas: {
            width: "90%",
            maxWidth: "1200px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#0b162c",
            border: "3px solid #e62429",
            borderRadius: "16px",
            boxShadow: "0 0 25px rgba(230, 36, 41, 0.25)",
            padding: "40px",
            fontFamily: "'Roboto', 'Arial', sans-serif",
            color: "#edf2f4",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#0b162c", fontFamily: "sans-serif", color: "#edf2f4", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'center', color: "#e62429", textTransform: 'uppercase', letterSpacing: '1.5px' },
        publlishedOn: { fontWeight: 'bold', color: '#48cae4' },
        hr: { color: '#e62429' },
        text: { color: "#edf2f4" },
        contentStyles: `
            a { color: #48cae4; }
            strong, b { color: #e62429; font-weight: 800; }
            code { color: #0b162c; background-color: #edf2f4; padding: 2px 6px; }
            h1 { color: #e62429; border-bottom: 2px solid #e62429; }
            h2 { color: #ffffff; }
        `
    },

    // 9. THE HULK
    {
        names: ['hulk', 'bruce_banner', 'smash', 'gamma'],
        canvas: {
            width: "90%",
            maxWidth: "1200px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#1a0f2e",
            border: "3px solid #39ff14",
            borderRadius: "8px",
            boxShadow: "0 0 30px rgba(57, 255, 20, 0.4)",
            padding: "40px",
            fontFamily: "'Arial Black', 'Impact', sans-serif",
            color: "#e0e0e0",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#1a0f2e", fontFamily: "sans-serif", color: "#e0e0e0", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'center', color: "#39ff14", textTransform: 'uppercase', fontSize: '2.5rem' },
        publlishedOn: { fontWeight: 'bold', color: '#9b59b6' },
        hr: { color: '#39ff14' },
        text: { color: "#e0e0e0" },
        contentStyles: `
            a { color: #ba68c8; }
            strong, b { color: #39ff14; font-weight: 900; }
            code { color: #1a0f2e; background-color: #39ff14; }
            h1 { color: #39ff14; } h2 { color: #ba68c8; }
        `
    },
    // ... (Adding others briefly for completeness, assuming standard usage based on user input list)
    // 14. PAPER
    {
        names: ['paper', 'minimal', 'classic', 'newspaper'],
        canvas: {
            width: "90%",
            maxWidth: "1200px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            border: "1px solid #000000",
            borderRadius: "0px",
            boxShadow: "10px 10px 0px rgba(0, 0, 0, 0.1)",
            padding: "40px",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: "#333333",
            lineHeight: "1.8",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#ffffff", fontFamily: "serif", color: "#333333", lineHeight: "1.8", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#000000", fontWeight: '900' },
        publlishedOn: { fontWeight: 'italic', color: '#666666' },
        hr: { color: '#000000' },
        text: { color: "#333333" },
        contentStyles: `
            a { color: #000000; text-decoration: underline; }
            strong, b { color: #000000; font-weight: bold; }
            h1, h2 { color: #000000; }
        `
    }
    // (Other themes from user list can be added here following same pattern)
];

// Fallback Theme
const defaultTheme = themes[3]; // Github Light

// --- MAIN GENERATOR FUNCTION ---
/**
 * Fetches and renders a blog post into the #canvas element.
 * @param {string} slug - The slug of the blog to fetch
 * @param {string} themeName - The name of the theme to apply
 */
async function generateBlog(slug, themeName) {
    console.log("Generating Blog:", slug, "Theme:", themeName);

    // 1. Fetch Data
    // Note: Adjust API URL if needed
    try {
        const response = await fetch(`https://blogify-three-weld.vercel.app/api/viewblog/${slug}`);
        if (!response.ok) throw new Error("Failed to fetch blog");
        const data = await response.json();

        // 2. Resolve Theme
        let theme = defaultTheme;
        if (themeName) {
            const found = themes.find(t => t.names.some(n => n.toLowerCase() === themeName.toLowerCase()));
            if (found) theme = found;
        }

        // 3. Prepare Canvas
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            console.error("Canvas element not found!");
            return;
        }
        canvas.innerHTML = ''; // Clear previous

        // Apply Canvas Styles
        Object.assign(canvas.style, theme.canvas);

        // 4. Render Blog Content
        const article = renderBlogPost(data.blog, theme);
        canvas.append(article);

    } catch (error) {
        console.error("Error generating blog:", error);
    }
}

/**
 * Renders the Blog Structure
 */
function renderBlogPost(blog, theme) {
    // Article Container
    const article = document.createElement('article');
    Object.assign(article.style, theme.article);

    // Title
    const title = document.createElement('h1');
    title.innerText = blog.title;
    Object.assign(title.style, theme.title);
    article.append(title);

    // Date
    const dateOfCreation = new Date(blog.createdAt);
    const dateString = dateOfCreation.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeString = dateOfCreation.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const publishedOn = document.createElement('h5');
    publishedOn.innerText = `Published on ${dateString} • ${timeString}`;
    Object.assign(publishedOn.style, theme.publlishedOn);
    article.append(publishedOn);

    // Separator
    const hr = document.createElement('hr');
    Object.assign(hr.style, theme.hr);
    article.append(hr);

    // --- GRID LAYOUT CONTAINER ---
    const gridDiv = document.createElement('div');
    gridDiv.style.display = 'grid';
    gridDiv.style.gridTemplateColumns = 'repeat(12, 1fr)';

    // CHANGE THIS: Instead of a fixed 30px, allow it to expand
    gridDiv.style.gridAutoRows = 'min-content';

    gridDiv.style.gap = '10px 20px';
    gridDiv.style.width = '100%';
    gridDiv.style.marginTop = '20px';

    article.append(gridDiv);

    // Inject Theme Content Styles (Quill HTML needs CSS classes/rules)
    // Since we are doing inline styles, we create a style tag for inner HTML content
    // FIX: Added wrapping styles and alignment classes to prevent horizontal scroll
    if (theme.contentStyles) {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
            #canvas article div.ql-content { 
                color: ${theme.text.color};
                word-wrap: break-word; 
                overflow-wrap: break-word; 
                white-space: pre-wrap;
                max-width: 100%;
            } 
            #canvas article div.ql-content * { ${theme.contentStyles} }
            
            /* Quill Alignment Classes */
            .ql-align-center { text-align: center; }
            .ql-align-right { text-align: right; }
            .ql-align-justify { text-align: justify; }
            
            /* Ensure images inside text wrap correctly if any */
            #canvas article div.ql-content img { max-width: 100%; height: auto; }
        `;
        document.head.appendChild(styleTag);
    }

    // Render Widgets
    if (Array.isArray(blog.content)) {
        blog.content.forEach(widget => {
            gridDiv.append(createGridItem(widget, theme));
        });
    }

    return article;
}

/**
 * Creates a Grid Item (Text, Image, or Video)
 */
function createGridItem(widget, theme) {
    const { x, y, w, h } = widget.layout;

    // Wrapper Div for Grid Positioning
    // Wrapper Div for Grid Positioning
    const wrapper = document.createElement('div');
    wrapper.style.gridColumnStart = x + 1;
    wrapper.style.gridColumnEnd = `span ${w}`;
    wrapper.style.gridRowStart = y + 1;
    wrapper.style.gridRowEnd = `span ${h}`;

    // CHANGE THIS: Change 'hidden' to 'visible' so the full content shows
    wrapper.style.overflow = 'visible';

    // Render Content based on Type
    if (widget.type === 'text') {
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('ql-content');
        contentDiv.innerHTML = widget.content;

        contentDiv.style.width = '100%';
        // Ensure height is not locked to 100% of the small grid box
        contentDiv.style.height = 'auto';
        contentDiv.style.overflow = 'visible';

        wrapper.append(contentDiv);
    }
    else if (widget.type === 'image') {
        const img = document.createElement('img');
        img.src = widget.content;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        wrapper.append(img);
    }
    else if (widget.type === 'video') {
        const iframe = document.createElement('iframe');
        iframe.src = getEmbedUrl(widget.content);
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = '0';
        iframe.style.borderRadius = '8px';
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        wrapper.append(iframe);
    }

    return wrapper;
}

/**
 * Helper to get usable YouTube embed URL
 */
function getEmbedUrl(stringUrl) {
    try {
        const url = new URL(stringUrl);
        let videoId = "";
        if (url.hostname.includes("youtu.be")) {
            videoId = url.pathname.slice(1);
        } else if (url.hostname.includes("youtube.com") && url.searchParams.has("v")) {
            videoId = url.searchParams.get("v");
        } else if (url.pathname.includes("/embed/")) {
            return stringUrl.replace("youtube.com", "youtube-nocookie.com");
        }

        if (videoId) {
            return `https://www.youtube-nocookie.com/embed/${videoId}`;
        }
    } catch (error) {
        console.error("URL parsing failed:", stringUrl);
    }
    return stringUrl;
}

// Export for module usage, or attach to window for script usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateBlog };
} else {
    window.generateBlog = generateBlog;
}
