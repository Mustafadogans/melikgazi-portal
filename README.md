# Melikgazi Belediyesi - Kurumsal Portal & Yönetim Paneli

Melikgazi Belediyesi personeli ve idari birimleri için geliştirilmiş, modern, hızlı ve duyarlı (responsive) kurumsal intranet portalı ve yönetim paneli arayüzü.

🌐 **Canlı Önizleme / Demo:** [mustafadogans.github.io/melikgazi-portal](https://mustafadogans.github.io/melikgazi-portal/)

---

## 🌟 Proje Özellikleri

- **Modern & Şık Arayüz**: Glassmorphism ve modern kart tasarımları ile zenginleştirilmiş kullanıcı dostu deneyim.
- **Duyarlı (Responsive) Tasarım**: Masaüstü, tablet ve mobil cihazlar ile tam uyumlu görünüm.
- **Hızlı Erişim Modülleri**: Sık kullanılan belediye uygulamalarına ve hizmetlerine tek tıkla doğrudan erişim.
- **Kurumsal Ajanda & Takvim**: FullCalendar entegrasyonu ile resmi tatiller, toplantılar ve belediye etkinliklerinin takibi.
- **Gelişmiş Arama (Search Engine)**: Modüller, duyurular ve personel rehberi arasında anında dinamik arama.
- **Yemek Listesi Paneli**: Günlük yemek menüsü, kalori bilgileri ve haftalık planlama görünümü.
- **Dinamik Bildirimler & Sürprizler**: Personel için doğum günü kutlama animasyonları, kurumsal duyurular ve anlık bildirim sistemi.
- **Kapsamlı Yönetim (Admin) Sayfaları**:
  - `admin_moduller.html`: Menü ve hızlı erişim modüllerinin yönetimi.
  - `admin_yemek.html`: Günlük ve haftalık yemek listesi düzenleme.
  - `admin_ajanda.html`: Kurumsal etkinlik ve toplantı takvimi yönetimi.
  - `admin_bildirimler.html`: Sistem duyuruları ve personel bildirim paneli.
  - `admin_kullanicilar.html` & `admin_gruplar.html`: Personel yetkilendirme ve rol yönetimi.
  - `admin_slide.html` & `admin_giris_yazisi.html`: Karşılama ve slider duyuru yönetimi.

---

## 🛠️ Kullanılan Teknolojiler

- **İşaretleme & Stil**: HTML5, CSS3, SCSS/CSS Özel Değişkenleri
- **Framework & Kütüphaneler**:
  - [Bootstrap](https://getbootstrap.com/) (Grid ve temel bileşenler)
  - [Font Awesome](https://fontawesome.com/) & Google Material Icons
  - [FullCalendar](https://fullcalendar.io/) (Takvim ve etkinlik motoru)
  - [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) (İnteraktif kutlama animasyonu)
- **Programlama Dili**: JavaScript (ES6+ Vanilla JS, Modüler Mimari)
- **Yazı Tipleri**: Inter, Roboto, Lato, Exo 2 (Google Fonts)

---

## 📂 Proje Dizin Yapısı

```text
Portal/
├── index.html              # Kurumsal giriş (Login) ekranı
├── dashboard.html          # Ana portal ve intranet panosu
├── admin_*.html            # İdari ve yönetim modül sayfaları
├── assets/
│   ├── css/
│   │   ├── dashboard_glass.css # Glassmorphism & modern tema stilleri
│   │   └── style.css           # Genel stil kuralları
│   └── js/
│       ├── dashboard_core.js   # Ana dashboard işlevleri ve render motoru
│       ├── search.js           # Dinamik arama algoritması
│       ├── auth.js             # Giriş ve kimlik kontrol mekanizması
│       └── components.js       # Ortak UI bileşenleri
└── images/                 # İkonlar, modül görselleri ve kurumsal belgeler
```

---

## 🚀 Kurulum ve Çalıştırma

Herhangi bir özel paket kurulumu veya sunucu yapılandırması gerektirmez. Statik web sunucusu veya doğrudan tarayıcı üzerinden açılabilir:

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/Mustafadogans/melikgazi-portal.git
   ```
2. Proje dizinine gidin:
   ```bash
   cd melikgazi-portal
   ```
3. `index.html` veya `dashboard.html` dosyasını favori tarayıcınızda çift tıklayarak açın.

---

## 👨‍💻 Geliştirici

**Mustafa Doğan**  
- GitHub: [@Mustafadogans](https://github.com/Mustafadogans)  
- E-posta: semustafadogan@gmail.com
