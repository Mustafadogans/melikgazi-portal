const fs = require('fs');
const p = 'C:/Users/musta/OneDrive/Desktop/Portal/dashboard.html';
let c = fs.readFileSync(p, 'utf8');

const regex = /\/\/ --- DOĞUM GÜNÜ MANTIĞI \(Simülasyon\) ---[\s\S]*?localStorage\.setItem\('portal_birthday_celebrated_2', todayDateString\);\s*\}, 800\);\s*\}/;

const newLogic = `// --- DOĞUM GÜNÜ MANTIĞI (Dinamik Enjeksiyon) ---
            const employeeName = localStorage.getItem('portal_username') || "Ahmet Bey";
            
            // --- SAHTE (MOCK) VERİTABANI ---
            const today = new Date();
            const currentMonthDay = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
            
            const mockBirthdays = {
                "personel1": currentMonthDay,
                "ahmet": "10-15",
                "mehmet": "01-01"
            };
            
            const isBirthdayToday = (mockBirthdays[employeeName.toLowerCase()] === currentMonthDay);
            const todayDateString = today.toISOString().split('T')[0];
            const lastCelebrated = localStorage.getItem('portal_birthday_celebrated_2');

            if (isBirthdayToday && lastCelebrated !== todayDateString) {
                // Sayfa yüklendikten kısa bir süre sonra sürprizi patlat
                setTimeout(() => {
                    // Confetti Konfeti Animasyonu
                    var duration = 4 * 1000;
                    var animationEnd = Date.now() + duration;
                    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999999 };

                    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

                    var interval = setInterval(function() {
                        var timeLeft = animationEnd - Date.now();
                        if (timeLeft <= 0) return clearInterval(interval);
                        var particleCount = 50 * (timeLeft / duration);
                        
                        confetti(Object.assign({}, defaults, { particleCount,
                            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                        }));
                        confetti(Object.assign({}, defaults, { particleCount,
                            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                        }));
                    }, 250);
                    
                    // Dinamik Olarak Saf HTML Pop-up Enjekte Et
                    const existingOverlay = document.getElementById('customBirthdayOverlay');
                    if (!existingOverlay) {
                        const overlayHtml = \`
                        <div id="customBirthdayOverlay" style="display: flex; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.3); z-index: 2147483647; justify-content: center; align-items: center; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);">
                            <div style="background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(244,246,249,0.95) 100%); border-radius: 20px; padding: 40px; text-align: center; max-width: 450px; width: 90%; box-shadow: 0 15px 35px rgba(0,0,0,0.2); animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 1px solid rgba(255,255,255,0.5);">
                                <style>
                                @keyframes popIn {
                                    0% { opacity: 0; transform: scale(0.8); }
                                    100% { opacity: 1; transform: scale(1); }
                                }
                                </style>
                                <div style="font-size: 65px; margin-bottom: 15px; line-height: 1;">🎂</div>
                                <h2 style="color: #ff3366; font-family: 'Inter', sans-serif; font-weight: 800; margin-bottom: 15px;">İyi Ki Doğdun!</h2>
                                <h4 style="color: #333; font-weight: 700; margin-bottom: 20px; font-size: 24px;">\${employeeName.toUpperCase()}</h4>
                                <p style="color: #666; font-size: 16px; margin-bottom: 30px; line-height: 1.5;">
                                    Yeni yaşının sana sağlık, mutluluk ve başarı getirmesini dileriz.<br>
                                    Seninle çalışmaktan gurur duyuyoruz! 🎉
                                </p>
                                <button onclick="document.getElementById('customBirthdayOverlay').style.display='none';" style="background: linear-gradient(45deg, #ff3366, #ff7b54); color: white; border: none; padding: 12px 35px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 5px 15px rgba(255,51,102,0.4); cursor: pointer;">
                                    Teşekkür Ederim
                                </button>
                            </div>
                        </div>\`;
                        document.body.insertAdjacentHTML('beforeend', overlayHtml);
                    } else {
                        existingOverlay.style.display = 'flex';
                    }
                    
                    // Bugünü tarayıcı hafızasına kaydet
                    localStorage.setItem('portal_birthday_celebrated_2', todayDateString);
                }, 800);
            }`;

if (!regex.test(c)) {
    console.error("Regex did not match anything!");
} else {
    c = c.replace(regex, newLogic);
    // Remove the old unused HTML modal
    c = c.replace(/<!-- Birthday Modal -->[\s\S]*?(?=<!-- Bootstrap JS and dependencies -->)/g, '');
    fs.writeFileSync(p, c, 'utf8');
    console.log('Success');
}
