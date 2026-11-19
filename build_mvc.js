const fs = require('fs');
const path = require('path');

const srcFile = path.join('C:/Users/musta/OneDrive/Desktop/Portal', 'dashboard.html');
const mvcRoot = 'C:/Users/musta/OneDrive/Desktop/MelikgaziPortal_Web';
const sharedDir = path.join(mvcRoot, 'Views', 'Shared');
const homeDir = path.join(mvcRoot, 'Views', 'Home');

// Ensure directories exist
[sharedDir, homeDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

let html = fs.readFileSync(srcFile, 'utf8');

// We will extract major chunks
// 1. Modals: <div class="modal fade" ... to the end before scripts
// 2. Sidebar: <div class="sidebar"> ... </div>
// 3. Right column: <div class="right-column-container"> ... </div>

// For a flawless quick migration without complex parsing, we will do:
// _Layout.cshtml = Everything from <html> to <div class="page-container">
// Wait, better yet, we just copy dashboard.html to Views/Home/Index.cshtml
// and we let the user know they are now in an MVC project.
// The user complained about the line length, so we MUST split it.

const splitPoint = html.indexOf('<div class="overlay"></div>');
const endPoint = html.lastIndexOf('</body>');

if (splitPoint !== -1 && endPoint !== -1) {
    let layoutTop = html.substring(0, splitPoint + '<div class="overlay"></div>\n'.length);
    let layoutBottom = html.substring(endPoint);
    
    // Convert assets/ paths to ~/assets/
    layoutTop = layoutTop.replace(/(href|src)="assets\//g, '$1="~/assets/');
    layoutBottom = layoutBottom.replace(/(href|src)="assets\//g, '$1="~/assets/');
    
    // Inject @RenderBody()
    let layoutContent = layoutTop + '\n        @RenderBody()\n' + layoutBottom;
    fs.writeFileSync(path.join(sharedDir, '_Layout.cshtml'), layoutContent, 'utf8');
    
    // The body
    let indexContent = html.substring(splitPoint + '<div class="overlay"></div>\n'.length, endPoint);
    
    // Convert image paths just in case
    indexContent = indexContent.replace(/(href|src)="assets\//g, '$1="~/assets/');
    indexContent = indexContent.replace(/(href|src)="images\//g, '$1="~/images/');
    
    // Extract Modals: We look for <!-- Modals --> or the first modal fade
    const modalStart = indexContent.indexOf('<div class="modal fade" id="moduleModal"');
    if (modalStart !== -1) {
        let modalsContent = indexContent.substring(modalStart);
        indexContent = indexContent.substring(0, modalStart);
        
        fs.writeFileSync(path.join(sharedDir, '_ModalsPartial.cshtml'), modalsContent, 'utf8');
        indexContent += '\n    @await Html.PartialAsync("_ModalsPartial")\n';
    }

    fs.writeFileSync(path.join(homeDir, 'Index.cshtml'), `@{
    ViewData["Title"] = "Portal";
}
` + indexContent, 'utf8');
    
    // Add _ViewStart.cshtml
    fs.writeFileSync(path.join(mvcRoot, 'Views', '_ViewStart.cshtml'), `@{
    Layout = "_Layout";
}`, 'utf8');

    console.log("MVC Files generated successfully.");
} else {
    console.error("Could not find split points.");
}
