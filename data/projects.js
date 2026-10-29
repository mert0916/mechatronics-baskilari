/*
 * Tüm proje verisi bu dosyada. Yeni proje eklemek için PROJECTS dizisine
 * aynı yapıda bir nesne ekleyin; sayfa kendini bu diziden oluşturur.
 *
 * Alanlar:
 *  id          "01".."12"  -> bölüm numarası ve görsel dosya öneki
 *  category    CATEGORIES anahtarlarından biri
 *  difficulty  1-5 (tahmini)
 *  images      [{ file, ext, w, h, alt }]  -> images/{file}.{ext} + images/{file}.webp
 *  bom         { groups: [{ title, items: [[parça, adet, not]] }], missing?, source? }
 *  steps       [{ type, title, text, sub? }]  type: print | mech | elec | soft | test
 *  card        { time, filament, cost? }  -> genel bakış kartı ve karşılaştırma tablosu
 *  videos      [{ id, label, tag?, noEmbed? }]  -> YouTube kimliği; noEmbed: gömülemeyen video, bağlantı olarak gösterilir
 */

window.CATEGORIES = {
  air:    { label: 'Hava',             short: 'Hava',      icon: 'i-air' },
  arm:    { label: 'Robot Kol',        short: 'Robot Kol', icon: 'i-arm' },
  ground: { label: 'Kara',             short: 'Kara',      icon: 'i-ground' },
  walk:   { label: 'Yürüyen & Servis', short: 'Yürüyen',   icon: 'i-walk' }
};

window.PROJECTS = [
  /* ------------------------------------------------------------------ 01 */
  {
    id: '01',
    name: 'Quadcopter (STM32)',
    fullName: 'Quadcopter — 3D Printable, STM32 MCU',
    designer: 'IMLABS / I-M Robotics Lab',
    designerUrl: 'https://github.com/I-M-Robotics-Lab',
    category: 'air',
    difficulty: 4,
    license: 'GPL-3.0 (GitHub) · CC BY-NC (MakerWorld)',
    controller: 'STM32F411 Blackpill (INAV)',
    card: { time: '~6.6 saat', filament: 'CF filament + ABS' },
    images: [
      { file: '01-quadcopter-1', ext: 'png', w: 756, h: 607, alt: 'Karbon fiber gövdeli quadcopter, beton zemin üzerinde önden görünüş' },
      { file: '01-quadcopter-2', ext: 'jpg', w: 1600, h: 1200, alt: 'Quadcopter iniş takımlarıyla zemin üzerinde, yandan görünüş' },
      { file: '01-quadcopter-3', ext: 'jpg', w: 1600, h: 1200, alt: 'Quadcopter üstten görünüş: karbon fiber kollar ve ortadaki elektronik' },
      { file: '01-quadcopter-4', ext: 'jpg', w: 1600, h: 696, alt: 'Quadcopter CAD modelinin izometrik görünüşü' }
    ],
    summary: [
      'STM32F411CEU "Blackpill" kartını uçuş kontrolcüsü olarak kullanan, düşük maliyetli bir quadcopter. INAV 6.0 uçuş yazılımıyla çalışır; ataletsel ölçüm için MPU6500, irtifa için BMP280 kullanır, isteğe bağlı GPS ve manyetometre de desteklenir.',
      'Gövde çoğunlukla karbon fiber plakalardan kesilir. İstenirse karbon fiber katkılı filamentle (PET-CF, PAHT-CF, PA6-CF, PPS-CF) basılabilir; kritik olmayan parçalar ABS\'dir.'
    ],
    highlights: ['STM32F411 Blackpill', 'INAV 6.0', 'MPU6500 IMU', 'BMP280 barometre', '3S LiPo', 'GPS opsiyonel'],
    print: [
      ['Katman yüksekliği', '0.2 mm'], ['Duvar', '2'], ['Dolgu', '%15'], ['Süre', '~6.6 saat'],
      ['Nozul', '0.4 veya 0.6 mm'], ['Filament', 'CF katkılı (PET-CF, PAHT-CF, PA6-CF, PPS-CF) + ABS'],
      ['Not', 'Yüksek dayanımlı profil önerilir']
    ],
    bom: {
      groups: [
        { title: 'Elektronik', items: [
          ['RS2205 BLDC motor', '4', ''],
          ['BLHeli_S 20A ESC', '4', 'ESC: motor hız kontrolcüsü'],
          ['5030R pervane', '2', ''],
          ['STM32F411CEU6 Blackpill', '1', 'Uçuş kontrolcüsü'],
          ['MPU6500 / MPU9250 modül', '1', 'IMU'],
          ['BMP280 modül', '1', 'Barometre'],
          ['330 µF 50 V kondansatör', '1', 'VBAT–GND arası'],
          ['FS-iA6B alıcı', '1', ''],
          ['FlySky verici', '1', ''],
          ['Ovonic 1500 mAh 120C 3S LiPo', '1', 'LiPo: lityum polimer batarya'],
          ['XT60 konnektör', '1', '']
        ] },
        { title: 'Mekanik & Donanım', items: [
          ['M3 somun', '19', ''],
          ['M3×12 yuvarlak baş vida', '2', ''],
          ['M3×20 yuvarlak baş vida', '7', ''],
          ['M3×20 imbus vida', '6', ''],
          ['M3×30 imbus vida', '16', ''],
          ['M3×35 yuvarlak baş vida', '3', ''],
          ['M3×40 yuvarlak baş vida', '1', ''],
          ['Naylon ara parça 3-5-11.2', '8', ''],
          ['Naylon ara parça 3-5-20', '16', ''],
          ['Naylon ara parça 3-5-30', '4', ''],
          ['Naylon ara parça 3-5-5', '2', '']
        ] }
      ]
    },
    steps: [
      { type: 'print', title: 'Gövde', text: 'Karbon fiber plakaları kes (CAD dosyaları repodaki 3.Models/ klasöründe) ya da CF filamentle bas; ABS parçaları bas.' },
      { type: 'elec', title: 'Elektronik', text: 'KiCad ile çizilmiş PCB\'yi (baskı devre kartı) repodaki Gerber (üretim) dosyalarıyla ürettir; Blackpill, IMU ve barometreyi pin şemasına göre bağla.' },
      { type: 'soft', title: 'Yazılım', text: 'INAV 6.0\'ı özel hedefle derle (25 MHz kristal için küçük bir kod yaması gerekir) ve DFU modunda INAV Configurator ile yükle.' },
      { type: 'test', title: 'Ayar', text: 'Standart INAV kalibrasyonu, alıcı eşleştirme ve motor yönü testi.' },
      { type: 'test', title: 'İlk uçuş', text: 'Açık ve güvenli bir alanda ilk uçuş testini yap.' }
    ],
    warnings: [
      'INAV 7 ve üstü, USB sorunu nedeniyle desteklenmiyor.',
      'Yükleme sırasında USB kablosunun kırmızı (güç) telini kesip kartı 3S bataryadan besle.',
      'Voltaj sıçramalarına karşı VBAT–GND arasına 330 µF kondansatör koy.',
      '"MPU9250" diye satılan modüllerin çoğu aslında MPU6500 içeriyor.'
    ],
    videos: [],
    links: [
      { label: 'MakerWorld sayfası', url: 'https://makerworld.com/en/models/1695470-quadcopter-3d-printable-stm32-mcu' },
      { label: 'GitHub deposu (kod, PCB, CAD)', url: 'https://github.com/I-M-Robotics-Lab/STM32-Quadcopter' }
    ]
  },

  /* ------------------------------------------------------------------ 02 */
  {
    id: '02',
    name: '200 km/s Drone',
    fullName: '200 km/h 3D Printed Drone (200 CAD altı)',
    designer: 'Hydrance',
    designerUrl: 'https://youtube.com/@HydranceYT',
    category: 'air',
    difficulty: 3,
    license: 'Standard Digital File License',
    controller: 'F405 uçuş kontrolcüsü (Betaflight)',
    card: { time: '8.8 saat', filament: '232 g PETG + TPU', cost: '~167 USD' },
    images: [
      { file: '02-drone-1', ext: 'png', w: 655, h: 437, alt: 'Beyaz PETG kollu FPV yarış dronu çim üzerinde alçak uçuşta' },
      { file: '02-drone-2', ext: 'jpg', w: 1200, h: 623, alt: 'Drone ve kumandası koyu bir mat üzerinde, üstten görünüş' },
      { file: '02-drone-3', ext: 'jpg', w: 676, h: 1200, alt: 'Drone gövdesi açık: F405 stack ve kablolama görünüyor' }
    ],
    summary: [
      'Sıfırdan tasarlanmış, tamamen PETG\'den basılan yüksek hızlı bir FPV (birinci şahıs görüşlü) yarış dronu. Vida dışında ek donanım gerektirmez; kollar merkez gövdeye bağlantı elemanı olmadan geçer.',
      'Modüler yapısı sayesinde kırılan bir parça tek başına basılıp değiştirilebilir.'
    ],
    highlights: ['Teorik ~200 km/s', '~600 g (kamerasız)', '5 inç pervane', '6S LiPo', 'Bambu Lab A1 ile basıldı'],
    print: [
      ['Nozul', '0.6 mm'], ['Katman yüksekliği', '0.3 mm'], ['Duvar', '3'], ['Dolgu', '%25'],
      ['Süre', '8.8 saat'], ['Plaka', '3'], ['Filament', 'PETG 95 g + PETG 118 g + TPU 19 g']
    ],
    bom: {
      groups: [
        { title: 'Elektronik', items: [
          ['2207 1750KV motor', '4', ''],
          ['F405 uçuş kontrolcüsü + 60A ESC stack', '1', ''],
          ['5 inç pervane seti', '1 set', ''],
          ['6S 1200 mAh LiPo', '1', ''],
          ['Alıcı', '1', ''],
          ['Verici (kumanda)', '1', ''],
          ['GPS modülü', '1', 'İsteğe bağlı'],
          ['Batarya kayışı', '1', 'İsteğe bağlı']
        ] },
        { title: 'Mekanik & Donanım', items: [['Vidalar', '—', 'Tek ek donanım']] },
        { title: 'Baskı Malzemesi', items: [['PETG', '213 g', 'İki plaka: 95 g + 118 g'], ['TPU', '19 g', 'Darbe emici alt destek']] }
      ]
    },
    steps: [
      { type: 'print', title: 'Baskı', text: 'Parçaları PETG ile bas; darbe emmesi gereken alt destek parçasını TPU ile bas.' },
      { type: 'mech', title: 'Gövde montajı', text: 'Kolları merkez gövdeye geçir ve vidalarla sabitle.' },
      { type: 'elec', title: 'Elektronik', text: 'Motorları kollara, F405 stack\'i gövdeye monte et ve lehimle.' },
      { type: 'soft', title: 'Yazılım', text: 'Alıcıyı bağla, Betaflight ile ayarla.' },
      { type: 'test', title: 'Uçuş testi', text: 'Pervaneleri tak ve uçuş testi yap.' }
    ],
    warnings: [
      'PCBWay gibi bir servisten parça sipariş edilecekse buradaki dosyalar değil, tasarımcının GitHub\'ındaki "PCBWay STEP Files" klasörü kullanılmalı; MakerWorld\'deki toleranslar FDM baskı içindir.',
      'Yerel drone mevzuatına uymak kullanıcının sorumluluğundadır.'
    ],
    videos: [{ id: 'bjDzjxU97EM', label: 'Proje videosu' }],
    links: [
      { label: 'MakerWorld sayfası', url: 'https://makerworld.com/en/models/2573757-200-km-h-3d-printed-drone-for-under-200-cad' },
      { label: 'YouTube kanalı', url: 'https://youtube.com/@HydranceYT' }
    ]
  },

  /* ------------------------------------------------------------------ 03 */
  {
    id: '03',
    name: 'PAROL6 Robot Kol',
    fullName: 'PAROL6 Masaüstü Robot Kol',
    designer: 'Source Robotics',
    designerUrl: 'https://www.youtube.com/@source-robotics',
    category: 'arm',
    difficulty: 5,
    license: 'CC BY 4.0',
    controller: 'Kaynak sayfada',
    card: { time: '~27.6 saat', filament: '~1036 g PLA' },
    images: [
      { file: '03-parol6-1', ext: 'png', w: 607, h: 641, alt: 'Beyaz PAROL6 robot kol, mavi pnömatik hortumlu tutucuyla' },
      { file: '03-parol6-2', ext: 'jpg', w: 1200, h: 1065, alt: 'PAROL6 robot kol dik konumda, step motorlar görünüyor' },
      { file: '03-parol6-3', ext: 'jpg', w: 1200, h: 800, alt: 'PAROL6 robot kolun geniş açı görünüşü' }
    ],
    summary: [
      'Eğitim, küçük otomasyon ve AR-GE\'den üretime geçiş ihtiyaçları düşünülerek tasarlanmış 6 eksenli masaüstü robot kol; tasarımcının daha önceki iki başarılı açık kaynak kolunun devamı.',
      'Hassas planet dişli kutuları ve kayışlar kullanır; kapalı döngü sürücü eklemeye uygun modüler bir yapısı var. Endüstriyel cobot arayüzlerinden esinlenen bir GUI\'si ve fiziksel robot olmadan program denemeye yarayan bir simülatörü bulunur.'
    ],
    highlights: ['6 eksen', '60–100 Hz kontrol döngüsü', 'İzole I/O', 'CAN bus', 'Esnek (compliant) tutucu', 'Simülatör'],
    print: [['Süre', '~27.6 saat'], ['Plaka', '4'], ['Filament', 'PLA ~1036 g']],
    bom: {
      missing: true,
      source: { label: 'GitHub dokümantasyonu', url: 'https://github.com/PCrnjak/PAROL6-Desktop-robot-arm' },
      groups: []
    },
    steps: [
      { type: 'print', title: 'Dosyalar', text: 'GitHub\'dan güncel STL dosyalarını ve montaj kılavuzunu indir.' },
      { type: 'print', title: 'Baskı', text: 'Parçaları bas (4 plaka, ~1 kg PLA).' },
      { type: 'mech', title: 'Aktarma', text: 'Planet dişli kutularını ve kayış aktarımlarını monte et.' },
      { type: 'elec', title: 'Elektronik', text: 'Motorları, sürücüleri ve kontrol kartını bağla.' },
      { type: 'soft', title: 'Yazılım ve kalibrasyon', text: 'GUI\'yi kur, önce simülatörde test et, sonra eksen eksen kalibre et.' }
    ],
    warnings: [],
    videos: [],
    channel: { label: 'Source Robotics YouTube kanalı', url: 'https://www.youtube.com/@source-robotics', note: 'Ayrı bir montaj videosu belirtilmemiş; tasarımcının kanalında projeye ait videolar bulunuyor.' },
    links: [
      { label: 'MakerWorld sayfası', url: 'https://makerworld.com/en/models/419189-parol6-3d-printed-desktop-robotic-arm' },
      { label: 'GitHub (güncel montaj kılavuzu ve BOM)', url: 'https://github.com/PCrnjak/PAROL6-Desktop-robot-arm' },
      { label: 'YouTube kanalı', url: 'https://www.youtube.com/@source-robotics' }
    ]
  },

  /* ------------------------------------------------------------------ 04 */
  {
    id: '04',
    name: 'L-ONE Robot Kol',
    fullName: 'L-ONE Masaüstü Robot Kol 2.0 (CyberBrick)',
    designer: 'Leng入瑶_CN',
    designerUrl: 'https://makerworld.com/en/models/1979457-l-one-desktop-robotic-arm-2-0-easy-to-install-cybe',
    category: 'arm',
    difficulty: 1,
    license: 'Standard Digital File License',
    controller: 'CyberBrick',
    card: { time: '~7.4 saat (B seçeneği)', filament: null },
    images: [
      { file: '04-l-one-1', ext: 'png', w: 661, h: 644, alt: 'Gri-turuncu L-ONE masaüstü robot kol, bir el parmağıyla dokunurken' },
      { file: '04-l-one-2', ext: 'jpg', w: 1200, h: 800, alt: 'L-ONE robot kol ve CyberBrick kumandası ahşap masada' },
      { file: '04-l-one-3', ext: 'jpg', w: 1200, h: 800, alt: 'L-ONE baskı parçaları düz bir zeminde dizili' }
    ],
    summary: [
      'Bambu Lab\'in CyberBrick elektronik modülleriyle çalışan, küçük yükler taşıyabilen oyuncak/sergileme amaçlı bir masaüstü robot kol.',
      'Montajda vida ya da yapıştırıcı gerekmez; CyberBrick bileşenleri elinizdeyse bas ve oyna. Profesyonel kullanım için tasarlanmamıştır.'
    ],
    highlights: ['Vidasız, yapıştırıcısız', '45–60 dk montaj', 'Uzaktan kumandalı', 'Tutucu (gripper) kontrolü'],
    print: [
      ['Seçenek A', 'Tüm kol tek plakada, 0.12 mm katman (uzun sürer)'],
      ['Seçenek B · Parça 1', '0.2 mm katman, 5.8 saat'],
      ['Seçenek B · Parça 2', '0.12 mm katman, 1.6 saat'],
      ['Sabit taban (isteğe bağlı)', '1.8 saat']
    ],
    bom: {
      note: 'Elektronik için üç yoldan biri seçilir.',
      groups: [
        { title: 'Elektronik — Yol 1', items: [['L-ONE kiti (ZL023)', '1', 'Hazır kit']] },
        { title: 'Elektronik — Yol 2', items: [['CyberBrick iki araç–iki kumanda seti (ZK003)', '1', '']] },
        { title: 'Elektronik — Yol 3', items: [
          ['CyberBrick tek araç–tek kumanda seti (ZK004)', '1', ''],
          ['9 g 360° kavramalı servo PG002', '1', 'Ek'],
          ['800 mAh lityum batarya', '1', 'Kumanda için']
        ] },
        { title: 'Mekanik & Donanım', items: [['Yok', '—', 'Vida ve yapıştırıcı gerekmez']] }
      ]
    },
    steps: [
      { type: 'print', title: 'Baskı', text: 'Kol parçalarını bas (tek plaka veya iki parça seçeneği).' },
      { type: 'mech', title: 'Geçme montaj', text: 'MakerWorld\'deki montaj PDF\'ini takip ederek parçaları geçme yöntemiyle birleştir.' },
      { type: 'elec', title: 'Modüller', text: 'CyberBrick modüllerini yerlerine yerleştir.' },
      { type: 'soft', title: 'Yapılandırma', text: 'CyberBrick uygulamasından hazır kumanda yapılandırmasını yükle.' },
      { type: 'test', title: 'Test', text: 'Kumandayla dene: sol çubuk üst kol, sağ çubuk alt kol, sağ omuz çubuğu taban dönüşü, sol omuz düğmesi tutucu.' }
    ],
    warnings: [
      'Motor zorlanır veya durursa kolu elle zorlama.',
      'Taban dönerken takılırsa üst kapağa bastırıp kapat.'
    ],
    videos: [],
    links: [
      { label: 'MakerWorld sayfası', url: 'https://makerworld.com/en/models/1979457-l-one-desktop-robotic-arm-2-0-easy-to-install-cybe' },
      { label: 'Hazır kit (Bambu Lab Store)', url: 'https://store.bambulab.com/products/l-one-desktop-robotic-arm-cyberbrick-rc' }
    ]
  },

  /* ------------------------------------------------------------------ 05 */
  {
    id: '05',
    name: 'WE-R2.4 Robot Kol',
    fullName: 'WE-R2.4 Altı Eksenli Robot Kol',
    designer: 'LoboCNC',
    designerUrl: 'https://makerworld.com/en/models/95279-we-r2-4-six-axis-robot-arm',
    category: 'arm',
    difficulty: 5,
    license: 'CC BY-NC-SA 4.0',
    controller: 'Pololu Tic T500 ×7',
    card: { time: '20 saat', filament: '466 g PETG' },
    images: [
      { file: '05-we-r24-1', ext: 'png', w: 532, h: 642, alt: 'Gri-mavi WE-R2.4 altı eksenli robot kol atölye masasında' },
      { file: '05-we-r24-2', ext: 'jpg', w: 480, h: 400, alt: 'WE-R2.4 kol ile UR3 endüstriyel robotun yan yana karşılaştırması' },
      { file: '05-we-r24-3', ext: 'jpg', w: 1024, h: 768, alt: 'WE-R2.4 bilek aktüatörlerinin yakın çekimi' }
    ],
    summary: [
      'UR3 endüstriyel robotunun kabaca %80 ölçekli bir yorumu. Her eklemde bir motor + redüktör aktüatörü bulunur; altı aktüatör üst üste dizilerek 6 eksenli kol oluşur.',
      'UR3\'teki pahalı harmonik redüktörler yerine step motor + bileşik planet dişli aktüatörler kullanılır: ilk iki taban ekleminde 2 büyük, dirsekte 1 orta, bilekte 3 küçük aktüatör.'
    ],
    highlights: ['6 eksen', 'UR3 tarzı, ~%80 ölçek', 'Step motor + bileşik planet dişli', 'Uyumlu (conformal) tutucu'],
    print: [
      ['Katman yüksekliği', '0.2 mm'], ['Duvar', '3'], ['Dolgu', '%10'],
      ['Süre', '20 saat'], ['Plaka', '9'], ['Filament', 'PETG 466 g']
    ],
    bom: {
      groups: [
        { title: 'Elektronik', items: [
          ['Pololu Tic T500 step motor kontrolcüsü', '7', 'Koordineli hareket için tasarımcının özel firmware\'i ile'],
          ['Step motorlar', '—', 'Ayrıntılar aktüatör sayfasında']
        ] },
        { title: 'Mekanik & Donanım', items: [
          ['Büyük aktüatör', '2', 'Taban eklemleri'],
          ['Orta aktüatör', '1', 'Dirsek'],
          ['Küçük aktüatör', '3', 'Bilek'],
          ['Uyumlu (conformal) tutucu', '1', 'Ayrıntılar bağlı Printables sayfalarında']
        ] }
      ]
    },
    steps: [
      { type: 'print', title: 'Aktüatörler', text: 'Aktüatörleri Printables sayfasındaki tasarımla bas ve monte et.' },
      { type: 'print', title: 'Gövde parçaları', text: 'Kol gövde parçalarını bas.' },
      { type: 'mech', title: 'Kol montajı', text: 'Aktüatörleri taban → dirsek → bilek sırasıyla üst üste bağla.' },
      { type: 'elec', title: 'Kontrolcüler', text: 'Tic T500 kontrolcüleri bağla ve özel firmware\'i yükle.' },
      { type: 'test', title: 'Test', text: 'Windows test aracıyla eksenleri tek tek dene, ardından koordineli hareketi çalıştır.' }
    ],
    warnings: [
      'Tasarımcı bunun kolay bir hafta sonu projesi olmadığını belirtiyor; başlamadan önce tüm materyali okumanı ve soru sormanı öneriyor.',
      'Daha az boşluklu, daha yüksek torklu bir küçük bilek aktüatörü sürümü de yayınlandı (bağlantılarda).'
    ],
    videos: [
      { id: 'tEbJV32GyYU', label: 'jlauer\'ın yapımı' },
      { id: 'RdmdFIhCo4M', label: 'jlauer\'ın özel kontrol kartı geliştirmesi' }
    ],
    links: [
      { label: 'MakerWorld sayfası', url: 'https://makerworld.com/en/models/95279-we-r2-4-six-axis-robot-arm' },
      { label: 'Aktüatörler (Printables)', url: 'https://www.printables.com/model/132262-robot-actuators' },
      { label: 'Tutucu (Printables)', url: 'https://www.printables.com/model/132264-conformal-robot-gripper' },
      { label: 'Kontrolcü firmware ve araçlar', url: 'https://drive.google.com/open?id=1rKRuWC4jAOekrds_WGUC7DkwlVsk2zdb' },
      { label: 'Yeni küçük bilek aktüatörü', url: 'https://www.thingiverse.com/thing:3566678' },
      { label: 'Topluluk forumu', url: 'https://forum.makerforums.info/c/ChiliPeppr/robot-arm' }
    ]
  },

  /* ------------------------------------------------------------------ 06 */
  {
    id: '06',
    name: 'Servo + Arduino Robot Kol',
    fullName: 'Servo ve Arduino ile Robot Kol',
    designer: 'Emre Kalem',
    designerUrl: 'https://makerworld.com/en/models/1134925-robotic-arm-with-servo-arduino',
    category: 'arm',
    difficulty: 2,
    license: 'Standard Digital File License',
    controller: 'Arduino Uno / Mega',
    card: { time: '14.3 saat', filament: null },
    images: [
      { file: '06-servo-kol-1', ext: 'png', w: 610, h: 612, alt: 'Siyah, servo motorlu 6 eksenli robot kol ahşap masada' },
      { file: '06-servo-kol-2', ext: 'jpg', w: 1200, h: 900, alt: 'Servo robot kolun arkadan görünüşü ve kablolaması' }
    ],
    summary: [
      'Kendi çalışan robot kolunu sıfırdan yapıp programlamak isteyen öğrenciler ve hobiciler için 6 eksenli bir kol.',
      'FDM baskıya göre optimize edilmiştir, çok az destek ister; standart donanım ve elektronikle birleştirilir. Kinematik, elektronik ve yazılım entegrasyonunu öğrenmek için iyi bir platform.'
    ],
    highlights: ['6 eksen', 'Arduino', 'Standart servolar', 'A1 mini uyumlu profiller'],
    print: [
      ['Katman yüksekliği', '0.2 mm'], ['Duvar', '3'], ['Dolgu', '%20'],
      ['Süre', '14.3 saat'], ['Plaka', '4'], ['Not', 'A1 mini için ayrı profiller mevcut']
    ],
    bom: {
      groups: [
        { title: 'Elektronik', items: [
          ['Arduino Uno veya Mega', '1', ''],
          ['Mini breadboard', '1', ''],
          ['MG995 / MG996R servo (180°)', '4', ''],
          ['MG90S servo (180°)', '3', ''],
          ['KCD1 anahtar', '1', ''],
          ['5 V 10 A güç kaynağı', '1', 'Servolar ayrı beslenir'],
          ['Jumper kablolar', '—', '']
        ] },
        { title: 'Mekanik & Donanım', items: [
          ['608 rulman', '1', ''],
          ['6203 rulman', '2', ''],
          ['Çeşitli M3 cıvatalar', '—', '']
        ] }
      ]
    },
    steps: [
      { type: 'print', title: 'Baskı', text: 'Parçaları bas.' },
      { type: 'mech', title: 'Mekanik montaj', text: 'Rulmanları ve servoları taban → omuz → dirsek → bilek sırasıyla yerleştir.' },
      { type: 'elec', title: 'Devre', text: 'Devreyi şemaya göre kur; servoları ayrı 5 V 10 A kaynaktan besle.' },
      { type: 'soft', title: 'Kod', text: 'Arduino kodunu yükle.' },
      { type: 'test', title: 'Kalibrasyon', text: 'Servoları test et ve kalibre et.' }
    ],
    warnings: [],
    videos: [{ id: 'CHV36hu9z3E', label: 'Montaj videosu (kod ve şema linkleri açıklamada)' }],
    links: [
      { label: 'MakerWorld sayfası', url: 'https://makerworld.com/en/models/1134925-robotic-arm-with-servo-arduino' },
      { label: 'Kod ve devre (MediaFire)', url: 'https://www.mediafire.com/file/ic9gc8bbwh0eqb9/Robot+Arm+Circuit+&+Software.zip/file' },
      { label: 'Devre şeması (Cirkit Designer)', url: 'https://app.cirkitdesigner.com/project/814aa238-29b4-4fae-ad3c-c1deed71ce4b' }
    ]
  },

  /* ------------------------------------------------------------------ 07 */
  {
    id: '07',
    name: 'Robot Süpürge',
    fullName: 'Robot Süpürge × CyberBrick',
    designer: 'FADY',
    designerUrl: 'https://makerworld.com/en/models/2245221-robot-vacuum-cleaner-x-cyberbrick',
    category: 'walk',
    difficulty: 2,
    license: 'Standard Digital File License',
    badges: ['Yarışma kazananı · MakerWorld "Master Challenge: Portable Vacuum Cleaner"'],
    controller: 'CyberBrick',
    card: { time: '43.1 saat', filament: null },
    images: [
      { file: '07-supurge-1', ext: 'png', w: 710, h: 637, alt: 'Siyah, yuvarlak 3D baskı robot süpürge parke zeminde' },
      { file: '07-supurge-2', ext: 'jpg', w: 1080, h: 827, alt: 'Robot süpürgenin üst kontrolleri: emiş, açma düğmesi, güç seviyeleri ve gösterge ışıkları' },
      { file: '07-supurge-3', ext: 'jpg', w: 1080, h: 827, alt: 'Robot süpürgenin çıkarılabilir 2\'si 1 arada su ve toz haznesi' }
    ],
    summary: [
      'Uzaktan kumandalı, tamamen 3D baskı bir robot süpürge. CyberBrick elektronik kitini bir süpürge kiti güç devresiyle birleştirir.',
      'Lehim gerektirmez: bas, tak, çalıştır. Tasarımcı bunu, 3D baskı bir süpürgenin ticari ürünlerle rekabet edebileceğini gösteren bir kavram kanıtı olarak sunuyor.'
    ],
    highlights: ['16 kPa\'ya kadar emiş', '350 mL toz / 130 mL su', 'Islak paspas', 'LED aydınlatma', '~250 mm çap', '6 mm\'ye kadar parçacık', 'Lehimsiz'],
    print: [
      ['Ana profil', '43.1 saat, 6 plaka'],
      ['A1 mini profili', '44.2 saat, 16 plaka (yapıştırma gerekir)'],
      ['Tabla', '256 mm tablaya sığar (A1, X1, P1)']
    ],
    bom: {
      missing: true,
      partial: true,
      source: { label: 'MakerWorld sayfası', url: 'https://makerworld.com/en/models/2245221-robot-vacuum-cleaner-x-cyberbrick' },
      groups: [
        { title: 'Bilinen parçalar', items: [
          ['CyberBrick kiti', '1', 'Ana elektronik'],
          ['Süpürge kiti', '1', 'Fan ve güç devresi'],
          ['Paspas ped', '1', '5 mm kalınlık, 13–14 cm dış çap, 4–5 cm iç çap'],
          ['22 mm pirinç pim', '—', 'Küçük sarhoş tekerlek için']
        ] }
      ]
    },
    steps: [
      { type: 'print', title: 'Baskı', text: 'Parçaları bas (ana profil 6 plaka).' },
      { type: 'mech', title: 'Mekanik montaj', text: 'MakerWorld\'deki montaj PDF\'i ve yapım videosuyla mekanik montajı yap.' },
      { type: 'elec', title: 'Elektronik', text: 'CyberBrick modüllerini ve süpürge kitini yerleştir (lehim yok).' },
      { type: 'soft', title: 'Yapılandırma', text: 'CyberBrick uygulamasından hazır kumanda yapılandırmasını yükle.' },
      { type: 'test', title: 'Kullanım', text: 'Açma anahtarı → kumanda eşleştirme (alttaki ışık yeşil) → fan gücü seçimi → sür.' }
    ],
    warnings: [
      'Islak modda uzun süre aynı yerde bekletme; su birikintisi oluşur.',
      'Hazneyi yıkamadan önce filtreyi çıkar.',
      'Uzun kullanımdan sonra bataryayı şarj et.'
    ],
    videos: [
      { id: 'yFgvRIho9qo', label: 'Tanıtım' },
      { id: 'h5NqDfyvoys', label: 'Malzemeler', noEmbed: true }, // YouTube gömmeye izin vermiyor; bağlantı olarak gösterilir
      { id: '6SEMKu4wG7Q', label: 'Yapım kılavuzu' }
    ],
    links: [
      { label: 'MakerWorld sayfası (güncel BOM ve montaj PDF\'i)', url: 'https://makerworld.com/en/models/2245221-robot-vacuum-cleaner-x-cyberbrick' }
    ]
  },

  /* ------------------------------------------------------------------ 08 */
  {
    id: '08',
    name: 'Hexapod Örümcek',
    fullName: 'Hexapod Örümcek Robot',
    designer: 'Emre Kalem',
    designerUrl: 'https://makerworld.com/en/models/1973965-hexapod-spider-robot-with-servo-arduino',
    category: 'walk',
    difficulty: 4,
    license: 'Standard Digital File License',
    controller: 'Arduino Mega + Uno (kumanda)',
    card: { time: '29.5 saat', filament: '1155 g PLA' },
    images: [
      { file: '08-hexapod-1', ext: 'png', w: 797, h: 625, alt: 'Siyah altı bacaklı hexapod örümcek robot ahşap masada' },
      { file: '08-hexapod-2', ext: 'jpg', w: 1200, h: 900, alt: 'Hexapod robot önden, bacakları üzerinde yükselmiş halde' }
    ],
    summary: [
      'Arduino Mega ile kontrol edilen 6 bacaklı yürüyen robot. Her bacakta 3 serbestlik derecesi var (toplam 18 servo); tripod yürüyüş algoritmasıyla dengeli hareket eder.',
      'NRF24L01 kablosuz modülüyle uzaktan kumanda edilir; kumandadaki çift joystick ve potansiyometrelerle yön, yürüme hızı ve gövde yüksekliği ayarlanır.'
    ],
    highlights: ['6 bacak', '18 servo', 'Tripod yürüyüşü', 'NRF24L01 kablosuz', 'Ayarlanabilir gövde yüksekliği'],
    print: [
      ['Katman yüksekliği', '0.2 mm'], ['Duvar', '3'], ['Dolgu', '%10'],
      ['Süre', '29.5 saat'], ['Plaka', '8'], ['Filament', 'PLA 1155 g']
    ],
    bom: {
      groups: [
        { title: 'Elektronik — Robot', items: [
          ['Arduino Mega', '1', ''],
          ['XL4016 voltaj regülatörü', '1', ''],
          ['NRF24L01 PA+LNA', '1', ''],
          ['NRF24L01 güç adaptörü', '1', ''],
          ['3S 2200 mAh LiPo', '1', ''],
          ['MG996R servo (180°)', '18', ''],
          ['KCD1 anahtar', '1', ''],
          ['Servo uzatma kabloları', '—', '']
        ] },
        { title: 'Elektronik — Kumanda', items: [
          ['NRF24L01 PA+LNA', '1', ''],
          ['NRF24L01 güç adaptörü', '1', ''],
          ['Arduino Uno', '1', ''],
          ['Çift 18650 pil yuvası', '1', ''],
          ['18650 Li-ion pil', '2', ''],
          ['5 mm toggle anahtar', '3', ''],
          ['10K potansiyometre', '2', ''],
          ['Joystick modülü', '2', ''],
          ['Jumper kablolar', '—', '']
        ] },
        { title: 'Mekanik & Donanım', items: [
          ['695 rulman', '18', 'Robot'],
          ['M3×6 cıvata', '90', 'Robot'],
          ['M3×10 cıvata', '90', 'Robot'],
          ['M3×6 cıvata', '18', 'Kumanda']
        ] }
      ]
    },
    steps: [
      { type: 'print', title: 'Baskı', text: 'Gövdeyi ve 6 bacağın parçalarını bas.' },
      { type: 'mech', title: 'Bacaklar', text: 'Rulmanları ve 18 servoyu bacaklara monte et.' },
      { type: 'elec', title: 'Devre', text: 'PCB\'yi Gerber dosyasıyla ürettir veya şemaya göre devreyi kur.' },
      { type: 'elec', title: 'Kumanda', text: 'Kumandayı ayrı olarak birleştir.' },
      { type: 'soft', title: 'Kod ve yürüyüş', text: 'Kodu robota ve kumandaya yükle, servoları nötr konumda kalibre et ve yürüyüş testini yap.' }
    ],
    warnings: ['Tasarımcı projenin hâlâ geliştirme aşamasında olduğunu ve yazılım çalışmalarının sürdüğünü belirtiyor.'],
    videos: [{ id: 'ciE2Z_92T7s', label: 'Montaj ve test' }],
    links: [
      { label: 'MakerWorld sayfası', url: 'https://makerworld.com/en/models/1973965-hexapod-spider-robot-with-servo-arduino' },
      { label: 'Kod (Google Drive)', url: 'https://drive.google.com/file/d/1bIMGIhBOq_qt7qGt7REMtUuWCw7WB5hj/view?usp=sharing' },
      { label: 'Gerber / PCB (Google Drive)', url: 'https://drive.google.com/file/d/10F6qPQ1kVP-xbSKdnUb0b_vhInIYOMQE/view?usp=sharing' },
      { label: 'Devre şeması (Cirkit Designer)', url: 'https://app.cirkitdesigner.com/project/f2cca481-7fbb-4e6d-9743-3ebf409ca84c' }
    ]
  },

  /* ------------------------------------------------------------------ 09 */
  {
    id: '09',
    name: 'Robot Kollu RC Rover',
    fullName: 'Robot Kollu RC Rover (6 DOF)',
    designer: 'Emre Kalem',
    designerUrl: 'https://makerworld.com/en/models/1342319-rc-rover-with-robot-arm-6-dof',
    category: 'ground',
    difficulty: 3,
    license: 'Standard Digital File License',
    controller: 'Arduino Mega + Uno (kumanda)',
    card: { time: '32.6 saat', filament: '1010 g PLA + TPU' },
    related: { id: '10', text: 'Bu projenin paletli ve geliştirilmiş yeni sürümü: 10 — Paletli RC Rover + Robot Kol' },
    images: [
      { file: '09-rover-1', ext: 'png', w: 685, h: 665, alt: 'Büyük lastikli, üzerinde 6 eksenli robot kol bulunan RC rover' },
      { file: '09-rover-2', ext: 'jpg', w: 1200, h: 900, alt: 'Robot kollu rover önden, kol katlanmış halde' }
    ],
    summary: [
      'Hareketli bir şasi ile 6 eksenli (6 DOF: serbestlik derecesi) bir robot kolu birleştiren entegre robot platformu.',
      'Arduino Mega (araç) ve Arduino Uno (kumanda) NRF24L01 kablosuz modülle haberleşir; araç uzaktan sürülür, kolla nesne tutulur. Kablosuz haberleşme, mekanik montaj ve temel robotik öğrenmek için pratik bir temel.'
    ],
    highlights: ['Tekerlekli şasi', '6 eksenli kol', 'NRF24L01 kablosuz', 'Özel kumanda', 'TPU lastikler'],
    print: [
      ['Katman yüksekliği', '0.2 mm'], ['Duvar', '2'], ['Dolgu', '%15'],
      ['Süre', '32.6 saat'], ['Plaka', '9'], ['Filament', 'PLA 814 g + TPU 196 g']
    ],
    bom: {
      groups: [
        { title: 'Elektronik', items: [
          ['Arduino Mega', '1', 'Araç'],
          ['Arduino Uno', '1', 'Kumanda'],
          ['NRF24L01 modül', '2', ''],
          ['NRF24L01 güç adaptörü', '2', ''],
          ['37 mm redüktörlü DC motor', '2', ''],
          ['L298N motor sürücü', '1', ''],
          ['MG996R / MG995 servo (180°)', '4', ''],
          ['MG90 servo (180°)', '3', ''],
          ['Joystick modülü', '2', ''],
          ['Potansiyometre', '2', ''],
          ['Toggle anahtar', '3', ''],
          ['5 mm LED + direnç', '5', ''],
          ['Mini breadboard', '1', ''],
          ['LM2596 voltaj düşürücü', '1', 'Daha güçlüsü önerilir'],
          ['3S LiPo', '1', ''],
          ['18650 Li-ion pil', '2', ''],
          ['Çift pil yuvası', '1', ''],
          ['KCD1 anahtar', '1', ''],
          ['Jumper kablolar', '—', '']
        ] },
        { title: 'Mekanik & Donanım', items: [
          ['608 rulman', '4', ''],
          ['M8×60 cıvata', '2', ''],
          ['M8 kilitli somun', '2', ''],
          ['M3×6, M3×10, M3×14 cıvatalar', '—', '']
        ] }
      ]
    },
    steps: [
      { type: 'print', title: 'Baskı', text: 'Şasi, kol ve kumanda parçalarını bas (tekerlek lastikleri TPU).' },
      { type: 'mech', title: 'Şasi', text: 'DC motorları ve tekerlekleri şasiye monte et.' },
      { type: 'mech', title: 'Robot kol', text: 'Kolu servolarla kur ve şasinin üstüne yerleştir.' },
      { type: 'elec', title: 'Elektronik', text: 'Araç ve kumanda elektroniğini şemaya göre bağla (PCB isteğe bağlı).' },
      { type: 'test', title: 'Kod ve test', text: 'Kodları yükle; sürüş ve kol kontrolünü test et.' }
    ],
    warnings: [],
    videos: [{ id: 'IE_Y0Bq97aE', label: 'Montaj ve test' }],
    links: [
      { label: 'MakerWorld sayfası', url: 'https://makerworld.com/en/models/1342319-rc-rover-with-robot-arm-6-dof' },
      { label: 'Kod (Google Drive)', url: 'https://drive.google.com/file/d/1uCRMThrL5kznQjbi5q90lINK4J6rvzWY/view?usp=sharing' },
      { label: 'Gerber / PCB (Google Drive)', url: 'https://drive.google.com/file/d/1wHCt0XVq7GyxYwemx3RNR6oHyjmG3TiU/view?usp=drivesdk' },
      { label: 'Devre şeması (Google Drive)', url: 'https://drive.google.com/file/d/1s7DWpCo6ple9byWvednpJjOxGQ1-hEhe/view?usp=drivesdk' }
    ]
  },

  /* ------------------------------------------------------------------ 10 */
  {
    id: '10',
    name: 'Paletli Rover + Robot Kol',
    fullName: 'Paletli RC Rover + Robot Kol (6 DOF)',
    designer: 'Emre Kalem',
    designerUrl: 'https://makerworld.com/en/models/3074653-tracked-rc-rover-with-robot-arm-6-dof',
    category: 'ground',
    difficulty: 4,
    license: 'Standard Digital File License',
    badges: ['Yarışma kazananı · MeshBear "Exoskeleton & Articulated Mechanism Challenge"'],
    controller: 'Arduino Mega + ESP32-C6 (kumanda)',
    card: { time: '36.5 saat', filament: '1318 g PLA' },
    related: { id: '09', text: 'Bu proje, 09 — Robot Kollu RC Rover\'ın (tekerlekli) yeni sürümüdür.' },
    images: [
      { file: '10-paletli-rover-1', ext: 'png', w: 757, h: 571, alt: 'Paletli, üzerinde 6 eksenli robot kol bulunan siyah rover ahşap masada' }
    ],
    summary: [
      'Üzerinde 6 eksenli robot kol bulunan, 3D baskı paletli (tırtıllı) bir rover. Kumandası bir taşıma çantası biçiminde tasarlanmış.',
      'Rover tarafında Arduino Mega, kumanda tarafında ESP32-C6 kullanılıyor; ikisi NRF24L01 kablosuz modülleriyle haberleşiyor.'
    ],
    highlights: ['Paletli şasi', '6 eksenli kol', '7× metal dişli MG996R', 'Çanta tipi kumanda', 'Arduino Mega + ESP32-C6', 'NRF24L01 kablosuz'],
    print: [
      ['Nozul', '0.4 mm'], ['Katman yüksekliği', '0.2 mm'], ['Duvar', '3'], ['Dolgu', '%15'],
      ['Süre', '36.5 saat'], ['Plaka', '9'], ['Filament', 'PLA 1318 g (~1.3 kg)']
    ],
    bom: {
      groups: [
        { title: 'Elektronik — Rover', items: [
          ['Arduino Mega 2560', '1', ''],
          ['MG996R tam metal dişli servo (180°)', '7', 'Metal dişli şart'],
          ['37 mm 500 RPM DC motor', '2', ''],
          ['L298N motor sürücü', '1', ''],
          ['XL4016 300W voltaj dönüştürücü', '1', ''],
          ['EBYTE E01-ML01DP5 (NRF24L01P)', '1', 'Kablosuz modül'],
          ['NRF24L01 5V→3.3V adaptör', '1', ''],
          ['KCD1 anahtar', '1', ''],
          ['3S 2200 mAh LiPo', '1', ''],
          ['40 cm servo uzatma kablosu', '6', ''],
          ['Jumper kablolar', '—', '']
        ] },
        { title: 'Elektronik — Kumanda', items: [
          ['Waveshare ESP32-C6-DEV-KIT-N8-M', '1', ''],
          ['EBYTE E01-ML01DP5 (NRF24L01P)', '1', ''],
          ['NRF24L01 5V→3.3V adaptör', '1', ''],
          ['MT3608 DC-DC yükseltici', '1', ''],
          ['18650 Li-ion pil', '1', ''],
          ['Tekli 18650 pil yuvası', '1', ''],
          ['Joystick modülü', '2', ''],
          ['10K potansiyometre', '2', ''],
          ['Toggle anahtar', '2', ''],
          ['KCD1 anahtar', '1', '']
        ] },
        { title: 'Mekanik & Donanım', items: [
          ['M3×8 yuvarlak baş vida', '100', ''],
          ['M3×10 vida', '20', ''],
          ['M3×6 vida', '20', ''],
          ['2×30 mm paslanmaz çelik pim', '120', 'Palet bağlantıları'],
          ['608ZZ rulman', '9', ''],
          ['MG996R metal yuvarlak servo kolu', '6', 'İsteğe bağlı']
        ] }
      ]
    },
    steps: [
      { type: 'print', title: 'Baskı', text: 'Rover, kol ve kumanda parçalarını bas (esnek parçalar TPU).' },
      { type: 'mech', title: 'Paletler ve şasi', text: 'Palet baklalarını 2×30 mm çelik pimlerle birleştir; DC motorları ve rulmanları şasiye yerleştir.' },
      { type: 'mech', title: 'Robot kol', text: 'Kolu 7 adet MG996R servoyla kur ve şasinin üstüne bağla.' },
      { type: 'elec', title: 'Rover elektroniği', text: 'Mega, L298N, XL4016 ve NRF24L01\'i şemaya göre bağla; PCB istenirse Gerber dosyasıyla ürettirilebilir.' },
      { type: 'test', title: 'Kumanda ve test', text: 'Çanta tipi kumandayı ESP32-C6 ile birleştir, kodları yükle; sürüş ve kol testini yap.' }
    ],
    warnings: ['Servoların tamamen metal dişli olması gerekiyor; plastik dişli servolar kolun yükünü kaldırmaz.'],
    videos: [{ id: '_5KeGOTaCFo', label: 'Montaj ve test (kod ve şema linkleri açıklamada)' }],
    links: [
      { label: 'MakerWorld sayfası', url: 'https://makerworld.com/en/models/3074653-tracked-rc-rover-with-robot-arm-6-dof' },
      { label: 'Kumanda modeli (MakerWorld)', url: 'https://makerworld.com/en/models/3074754-rc-controller-esp32-nrf24l01' },
      { label: 'Rover ve kumanda kodu (Google Drive)', url: 'https://drive.google.com/file/d/18fUy8BcsoLHqv835fQd46g1m9tI7iOj8/view' },
      { label: 'Gerber / PCB (Google Drive)', url: 'https://drive.google.com/file/d/1wHCt0XVq7GyxYwemx3RNR6oHyjmG3TiU/view' },
      { label: 'Rover devre şeması', url: 'https://app.cirkitdesigner.com/project/f39a9c6c-f222-4f7e-a47b-aa1494b7df04' },
      { label: 'Kumanda devre şeması', url: 'https://app.cirkitdesigner.com/project/17399aad-78bd-4106-adbe-7e9a39ed9cbf' }
    ]
  },

  /* ------------------------------------------------------------------ 11 */
  {
    id: '11',
    name: '100 km/s RC Araba',
    fullName: '100 km/h 3D Baskı RC Araba',
    designer: 'Hydrance (Hydrance Robotics)',
    designerUrl: 'https://youtube.com/@HydranceYT',
    category: 'ground',
    difficulty: 3,
    difficultyNote: 'Tasarımcı "orta seviye" diyor',
    license: 'MakerWorld Exclusive License (yalnızca kişisel kullanım; satılamaz, yeniden dağıtılamaz)',
    controller: 'RC alıcı + 120A ESC',
    card: { time: '31.9 saat', filament: '913 g PETG + TPU' },
    images: [
      { file: '11-rc-araba-1', ext: 'png', w: 808, h: 668, alt: 'Büyük lastikli 4WD 3D baskı RC araba çimde bir taşın üzerinde' },
      { file: '11-rc-araba-2', ext: 'jpg', w: 809, h: 607, alt: 'RC araba çimenlikte hızla giderken' },
      { file: '11-rc-araba-3', ext: 'jpg', w: 1554, h: 1514, alt: 'RC araba baskı parçalarının plaka düzeni' }
    ],
    wiring: { file: '11-rc-araba-kablolama', ext: 'png', w: 1287, h: 637, alt: 'RC araba kablolama şeması: batarya, ESC, motor, alıcı ve servo bağlantıları' },
    summary: [
      'Tasarımcının 3D baskı RC araba serisinin son ve en gelişmiş sürümü: 1:10 ölçekli, 4WD (dört çeker) bir araba. Metal diferansiyeller, metal akslar, geliştirilmiş süspansiyon ve daha büyük bir şasi kullanıyor.',
      'Hazır RC arabaların yaklaşık yarı fiyatına mal olduğu belirtiliyor; kırılan bir parça 0,5 dolardan ucuza yeniden basılabiliyor.'
    ],
    highlights: ['Hedef 90–100 km/s (henüz test edilmedi)', '4WD', 'Tamamen metal aktarma', 'Bağımsız süspansiyon', 'Ön ve arka kamber', 'Ayarlanabilir dişli oranı', '1:10 ölçek'],
    highlightNote: 'Hız hedefi MakerWorld\'de 90, GitHub\'da 100 km/s olarak yazıyor; tasarımcıya göre henüz test edilmedi. Diğer özellikler: 4S batarya + 120A ESC yükseltmesi, kolay ayarlanan amortisör bağlantıları, önceki sürümlerden daha az malzeme.',
    specs: [
      ['Motor', '2850KV 3670 brushless (fırçasız)'],
      ['ESC', 'En az 120A'],
      ['Batarya', '3S veya 4S LiPo'],
      ['Servo', '25 kg·cm'],
      ['Dişli oranı', '21T pinyon / 64T ana dişli'],
      ['Orta şaft', '170 mm'],
      ['Altıgen göbek', '12 mm × 8 mm']
    ],
    history: {
      title: 'Sürüm geçmişi',
      items: [
        ['V1', '21 Mayıs 2026', ''],
        ['V1.5', '25 Mayıs 2026', ''],
        ['V2', '27 Mayıs 2026', ''],
        ['V3', '21 Haziran 2026', 'Kararlı sürüm (MakerWorld\'deki). Süspansiyon kolları iki kat genişletildi, tekerlek göbekleri iyileştirildi, aks desteği ve batarya durdurucuda küçük düzeltmeler yapıldı; şasi uzatılıp kalınlaştırıldı. Stabilite ve dayanım arttı.'],
        ['V4', '29 Haziran 2026', 'Beta — tasarımcı "basmayın" diyor.']
      ]
    },
    print: [
      ['Profil 1 (tasarımcının)', '0.6 mm nozul, 0.24 mm katman, 4 duvar, %20 dolgu'],
      ['Profil 1 süre', '31.9 saat · 7 plaka'],
      ['Profil 2 (P1S)', '0.4 mm nozul, aynı ayarlar · 23.4 saat · 7 plaka'],
      ['Filament', 'PETG 805 g + TPU 108 g (toplam 913 g)'],
      ['Malzeme dağılımı', 'Lastik ve sönümleme TPU; şasi, kollar ve bağlantılar PETG'],
      ['Not', 'Yüksek gerilim alan tüm parçalarda 4 duvar önerilir; her şey Bambu Lab A1\'de basılabilir']
    ],
    bom: {
      source: { label: 'Satın alma linkleri ve fiyatlar: BOM For 3d Printed RC Car.csv (GitHub)', url: 'https://github.com/HydranceAK/Upgraded-100km-h-3d-Printed-RC-Car/blob/main/BOM%20For%203d%20Printed%20RC%20Car.csv' },
      groups: [
        { title: 'Elektronik', items: [
          ['2850KV 3670 brushless motor', '1', ''],
          ['120A+ ESC', '1', ''],
          ['25 kg servo', '1', 'Direksiyon'],
          ['Alıcı', '1', ''],
          ['Verici (kumanda)', '1', ''],
          ['3S veya 4S LiPo batarya', '1', '']
        ] },
        { title: 'Aktarma Organları', items: [
          ['1:10 ölçek dişli kutusu (diferansiyel)', '2', 'Birbirine ters yönde takılır'],
          ['HSP 166015 universal şaft', '4', ''],
          ['21T pinyon + 64T ana dişli', '1 set', ''],
          ['170 mm orta şaft', '1', ''],
          ['12 mm × 8 mm altıgen göbek', '4', ''],
          ['Lastik', '4', '']
        ] },
        { title: 'Mekanik & Donanım', items: [
          ['10×15×4 rulman', '8', ''],
          ['5×10×4 rulman', '9', ''],
          ['M4 dişli insert (sıcak gömme)', '—', ''],
          ['M4 kilitli somun', '8', ''],
          ['M4 somun', '4', ''],
          ['M3 vida seti', '1', ''],
          ['M4 vida seti', '1', ''],
          ['Gres', '—', '']
        ] },
        { title: 'Gerekli Aletler', items: [
          ['Havya', '1', 'Insertleri gömmek için (çakmak da olur)'],
          ['Tornavida', '1', ''],
          ['Yan keski', '1', ''],
          ['Pense', '1', ''],
          ['Mengene', '1', 'İsteğe bağlı']
        ] }
      ]
    },
    steps: [
      { type: 'mech', title: 'Şasi', text: 'Parçaları ayır, şasi plakasına insertleri göm ve yan duvarları gevşek bağla.', sub: [
        'Parçaları kutulara ayır.',
        'Şasi plakasına havyayla M4 insertleri göm.',
        'Alttan 4 adet M4 vida tak.',
        'Yan duvarları ve batarya ayırıcısını gevşek bağla (servo takılırken yan duvar yeniden sökülecek).',
        'Batarya durdurucuyu tak ve süspansiyon yuvalarına M4 kilitli somunları bastır.'
      ] },
      { type: 'mech', title: 'Aktarma organları', text: 'Dişli kutularını ve aksları greslenmiş halde kur, motoru pinyonla ayarla.', sub: [
        'Alt dişli kutusu yarımlarını monte et.',
        'Aks desteklerine 5×10×4 rulmanları bastır.',
        'Dişli kutusu içlerini ve aksları gresleyerek yerleştir.',
        'Üst kapakları 8 adet M4 vidayla kapat.',
        'Süspansiyon bağlantılarını ve direksiyon direklerini tak.',
        'Motor desteğini raya kaydır, 21T pinyonu motora tak ve 64T dişliyle boşluksuz, sıkışmadan kavrayacak şekilde ayarla.'
      ] },
      { type: 'mech', title: 'Süspansiyon', text: 'Ön ve arka kolları, göbek rulmanlarını ve aksları yerleştir.', sub: [
        'Arka alt kolları tak (serbest dönmeli, boşluk yapmamalı).',
        'Arka göbeklere birer 10×15×4 ve 5×10×4 rulman bastır.',
        'Aksı üst kapağı kapatmadan önce geçir.',
        'Aynısını ön kollar ve ön göbekler için tekrarla.'
      ] },
      { type: 'mech', title: 'Direksiyon', text: 'Direksiyon kollarını kur, servoyu yerleştirip denge koluna bağla.', sub: [
        'Göbek direksiyon kollarını, ana direksiyon kollarını ve denge (bellcrank) kollarını tak.',
        'Sağ yan duvarı sökerek servoyu yuvasına yerleştir.',
        'Servo kolunu denge koluna bağla ve duvarı geri tak.'
      ] },
      { type: 'elec', title: 'Son montaj ve elektronik', text: 'Tekerlekleri ve gövde parçalarını tamamla, elektroniği bağla.', sub: [
        'Şasi güçlendiricisini, altıgen göbekleri, lastikleri ve 170 mm orta şaftı tak.',
        'Tamponu ve spoyleri vidala.',
        'Motoru ESC\'ye bağla; alıcıyı ESC (gaz kanalı) ve servoya (direksiyon kanalı) bağla.',
        'Bataryayı kayışla sabitle.'
      ] }
    ],
    warnings: [
      'İki dişli kutusu birbirine ters yönde takılmalı. Aynı yönde takılırsa ön ve arka akslar birbirine karşı çalışır.',
      'Aksı göbeğe, üst kapağı vidalamadan önce geçir; sonradan takılamaz.',
      'LiPo bataryayı mekanik montaj tamamen bitip kontrol edilmeden bağlama. Araba üzerinde çalışırken batarya her zaman sökülü olsun.',
      'Kılavuzda vida boyları belirtilmiyor; her nokta için uygun uzunluğu seç.'
    ],
    videos: [{ id: '6iFeAaE8pu4', label: 'Önceki 4WD sürümü', tag: 'önceki sürüm' }],
    channel: { label: 'Hydrance YouTube kanalı', url: 'https://youtube.com/@HydranceYT', note: 'Bu sürümün "I made a 100km/h 3D Printed RC Car" videosu tasarımcının kanalında.' },
    links: [
      { label: 'MakerWorld sayfası', url: 'https://makerworld.com/en/models/2832201-100km-h-3d-printed-rc-car' },
      { label: 'GitHub (BOM CSV, STEP, kablolama şeması)', url: 'https://github.com/HydranceAK/Upgraded-100km-h-3d-Printed-RC-Car' },
      { label: 'Resmi montaj kılavuzu', url: 'https://fanciful-zabaione-62d97d.netlify.app/' },
      { label: 'YouTube kanalı', url: 'https://youtube.com/@HydranceYT' }
    ]
  },

  /* ------------------------------------------------------------------ 12 */
  {
    id: '12',
    name: 'GASB ONE RC Uçak',
    fullName: 'GASB ONE RC Uçak',
    designer: 'Carletto73',
    designerUrl: 'https://makerworld.com/en/models/2202921-gasb-one-world-s-most-printed-rc-plane-x-bambu',
    category: 'air',
    difficulty: 2,
    license: 'CC BY-NC-SA 4.0',
    controller: 'RC alıcı + 30A ESC',
    card: { time: '21.7 saat', filament: '~498 g PETG', costFromBom: true },
    images: [
      { file: '12-gasb-one-1', ext: 'png', w: 632, h: 577, alt: 'Mavi GASB ONE uçan kanat RC uçak, mavi gökyüzünde göl üzerinde uçarken' },
      { file: '12-gasb-one-2', ext: 'jpg', w: 1024, h: 768, alt: 'Sarı-turuncu GASB ONE uçak ve radyo kumandası' },
      { file: '12-gasb-one-3', ext: 'jpg', w: 1200, h: 900, alt: 'Koyu renkli GASB ONE uçak masada kumandayla birlikte' }
    ],
    summary: [
      'Dünyanın en çok basılan RC uçağı olarak tanıtılan, 75.000\'den fazla indirilmiş bir uçan kanat. Ucuz, kolay basılır, kolay onarılır ve kolay uçar.',
      'Kaza yaparsa yalnızca hasar gören parça yeniden basılır. Bambu Lab yazıcılar için optimize edilmiş profillerle gelir.'
    ],
    highlights: ['80 cm kanat açıklığı', 'Sadece 9 parça', '~498 g PETG (PLA da olur)', 'Yapıştırıcısız montaj', 'Yeni başlayanlara uygun'],
    history: {
      title: 'Tarihçe',
      items: [
        ['V4', '2016', 'İlk başarılı uçuş, 334 g.'],
        ['V5', '', 'Daha kalın yapı, mıknatıslı kapak, 358 g.'],
        ['V6', '', '9 g servolar ve dolgusuz baskı için iç yapı.'],
        ['V7', 'güncel', 'Yapıştırıcısız, tamamen sökülebilir, mıknatıssız kapak; ağırlık merkezi ayarı için uzatılmış burun.']
      ]
    },
    print: [
      ['Katman yüksekliği', '0.2 mm'], ['Duvar', '1'],
      ['Süre', '21.7 saat · 9 plaka'],
      ['Alternatifler', '4 plaka 22.3 saat · 2 plaka 18.7 saat'],
      ['Minimum tabla', '190 × 190 × 160 mm'],
      ['Filament', '~498 g PETG (PLA da olur)']
    ],
    bom: {
      priced: true,
      groups: [
        { title: 'Baskı Malzemesi', items: [
          ['ext', '47 g', '', 0.85], ['ext_L', '47 g', '', 0.85],
          ['int', '67 g', '', 1.20], ['int_L', '67 g', '', 1.20],
          ['ail', '18 g', '', 0.32], ['ail_L', '18 g', '', 0.32],
          ['rear', '106 g', '', 1.90], ['front', '99 g', '', 1.78],
          ['canopy', '24 g', '', 0.43]
        ] },
        { title: 'Elektronik', items: [
          ['BE1806 2300KV motor', '1', '', 15],
          ['30A BEC\'li ESC', '1', '', 15],
          ['MG90S metal dişli 9 g servo', '2', '', 5.20],
          ['6×4 pervane', '1', '', 2.20],
          ['3S 1500 mAh 45C LiPo', '1', '', 8],
          ['Turnigy 3 kanal alıcı', '1', '', 5.50]
        ] },
        { title: 'Mekanik & Donanım', items: [
          ['1.2 mm × 120 mm çelik tel', '1', 'Servo–kanatçık bağlantısı', 2],
          ['Servo çatalı', '—', '', 2],
          ['Orta viskoziteli siyanoakrilat yapıştırıcı', '1', '', 7],
          ['M3×12 vida + somun + pul', '3', '', 0.50],
          ['Karbon çubuk 3×64 mm', '6', 'Fiyat belirtilmemiş'],
          ['Karbon çubuk 3×30 mm', '4', 'Fiyat belirtilmemiş'],
          ['Karbon çubuk 3×25 mm', '2', 'Fiyat belirtilmemiş'],
          ['Karbon çubuk 3×85 mm', '2', 'Fiyat belirtilmemiş'],
          ['Karbon çubuk 5×615 mm', '1', 'Süngü; fiyat belirtilmemiş']
        ] }
      ]
    },
    steps: [
      { type: 'print', title: 'Baskı', text: '9 parçayı bas.' },
      { type: 'mech', title: 'Kanatlar', text: 'Kanatları karbon çubuklarla birleştir ve gövdeye süngü çubuğuyla bağla.' },
      { type: 'mech', title: 'Servolar', text: 'Servoları kanat altındaki yuvalarına siyanoakrilatla yapıştır; çelik tel ve çatalla kanatçıklara bağla.' },
      { type: 'elec', title: 'Elektronik', text: 'Motor, ESC, alıcı ve bataryayı yerleştir.' },
      { type: 'test', title: 'Denge ve uçuş', text: 'Ağırlık merkezini ayarla (V4\'te kanat hücum kenarı birleşiminden 145 mm) ve uçuş testi yap.' }
    ],
    warnings: [
      'Mutlaka metal dişli servo kullan; plastik dişli servolar kanatçık elle oynatılınca kırılabilir.',
      'Kanatçığın servo çatalına bağlandığı noktayı ince bir siyanoakrilat katmanıyla güçlendir.'
    ],
    videos: [
      { id: 'QzuWzu4H0v8', label: 'İlk uçuşlar' },
      { id: '1L2V8Cq05J4', label: 'İlk uçuşlar' },
      { id: 'TPNiDbek_nQ', label: 'Popüler topluluk videosu' },
      { id: 'WRIu9LdjGjc', label: 'GASB ONE videosu' }
    ],
    links: [
      { label: 'MakerWorld sayfası', url: 'https://makerworld.com/en/models/2202921-gasb-one-world-s-most-printed-rc-plane-x-bambu' }
    ]
  }
];
