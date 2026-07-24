const fs = require('fs');
const p = 'C:/Users/musta/OneDrive/Desktop/Portal/dashboard.html';
let c = fs.readFileSync(p, 'utf8');

// 1. Remove the old birthdayModal HTML
const startIdx = c.indexOf('<!-- Birthday Modal -->');
if(startIdx > -1) {
    const scriptStart = c.indexOf('<script', startIdx);
    if (scriptStart > -1) {
        c = c.substring(0, startIdx) + c.substring(scriptStart);
    } else {
        const bodyEnd = c.indexOf('</body>', startIdx);
        if (bodyEnd > -1) c = c.substring(0, startIdx) + '\n' + c.substring(bodyEnd);
    }
}
c = c.replace(/<!-- Birthday Modal -->[\s\S]*?(?=<\/body>)/g, '');

// 2. Remove all alert variations and old script logic
c = c.replace(/\$\('#birthdayModal'\)\.modal\(\{[^}]+\}\);/g, "");
c = c.replace(/\$\('#birthdayModal'\)\.modal\('show'\);/g, "");
c = c.replace(/alert\('İyi Ki Doğdun[^)]+\);/g, "");
c = c.replace(/setTimeout\(\(\) => \{[^}]+let modal = document\.getElementById\('birthdayModal'\);[^}]+\}[^}]+\}, 100\);/g, "");
c = c.replace(/let modal = document\.getElementById\('birthdayModal'\);[\s\S]*?modal\.style\.zIndex = '999999';[\s\S]*?\}/g, "");

// Replace the comment that calls modal with the new call
c = c.replace("// Doğum Günü Özel Pop-up'ını Göster", "document.getElementById('customBirthdayOverlay').style.display = 'flex';");
// Also insert it exactly where the old logic was:
c = c.replace("setTimeout(() => {", "setTimeout(() => {\n                    document.getElementById('customBirthdayOverlay').style.display = 'flex';");

// 3. Inject the Custom Pure CSS Pop-up
const customOverlay = `
<!-- Custom Birthday Overlay -->
<div id="customBirthdayOverlay" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 9999998; justify-content: center; align-items: center; backdrop-filter: blur(5px);">
    <div style="background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%); border-radius: 24px; padding: 40px; width: 90%; max-width: 450px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.3); z-index: 9999999; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        <div style="font-size: 70px; margin-bottom: 10px; line-height: 1;">🎂</div>
        <h2 style="color: #ff3366; font-family: 'Inter', sans-serif; font-weight: 800; margin-bottom: 15px; letter-spacing: -1px;">İyi Ki Doğdun!</h2>
        <h4 id="customBirthdayName" style="color: #333; font-weight: 700; margin-bottom: 20px; font-size: 22px;">Personel</h4>
        <p style="color: #666; font-size: 16px; line-height: 1.6; font-weight: 500; margin-bottom: 30px;">
            Yeni yaşının sana sağlık, mutluluk ve başarı getirmesini dileriz.<br>
            Seninle çalışmaktan gurur duyuyoruz! 🎉
        </p>
        <button onclick="document.getElementById('customBirthdayOverlay').style.display='none';" style="background: linear-gradient(45deg, #ff3366, #ff7b54); color: white; border: none; padding: 12px 35px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 8px 20px rgba(255, 51, 102, 0.4); cursor: pointer; transition: transform 0.2s;">
            Teşekkür Ederim
        </button>
    </div>
</div>
<style>
@keyframes popIn {
    0% { opacity: 0; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1); }
}
</style>
`;

// Insert the overlay right before </body>
if (!c.includes('customBirthdayOverlay')) {
    c = c.replace('</body>', customOverlay + '\n</body>');
}

// Update the name setting logic
c = c.replace("const nameEl = document.getElementById('birthdayName');", "const nameEl = document.getElementById('customBirthdayName');");

fs.writeFileSync(p, c, 'utf8');
console.log('Success');
