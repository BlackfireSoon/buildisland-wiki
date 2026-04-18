/* =========================================
   1. WIKI DATA (YOUR PAGES GO HERE)
   ========================================= */
// Add, edit, or delete pages by modifying this object.
// Use standard Markdown formatting. Use markdown links [Text](#page_id) to link between pages.
const wikiPages = {
    "home": `
# Welcome to the Wiki Hub
Select a game directory below to get started.

<div class="wiki-card-container">
    <div class="wiki-card" onclick="loadPage('bi_home')">
        <h3>🏝️ Build Island</h3>
        <p>The official wiki for Bereza's building game.</p>
    </div>
    <div class="wiki-card" onclick="loadPage('bild_home')">
        <h3>🥔 Bild Iland</h3>
        <p>The highly requested parity/spinoff game.</p>
    </div>
</div>

> **Note:** To add a new main category, simply add a new div in the \`app.js\` home page markdown!
    `,

    // --- BUILD ISLAND PAGES ---
    "bi_home": `
# Build Island Wiki
Welcome to the Build Island database. 

![Build Island Thumbnail](image_eff0e5.jpg)

Build Island is a sandbox building game created by berezaa. Players are given an isolated island to construct anything they can imagine using blocks, logic gates, and physics objects.

### Quick Links
* [Basic Blocks](#bi_blocks)
* [Tools & Mechanics](#bi_tools)
    `,
    
    "bi_blocks": `
# Basic Blocks
Blocks are the fundamental building pieces in Build Island.

1. **Wood:** Standard building material. Can catch fire.
2. **Stone:** Durable and heavy.
3. **Glass:** Transparent, easily shattered.

### Example Building Script
If you want to spawn a block via code, you might use:
\`\`\`lua
local block = Instance.new("Part")
block.Material = Enum.Material.Wood
block.Parent = workspace
\`\`\`
    `,

    "bi_tools": `
# Tools & Mechanics
To manipulate the world, players use a variety of tools:
* **The Hammer:** Used to break blocks.
* **The Wrench:** Used to configure logic gates.
* **The Paintbrush:** Used to color parts.

[⬅ Back to Build Island Home](#bi_home)
    `,

    // --- BILD ILAND PAGES ---
    "bild_home": `
# Bild Iland Wiki
Welcom to Bild Iland! The best gaem.

It is like Build Island, but *different*.

### Pages
* [How to walk](#bild_walk)
* [The Dirt Block](#bild_dirt)
    `,

    "bild_walk": `
# How to walk
Press \`W\` to go forward. Do not fall off the edge.

[⬅ Back to Bild Iland Home](#bild_home)
    `
};

/* =========================================
   2. NAVIGATION CONFIGURATION
   ========================================= */
// Define what shows up in the sidebar.
const navigationConfig = [
    {
        title: "Build Island",
        links: [
            { id: "bi_home", label: "Home" },
            { id: "bi_blocks", label: "Blocks" },
            { id: "bi_tools", label: "Tools" }
        ]
    },
    {
        title: "Bild Iland",
        links: [
            { id: "bild_home", label: "Home" },
            { id: "bild_walk", label: "How to Walk" }
        ]
    }
];

/* =========================================
   3. WIKI ENGINE (DO NOT EDIT UNLESS NEEDED)
   ========================================= */

// Intercept markdown links to use our internal router
const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
    if (href.startsWith('#')) {
        const pageId = href.substring(1);
        return `<a onclick="loadPage('${pageId}')">${text}</a>`;
    }
    return `<a href="${href}" target="_blank">${text}</a>`;
};
marked.setOptions({ renderer: renderer });

// Render the sidebar navigation
function renderNavigation() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.innerHTML = '';

    navigationConfig.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'nav-group';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'nav-title';
        titleDiv.innerText = group.title;
        groupDiv.appendChild(titleDiv);

        group.links.forEach(link => {
            const a = document.createElement('a');
            a.className = 'nav-link';
            a.id = `nav-${link.id}`;
            a.innerText = link.label;
            a.onclick = () => loadPage(link.id);
            groupDiv.appendChild(a);
        });

        navMenu.appendChild(groupDiv);
    });
}

// Load and render a specific page
function loadPage(pageId) {
    const contentArea = document.getElementById('page-content');
    
    // Check if page exists
    if (!wikiPages[pageId]) {
        contentArea.innerHTML = `<h1>404</h1><p>Page "${pageId}" not found.</p><a onclick="loadPage('home')">Go Home</a>`;
        return;
    }

    // Convert Markdown to HTML and inject
    contentArea.innerHTML = marked.parse(wikiPages[pageId]);

    // Update URL Hash for back-button support
    window.location.hash = pageId;

    // Highlight active sidebar link
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const activeLink = document.getElementById(`nav-${pageId}`);
    if (activeLink) activeLink.classList.add('active');
}

// Simple Search Functionality
function searchWiki() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const contentArea = document.getElementById('page-content');
    
    if (query.trim() === '') {
        loadPage(window.location.hash.substring(1) || 'home');
        return;
    }

    let resultsHTML = `<h1>Search Results for "${query}"</h1><ul>`;
    let found = false;

    for (const [id, content] of Object.entries(wikiPages)) {
        if (id === 'home') continue; // Skip home page in search
        
        if (content.toLowerCase().includes(query) || id.toLowerCase().includes(query)) {
            // Find the title by getting the first H1 in the markdown
            const titleMatch = content.match(/^#\s+(.*)/m);
            const title = titleMatch ? titleMatch[1] : id;
            resultsHTML += `<li><a onclick="loadPage('${id}')">${title}</a></li>`;
            found = true;
        }
    }

    if (!found) {
        resultsHTML += `<li>No results found.</li>`;
    }
    
    resultsHTML += `</ul>`;
    contentArea.innerHTML = resultsHTML;
}

// Initialization
window.addEventListener('load', () => {
    renderNavigation();
    // Load page from URL hash, or default to home
    const initialPage = window.location.hash ? window.location.hash.substring(1) : 'home';
    loadPage(initialPage);
});

// Handle browser back/forward buttons
window.addEventListener('hashchange', () => {
    const page = window.location.hash ? window.location.hash.substring(1) : 'home';
    loadPage(page);
});
