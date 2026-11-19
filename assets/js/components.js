// Admin Panel Ortak Bileşenleri (Navbar ve Sidebar)

function renderAdminNavbar() {
    const navbarHTML = `
      <div class="navbar-custom">
          <button id="menuToggle" class="btn btn-light" style="background: transparent; border: none; font-size: 20px; margin-right:15px;"><i class="fas fa-bars"></i></button>
          <div style="flex-grow: 1;"></div>
          <div style="display:flex; align-items:center;">
              <span style="font-size: 12px; font-weight:600; margin-right: 15px;" id="adminUsername">arge test</span>
              <img src="https://portal.melikgazi.bel.tr/images/logo.png" alt="Logo" style="width: 40px; cursor: pointer;" onclick="window.location.href='dashboard.html'">
          </div>
      </div>
    `;
    document.getElementById('navbar-container').innerHTML = navbarHTML;
}

function renderAdminSidebar() {
    const sidebarHTML = `
      <div class="sidebar" id="sidebarMenu">
          <a href="dashboard.html"><i class="fas fa-home" style="width: 25px;"></i> Ana Sayfa</a>
          <a href="admin_ajanda.html"><i class="fas fa-calendar-alt" style="width: 25px;"></i> Ajanda</a>
          <a href="admin_bildirimler.html"><i class="fas fa-bell" style="width: 25px;"></i> Bildirimler</a>
          <a href="admin_listeler.html"><i class="fas fa-list" style="width: 25px;"></i> Listeler</a>
          <a href="admin_yemek.html"><i class="fas fa-utensils" style="width: 25px;"></i> Yemek Menüsü</a>
          <a href="admin_moduller.html"><i class="fas fa-cubes" style="width: 25px;"></i> Modüller</a>
          <a href="admin_kullanicilar.html"><i class="fas fa-users" style="width: 25px;"></i> Kullanıcılar</a>
          <a href="admin_gruplar.html"><i class="fas fa-user-friends" style="width: 25px;"></i> Gruplar</a>
          <a href="admin_slide.html"><i class="fas fa-images" style="width: 25px;"></i> Slide</a>
          <a href="admin_giris_yazisi.html"><i class="fas fa-font" style="width: 25px;"></i> Giriş Yazısı</a>
      </div>
    `;
    document.getElementById('sidebar-container').innerHTML = sidebarHTML;
    
    // Sidebar toggle fonksiyonu
    const menuToggle = document.getElementById('menuToggle');
    if(menuToggle) {
        menuToggle.addEventListener('click', function() {
            const sidebarMenu = document.getElementById('sidebarMenu');
            const contentArea = document.querySelector('.content-area') || document.querySelector('.container-fluid');
            if(sidebarMenu) sidebarMenu.classList.toggle('active');
            if(contentArea) contentArea.classList.toggle('shifted');
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if(document.getElementById('navbar-container')) renderAdminNavbar();
    if(document.getElementById('sidebar-container')) renderAdminSidebar();
    
    const adminUser = localStorage.getItem('portal_username') || 'Bilinmeyen';
    const userSpan = document.getElementById('adminUsername');
    if(userSpan) {
        userSpan.innerText = adminUser;
    }
});
