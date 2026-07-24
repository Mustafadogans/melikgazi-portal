const fs = require('fs');

let c = fs.readFileSync('dashboard_test.html', 'utf8');

const r = String.fromCharCode(65533); // U+FFFD

const replacements = {
    ['FAVOR' + r + 'LER']: 'FAVORİLER',
    ['T' + r + 'M MOD' + r + 'LLER']: 'TÜM MODÜLLER',
    ['Kullan' + r + 'c' + r + 'lar']: 'Kullanıcılar',
    ['Giri' + r + ' Slide']: 'Giriş Slide',
    ['Giri' + r + ' Yaz' + r + 's' + r]: 'Giriş Yazısı',
    [r + 'k' + r + r]: 'Çıkış',
    [r + ' SA' + r + 'LI' + r + 'I VE G' + r + 'VENL' + r]: 'İŞ SAĞLIĞI VE GÜVENLİĞİ',
    ['KENTSEL D' + r + 'N' + r + r + 'M  ' + r + ' TAK' + r + 'B' + r]: 'KENTSEL DÖNÜŞÜM İŞ TAKİBİ',
    ['AR' + r + r + 'V']: 'ARŞİV',
    ['M' + r + 'GAZ' + r + '.L' + r + ' - QR L' + r + 'NK']: 'MİGAZİ.Lİ - QR LİNK',
    ['MECL' + r + 'S']: 'MECLİS',
    ['SAH' + r + 'PLEN']: 'SAHİPLEN',
    ['E-' + r + 'MAR']: 'E-İMAR',
    ['BUG' + r + 'N' + r + 'N ETK' + r + 'NL' + r + 'KLER' + r]: 'BUGÜNÜN ETKİNLİKLERİ',
    ['L' + r + 'STELER']: 'LİSTELER',
    ['YEMEKHANE L' + r + 'STES' + r]: 'YEMEKHANE LİSTESİ',
    ['MERC' + r + 'MEK ' + r + 'ORBA']: 'MERCİMEK ÇORBA',
    ['PATLICAN G' + r + 'VE' + r]: 'PATLICAN GÜVEÇ',
    ['P' + r + 'R' + r + 'N' + r + ' P' + r + 'LAVI']: 'PİRİNÇ PİLAVI',
    ['G' + r + 'n Detaylar' + r]: 'Gün Detayları',
    ['Daha Az G' + r + 'r']: 'Daha Az Gör',
    ['T' + r + 'm' + r + 'n' + r + ' G' + r + 'r']: 'Tümünü Gör',
    ['A' + r + r + 'k K' + r + 'rm' + r + 'z' + r]: 'Açık Kırmızı',
    ['A' + r + r + 'k Sar' + r]: 'Açık Sarı',
    ['A' + r + r + 'k Ye' + r + 'il']: 'Açık Yeşil',
    ['A' + r + r + 'k Mor']: 'Açık Mor',
    ['A' + r + r + 'k Turuncu']: 'Açık Turuncu',
    [r + r + 'zel S' + r + 'ra']: 'Özel Sıra',
    [r + r + 'neme G' + r + 're']: 'Öneme Göre',
    ['Saate G' + r + 're']: 'Saate Göre',
    ['T' + r + 'm G' + r + 'n']: 'Tüm Gün',
    ['i' + r + 'in etkinlik bulunmuyor']: 'için etkinlik bulunmuyor',
    ['Yetkili Etkinli' + r + 'i']: 'Yetkili Etkinliği',
    ['Bu tarihe ait plan bulunamad' + r]: 'Bu tarihe ait plan bulunamadı',
    ['plan' + r + ' silmek istiyor musunuz']: 'planı silmek istiyor musunuz',
    ['Mod' + r + 'ller']: 'Modüller',
    ['kY']: 'Çıkış',
    ['KENTSEL D' + r + 'N' + r + r + 'M']: 'KENTSEL DÖNÜŞÜM',
    [r + ' TAK' + r + 'B' + r]: 'İŞ TAKİBİ',
    [r + 'yi Ki Do' + r + 'dun!']: 'İyi Ki Doğdun!',
    ['Yeni ya' + r + 'n' + r + 'n sana sa' + r + 'l' + r + 'k, mutluluk ve ba' + r + 'ar' + r + ' getirmesini dileriz.']: 'Yeni yaşının sana sağlık, mutluluk ve başarı getirmesini dileriz.',
    ['Seninle ' + r + 'al' + r + 'maktan gurur duyuyoruz! ??']: 'Seninle çalışmaktan gurur duyuyoruz! 🎉',
    ['Te' + r + 'ekk' + r + 'r Ederim']: 'Teşekkür Ederim',
    ['Bug' + r + 'n' + r + ' taray' + r + 'c' + r + ' haf' + r + 'zas' + r + 'na kaydet (kullan' + r + 'c' + r + ' F5 yaparsa tekrar ' + r + 'kmas' + r + 'n)']: 'Bugünü tarayıcı hafızasına kaydet (kullanıcı F5 yaparsa tekrar çıkmasın)',
    ['DO' + r + 'UM G' + r + 'N' + r + ' MANTI' + r + 'I']: 'DOĞUM GÜNÜ MANTIĞI',
    ['Canl' + r + ' projede veritaban' + r + 'ndan o g' + r + 'n do' + r + 'an ki' + r + 'ilerin bilgisi ' + r + 'ekilip bu de' + r + 'er \\\'true\\\' yap' + r + 'lacakt' + r + 'r.']: 'Canlı projede veritabanından o gün doğan kişilerin bilgisi çekilip bu değer \\\'true\\\' yapılacaktır.',
    ['Sayfa y' + r + 'klendikten k' + r + 'sa bir s' + r + 're sonra s' + r + 'rprizi patlat']: 'Sayfa yüklendikten kısa bir süre sonra sürprizi patlat',
    ['Do' + r + 'um G' + r + 'n' + r + ' ' + r + 'zel Pop-up\\\'tr' + r + 'n' + r + ' G' + r + 'ster']: 'Doğum Günü Özel Pop-up\\\'ını Göster',
    ['EBYS ' + r + r + r + 'LER' + r]: 'EBYS İÇİŞLERİ',
    ['margin-bottom: -10px;">??</div>']: 'margin-bottom: -10px;">🎂</div>'
};

for (const [key, value] of Object.entries(replacements)) {
    c = c.split(key).join(value);
}

fs.writeFileSync('dashboard.html', c, 'utf8');
