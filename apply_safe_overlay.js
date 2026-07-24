const fs = require('fs');
const p = 'C:/Users/musta/OneDrive/Desktop/Portal/dashboard.html';
let c = fs.readFileSync(p, 'utf8');

// 1. Inject dynamic mock birthday logic
const oldLogic = `const isBirthdayToday = true; 
            const employeeName = localStorage.getItem('portal_username') || "Ahmet Bey";
            
            const todayDateString = new Date().toISOString().split('T')[0];`;

const newLogic = `const employeeName = localStorage.getItem('portal_username') || "Ahmet Bey";
            
            // --- SAHTE (MOCK) VERİTABANI ---
            const today = new Date();
            const currentMonthDay = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
            
            const mockBirthdays = {
                "personel1": currentMonthDay,
                "ahmet": "10-15",
                "mehmet": "01-01"
            };
            
            const isBirthdayToday = (mockBirthdays[employeeName.toLowerCase()] === currentMonthDay);
            const todayDateString = today.toISOString().split('T')[0];`;

c = c.replace(oldLogic, newLogic);

// 2. Point name injection to custom overlay
c = c.replace("const nameEl = document.getElementById('birthdayName');", "const nameEl = document.getElementById('customBirthdayName');");

// 3. Replace the broken bootstrap modal call with our custom display flex
c = c.replace("$('#birthdayModal').modal('show');", "document.getElementById('customBirthdayOverlay').style.display = 'flex';");

// 4. Inject the Custom Pure CSS Pop-up HTML and Style right before </body>
const customOverlay = `
<!-- Custom Birthday Overlay -->
<div id="customBirthdayOverlay" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 2147483647 !important; justify-content: center; align-items: center;">
    <div style="background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%); border-radius: 24px; padding: 40px; width: 90%; max-width: 450px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.6); animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
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

c = c.replace('</body>', customOverlay + '\n</body>');

fs.writeFileSync(p, c, 'utf8');
console.log('Success');
