document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('globalSearchInput');
    const searchResults = document.getElementById('globalSearchResults');

    if (!searchInput || !searchResults) return;

    // Sabit Admin / Sol Menü Modülleri
    let modulesList = [
        { title: 'Ana Sayfa', url: 'dashboard.html', icon: 'fas fa-home' },
        { title: 'Modüller', url: 'admin_moduller.html', icon: 'fas fa-arrows-alt' },
        { title: 'Kullanıcılar', url: 'admin_kullanicilar.html', icon: 'far fa-user' },
        { title: 'Gruplar', url: 'admin_gruplar.html', icon: 'fas fa-layer-group' },
        { title: 'Ajanda Yönetimi', url: 'admin_ajanda.html', icon: 'far fa-calendar-alt' },
        { title: 'Yemek Yönetimi', url: 'admin_yemek.html', icon: 'fas fa-utensils' },
        { title: 'Bildirimler', url: 'admin_bildirimler.html', icon: 'far fa-bell' }
    ];

    // DOM'dan diğer modülleri (GEODI, EBYS vb.) dinamik çek
    const moduleCards = document.querySelectorAll('.module-card');
    moduleCards.forEach(card => {
        const titleEl = card.querySelector('strong');
        const iconEl = card.querySelector('.img-container i');
        if (titleEl) {
            const title = titleEl.textContent.trim();
            const iconClass = iconEl ? iconEl.className : 'fas fa-th';
            // Duplicate check
            if (!modulesList.some(m => m.title === title)) {
                modulesList.push({
                    title: title,
                    url: '#', // Geliştirilecek (Modal açılışı vs yapılabilir)
                    icon: iconClass,
                    cardRef: card
                });
            }
        }
    });

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        let resultsHtml = '';

        // 1. Modüllerde Ara (Sadece başlığa göre)
        const matchedModules = modulesList.filter(m => m.title.toLowerCase().includes(query));
        
        if (matchedModules.length > 0) {
            resultsHtml += '<div class="search-result-group">MODÜLLER</div>';
            matchedModules.forEach((mod) => {
                resultsHtml += '<div class="search-result-item" onclick="handleModuleClick(\'' + mod.title.replace(/'/g, "\\'") + '\')" style="cursor:pointer;">' +
                        '<div class="search-result-icon"><i class="' + mod.icon + '"></i></div>' +
                        '<div class="search-result-text">' +
                            '<div class="search-result-title">' + mod.title + '</div>' +
                            '<div class="search-result-desc"></div>' +
                        '</div>' +
                    '</div>';
            });
        }

        // 2. Etkinliklerde (Ajanda) Ara
        const agendaData = JSON.parse(localStorage.getItem('portal_admin_ajanda')) || [];
        let matchedEvents = [];
        
        agendaData.forEach(day => {
            if (day.items && Array.isArray(day.items)) {
                day.items.forEach(item => {
                    if (item.text && item.text.toLowerCase().includes(query)) {
                        matchedEvents.push({
                            title: item.text,
                            dateStr: formatSearchDate(day.date),
                            rawDate: day.date
                        });
                    }
                });
            }
        });

        if (matchedEvents.length > 0) {
            resultsHtml += '<div class="search-result-group">ETKİNLİKLER (AJANDA)</div>';
            matchedEvents.forEach(ev => {
                resultsHtml += '<div class="search-result-item" onclick="openEventDetails(\'' + ev.title.replace(/'/g, "\\'") + '\', \'' + ev.dateStr + '\')">' +
                        '<div class="search-result-icon" style="background: rgba(234, 179, 8, 0.1); color: #eab308;"><i class="far fa-calendar-check"></i></div>' +
                        '<div class="search-result-text">' +
                            '<div class="search-result-title">' + ev.title + '</div>' +
                            '<div class="search-result-desc">' + ev.dateStr + '</div>' +
                        '</div>' +
                    '</div>';
            });
        }

        // Sonuçları Göster
        if (resultsHtml === '') {
            searchResults.innerHTML = '<div class="search-no-results">Aradığınız kriterlere uygun modül veya etkinlik bulunamadı.</div>';
        } else {
            searchResults.innerHTML = resultsHtml;
        }
        
        searchResults.style.display = 'block';
    });

    // Dışarı tıklayınca kapat
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    function formatSearchDate(dateString) {
        if (!dateString) return '';
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const year = parts[0];
            const month = parts[1];
            const day = parts[2];
            return day + '.' + month + '.' + year;
        }
        return dateString;
    }
    
    // Modüle tıklanınca yönlendir veya modal aç
    window.handleModuleClick = function(title) {
        const mod = modulesList.find(m => m.title === title);
        if (!mod) return;
        if (mod.cardRef && mod.cardRef.onclick) {
            mod.cardRef.onclick(); // Eğer dashboard üzerindeki bir module-card ise onun modalını tetikle
        } else if (mod.url && mod.url !== '#') {
            window.location.href = mod.url;
        }
    };
});

// Etkinliğe tıklanınca çalışacak basit fonksiyon (Örn: alert veya popup)
window.openEventDetails = function(title, dateStr) {
    alert("Etkinlik Detayı:\\n\\nBaşlık: " + title + "\\nTarih: " + dateStr + "\\n\\n(İlerleyen aşamalarda burası özel bir modal/pencere olarak açılabilir.)");
};
