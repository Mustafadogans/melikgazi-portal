const fs = require('fs');
const p = 'C:/Users/musta/OneDrive/Desktop/Portal/dashboard.html';
let c = fs.readFileSync(p, 'utf8');

const replaceFrom = "#birthdayModal.modal('show');";
const replaceTo = "#birthdayModal.modal({ backdrop: 'static', keyboard: false });\n                    #birthdayModal.modal('show');\n                    setTimeout(() => {\n                        let modal = document.getElementById('birthdayModal');\n                        if(modal) {\n                            modal.style.display = 'block';\n                            modal.style.opacity = '1';\n                            modal.classList.add('show');\n                            modal.style.zIndex = '999999';\n                        }\n                    }, 100);";

c = c.replace(replaceFrom, replaceTo);
fs.writeFileSync(p, c, 'utf8');
