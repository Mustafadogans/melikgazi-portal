const fs = require('fs');
const p = 'C:/Users/musta/OneDrive/Desktop/Portal/dashboard.html';
let c = fs.readFileSync(p, 'utf8');

const r = String.fromCharCode(65533);

c = c.replace('<div style="font-size: 70px; margin-bottom: 10px; line-height: 1;">??</div>', '<div style="font-size: 70px; margin-bottom: 10px; line-height: 1;">🎂</div>');
c = c.replace('<h2 style="color: #ff3366; font-family: \'Inter\', sans-serif; font-weight: 800; margin-bottom: 15px; letter-spacing: -1px;">' + r + 'yi Ki Do' + r + 'dun!</h2>', '<h2 style="color: #ff3366; font-family: \'Inter\', sans-serif; font-weight: 800; margin-bottom: 15px; letter-spacing: -1px;">İyi Ki Doğdun!</h2>');
c = c.replace('Yeni ya' + r + 'n' + r + 'n sana sa' + r + 'l' + r + 'k, mutluluk ve ba' + r + 'ar' + r + ' getirmesini dileriz.', 'Yeni yaşının sana sağlık, mutluluk ve başarı getirmesini dileriz.');
c = c.replace('Seninle ' + r + 'al' + r + 'maktan gurur duyuyoruz! ??', 'Seninle çalışmaktan gurur duyuyoruz! 🎉');
c = c.replace('Te' + r + 'ekk' + r + 'r Ederim', 'Teşekkür Ederim');

fs.writeFileSync(p, c, 'utf8');
