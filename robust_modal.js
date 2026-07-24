const fs = require('fs');
const p = 'C:/Users/musta/OneDrive/Desktop/Portal/dashboard.html';
let c = fs.readFileSync(p, 'utf8');

// Remove any existing birthday modal completely to avoid duplicates
const startIdx = c.indexOf('<!-- Birthday Modal -->');
if(startIdx > -1) {
    const endIdx = c.indexOf('</div>\n    </div>\n      </div>\n    </div>', startIdx);
    if(endIdx > -1) {
        c = c.substring(0, startIdx) + c.substring(endIdx + 45);
    } else {
        // Fallback removal if end tag is weird
        const nextScript = c.indexOf('<script', startIdx);
        if(nextScript > -1) c = c.substring(0, startIdx) + c.substring(nextScript);
    }
}

// Remove the one after script just in case
const startIdx2 = c.lastIndexOf('<!-- Birthday Modal -->');
if(startIdx2 > -1) {
    c = c.substring(0, startIdx2);
}

// Ensure </body> exists
if(!c.includes('</body>')) {
    c += '\n</body>';
}

const cleanModal = `
<!-- Birthday Modal -->
<div class="modal" id="birthdayModal" tabindex="-1" role="dialog" aria-hidden="true" style="display:none; z-index: 999999 !important; position: fixed !important;">
  <div class="modal-dialog modal-dialog-centered" role="document" style="z-index: 1000000 !important;">
    <div class="modal-content" style="border-radius: 20px; border: none; box-shadow: 0 20px 50px rgba(0,0,0,0.4); overflow: hidden; background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%); text-align: center;">
      <div class="modal-body p-5">
        <div style="font-size: 60px; margin-bottom: -10px;">🎂</div>
        <h2 class="font-weight-bold mt-3 mb-2" style="color: #ff3366; font-family: 'Inter', sans-serif; letter-spacing: -1px;">İyi Ki Doğdun!</h2>
        <h4 class="font-weight-bold text-dark mb-4" id="birthdayName" style="font-size: 20px;">Personel</h4>
        <p style="color: #666; font-size: 15px; line-height: 1.6; font-weight: 500;">
          Yeni yaşının sana sağlık, mutluluk ve başarı getirmesini dileriz.<br>
          Seninle çalışmaktan gurur duyuyoruz! 🎉
        </p>
        <button type="button" class="btn btn-primary mt-4 px-5 py-2" onclick="document.getElementById('birthdayModal').style.display='none'" data-dismiss="modal" style="border-radius: 30px; background: linear-gradient(45deg, #ff3366, #ff7b54); border: none; font-weight: bold; box-shadow: 0 4px 15px rgba(255, 51, 102, 0.4); transition: transform 0.2s;">
          Teşekkür Ederim
        </button>
      </div>
    </div>
  </div>
</div>
`;

// Insert right after <body>
c = c.replace('<body>', '<body>\n' + cleanModal);

// Add an alert fallback inside the script just in case the DOM modal is totally broken
if(c.includes("$('#birthdayModal').modal('show');") && !c.includes("alert('İyi Ki Doğdun!")) {
    c = c.replace("$('#birthdayModal').modal('show');", "$('#birthdayModal').modal('show'); alert('İyi Ki Doğdun! Yeni yaşının sana sağlık, mutluluk ve başarı getirmesini dileriz. \\n\\n(Not: Pop-up ekranı engelleyiciniz varsa veya tasarım üstte kalıyorsa bu uyarıyı görürsünüz)');");
}

fs.writeFileSync(p, c, 'utf8');
