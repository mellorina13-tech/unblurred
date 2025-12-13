# Vercel Deployment Rehberi

## ⚠️ Önemli Uyarı

**Vercel'in Sınırlamaları:**
- ⏱️ **10 saniye timeout** - Depix işlemleri 30-60 saniye sürdüğü için sorun olabilir
- 📦 **50MB deployment limit** - Büyük bağımlılıklar sorun olabilir
- 🔄 **Serverless** - Her istek yeni container başlatır

**Sonuç:** Depix gibi uzun süren işlemler için Vercel ideal değil, ama deneyebiliriz.

## 📋 Gereksinimler

1. **Vercel Hesabı** - [vercel.com](https://vercel.com) (GitHub ile ücretsiz)
2. **Vercel CLI** (opsiyonel, local test için)
3. **Git Repository** (GitHub, GitLab, veya Bitbucket)

## 🚀 Deployment Adımları

### Yöntem 1: GitHub ile Deploy (Önerilen)

#### 1. GitHub Repository Oluştur

```bash
cd c:\Users\User\Desktop\unblury
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/unblury.git
git push -u origin main
```

#### 2. Vercel'e Bağla

1. [vercel.com](https://vercel.com) adresine git
2. "Import Project" tıkla
3. GitHub repository'nizi seçin
4. "Deploy" tıkla

**Otomatik olarak:**
- `vercel.json` algılanır
- Python runtime kurulur
- Deployment başlar

#### 3. Environment Variables (Gerekirse)

Vercel Dashboard → Settings → Environment Variables:
```
PYTHON_VERSION=3.9
```

### Yöntem 2: Vercel CLI ile Deploy

#### 1. Vercel CLI Kur

```bash
npm install -g vercel
```

#### 2. Login

```bash
vercel login
```

#### 3. Deploy

```bash
cd c:\Users\User\Desktop\unblury
vercel
```

İlk deployment için soruları yanıtlayın:
- Set up and deploy? **Y**
- Which scope? **Kendi hesabınız**
- Link to existing project? **N**
- Project name? **unblury** (veya istediğiniz isim)
- In which directory? **./** (enter)
- Override settings? **N**

#### 4. Production Deploy

```bash
vercel --prod
```

## 📁 Dosya Yapısı

Vercel için oluşturulan dosyalar:

```
unblury/
├── api/
│   └── index.py          # Vercel serverless entry point
├── vercel.json           # Vercel configuration
├── .vercelignore         # Ignore files
├── app.py                # Flask app (mevcut)
├── requirements.txt      # Dependencies
├── templates/            # HTML templates
├── static/               # CSS, JS, images
└── depixlib/             # Depix library
```

## ⚙️ Vercel Configuration (vercel.json)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.py"
    }
  ]
}
```

## 🔧 Sorun Giderme

### 1. Timeout Hatası

**Sorun:** İşlem 10 saniyede tamamlanmıyor

**Çözüm:**
- Küçük fotoğraflarla test edin
- Veya Railway/Render kullanın (timeout yok)

### 2. Deployment Hatası

**Sorun:** Build başarısız

**Kontrol:**
- `requirements.txt` doğru mu?
- `api/index.py` var mı?
- `vercel.json` syntax hatası var mı?

### 3. Static Files Yüklenmiyor

**Sorun:** CSS/JS çalışmıyor

**Çözüm:**
- `vercel.json` routes kontrol edin
- Static files `/static/` altında mı?

### 4. Import Hatası

**Sorun:** `ModuleNotFoundError`

**Çözüm:**
- `requirements.txt` güncel mi?
- Tüm bağımlılıklar listelenmiş mi?

## 📊 Vercel Limits (Free Tier)

| Limit | Değer |
|-------|-------|
| Execution Timeout | 10 saniye ⚠️ |
| Deployment Size | 50 MB |
| Bandwidth | 100 GB/ay |
| Invocations | 100 GB-Saat/ay |

## 🎯 Deployment Sonrası

Deployment başarılı olursa:

1. **URL alırsınız:** `https://unblury.vercel.app` gibi
2. **Custom domain** ekleyebilirsiniz (ücretsiz)
3. **Otomatik deploy:** Her git push'ta yeniden deploy

## ⚠️ Önemli Notlar

> [!WARNING]
> **Timeout Sorunu:**
> Depix işlemleri 30-60 saniye sürebilir, Vercel 10 saniye sonra timeout verir. Bu yüzden:
> - Sadece küçük test fotoğrafları çalışabilir
> - Büyük fotoğraflar timeout hatası verir

> [!TIP]
> **Alternatif Çözümler:**
> 1. **Railway** - Ücretsiz tier, timeout yok, $5 credit
> 2. **Render** - Ücretsiz tier, 15 dakika timeout
> 3. **PythonAnywhere** - Ücretsiz tier, Flask desteği
> 4. **Fly.io** - Ücretsiz tier, Docker desteği

## 🔄 Güncelleme

Kod değişikliği yaptıktan sonra:

```bash
git add .
git commit -m "Update message"
git push
```

Vercel otomatik olarak yeniden deploy eder!

## 📝 Test Etme

Deployment sonrası test:

1. Ana sayfayı aç
2. **Küçük** bir test fotoğrafı yükle
3. İşlem 10 saniyeden kısa sürerse ✅
4. Timeout hatası alırsan ❌ (Railway/Render gerekli)

## 🎉 Başarılı Deployment

Eğer her şey çalışırsa:
- ✅ Web sitesi online
- ✅ Herkes erişebilir
- ✅ HTTPS otomatik
- ✅ CDN ile hızlı

**Ama unutmayın:** Timeout sorunu olabilir!
