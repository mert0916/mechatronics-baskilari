# Yapılabilir Robotlar: 12 Açık Kaynak Proje

3D yazıcıyla basılıp hobi elektroniğiyle yapılabilen 12 açık kaynak robotik/RC projesini tanıtan, tek sayfalık statik bir web sitesi. Her proje için ne olduğu, malzeme listesi (BOM), baskı ayarları, yapım adımları, videolar ve orijinal kaynak bağlantıları bir arada.

Saf HTML + CSS + JavaScript; framework, build adımı veya `npm install` yok. Tek harici kaynak Google Fonts.

## Klasör yapısı

```
index.html          sayfa iskeleti ve SVG ikon seti
css/style.css       tüm stiller (renkler :root içinde)
js/main.js          sayfayı veriden üreten ve animasyonları yöneten kod
data/projects.js    tüm proje verisi (tek dizi)
images/             proje görselleri (PNG/JPG + WebP)
images/ui/          logo / favicon
```

## Yerelde açma

`index.html` dosyasına çift tıklamak yeterli. Bazı tarayıcılar `file://` üzerinden panoya kopyalamayı kısıtlayabileceği için yerel bir sunucu önerilir:

```bash
python3 -m http.server 8000
# ardından tarayıcıda: http://localhost:8000
```

## GitHub Pages'e yayınlama

1. Bu klasörü bir GitHub deposuna gönderin (`.gitignore`, `SITE-PROMPT.md` ve `images/originals/` klasörünü dışarıda bırakır).
2. Depoda **Settings → Pages** bölümüne gidin.
3. **Source** olarak "Deploy from a branch" seçin, dal olarak `main`, klasör olarak `/ (root)` seçip kaydedin.
4. Birkaç dakika sonra site `https://<kullanıcı-adı>.github.io/<depo-adı>/` adresinde yayında olur. Tüm yollar göreceli olduğu için ek ayar gerekmez.

## Yeni proje eklemek

Yalnızca `data/projects.js` düzenlenir. `PROJECTS` dizisine mevcut bir projeyi kopyalayıp şu alanları değiştirin:

| Alan | Açıklama |
|------|----------|
| `id` | İki haneli sıra numarası (`"13"`). Bölüm numarası ve görsel öneki olarak kullanılır. |
| `name`, `fullName` | Kartta görünen kısa ad ve detay bölümündeki tam ad. |
| `designer`, `designerUrl` | Tasarımcı adı ve sayfası (footer'daki liste buradan oluşur). |
| `category` | `air`, `arm`, `ground` veya `walk`. |
| `difficulty` | 1–5 arası tahmini zorluk. |
| `license`, `badges` | Lisans rozeti ve isteğe bağlı ek rozetler. |
| `card` | Kart ve karşılaştırma tablosu için `time`, `filament` (bilinmiyorsa `null`), isteğe bağlı `cost`. |
| `controller` | Karşılaştırma tablosundaki ana kontrolcü. |
| `images` | `{ file, ext, w, h, alt }` listesi; ilki ana görseldir. |
| `summary`, `highlights` | "Bu nedir?" paragrafları ve teknik değer çipleri. |
| `steps` | `{ type, title, text, sub? }`; `type`: `print`, `mech`, `elec`, `soft`, `test`. |
| `bom` | `groups: [{ title, items: [[parça, adet, not, fiyat?]] }]`. Liste kaynakta ise `missing: true` ve `source: { label, url }`. |
| `print` | `[etiket, değer]` çiftleri. |
| `videos` | `{ id, label }` — YouTube video kimliği. Boşsa video bloğu gizlenir. |
| `warnings`, `links` | Uyarı maddeleri ve `{ label, url }` bağlantıları. |

İsteğe bağlı alanlar: `specs` (teknik tablo), `history` (sürüm zaman çizelgesi), `wiring` (kablolama şeması), `related` (ilgili proje bağlantısı), `channel` (video yerine kanal bağlantısı).

Hero'daki sayılar (proje, kategori, videolu proje) ve karşılaştırma tablosu bu veriden otomatik hesaplanır.

## Görsel adlandırma kuralı

```
images/NN-proje-adı-N.ext   +   images/NN-proje-adı-N.webp
```

- `NN`: projenin iki haneli `id`'si (`01`, `02` …)
- `proje-adı`: küçük harf, Türkçe karakter ve boşluk içermeyen kısa ad (`paletli-rover`)
- `N`: galeri sırası; `-1` her zaman ana görseldir (kartta ve galerinin başında gösterilir)

Örnek: `images/02-drone-3.jpg` ve `images/02-drone-3.webp`. Yeni görseli ekledikten sonra ilgili projenin `images` dizisine `{ file: '02-drone-3', ext: 'jpg', w: 1200, h: 900, alt: '…' }` satırını ekleyin. Uzun kenarı en fazla 1600 px tutun ve bir WebP sürümü üretin. Projede tek görsel varsa küçük görsel şeridi otomatik gizlenir.

## Telif

Tüm tasarımlar sahiplerine aittir; bu sayfa yalnızca tanıtım ve yönlendirme amaçlıdır. Dosyaları indirmek için orijinal sayfaları ziyaret edin.

Hazırlayan: Mert Demirel — GitHub: [mert0916](https://github.com/mert0916)
