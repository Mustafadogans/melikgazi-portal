// Genel Yetkilendirme ve Oturum Kontrolü

function checkAdminRole() {
    if (localStorage.getItem('portal_user_role') !== 'admin') {
        alert('Bu sayfaya erişim yetkiniz yok!');
        window.location.href = 'dashboard.html';
    }
}

function handleLogout(e) {
    if(e) e.preventDefault();
    localStorage.removeItem('portal_user_role');
    localStorage.removeItem('portal_username');
    window.location.href = 'index.html';
}

// Global olarak dışarı aç
window.checkAdminRole = checkAdminRole;
window.handleLogout = handleLogout;
