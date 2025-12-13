# Git ile GitHub'a Yükleme Rehberi

## Adım 1: Git Kurulumu Kontrol

```bash
git --version
```

Eğer "git is not recognized" hatası alırsanız:
- [Git'i indirin](https://git-scm.com/download/win)
- Kurun ve PowerShell'i yeniden başlatın

## Adım 2: Git Repository Başlat

```bash
cd c:\Users\User\Desktop\unblury
git init
```

## Adım 3: .gitignore Oluştur

Gereksiz dosyaları ignore etmek için:

```bash
# .gitignore içeriği
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv/
.DS_Store
.env
.vscode/
.idea/
*.log

# Geçici dosyalar (uploads ve outputs boş olabilir)
uploads/*
!uploads/.gitkeep
outputs/*
!outputs/.gitkeep
```

## Adım 4: Tüm Dosyaları Ekle

```bash
git add .
```

Bu komut **TÜM** dosyaları ve klasörleri ekler (`.gitignore` hariç)

## Adım 5: Commit

```bash
git commit -m "Initial commit: Depixelization web app"
```

## Adım 6: GitHub Repository'ye Bağla

GitHub'da repository oluşturduktan sonra:

```bash
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git
```

## Adım 7: Push (Yükle)

```bash
git push -u origin main
```

## Sorun Giderme

### Boş Klasörler Görünmüyor

Git boş klasörleri takip etmez. Çözüm:

```bash
# Her boş klasöre .gitkeep dosyası ekle
echo. > uploads/.gitkeep
echo. > outputs/.gitkeep
git add uploads/.gitkeep outputs/.gitkeep
git commit -m "Add .gitkeep for empty folders"
git push
```

### "Authentication failed" Hatası

GitHub artık şifre kabul etmiyor. Personal Access Token kullanın:

1. GitHub → Settings → Developer settings → Personal access tokens
2. "Generate new token" (classic)
3. Repo yetkisi verin
4. Token'ı kopyalayın
5. Push yaparken şifre yerine token'ı girin

### Veya GitHub Desktop Kullanın (Daha Kolay!)

1. [GitHub Desktop](https://desktop.github.com/) indirin
2. Kurulumu tamamlayın
3. File → Add Local Repository
4. `c:\Users\User\Desktop\unblury` seçin
5. "Publish repository" tıklayın
6. Tüm dosyalar otomatik yüklenir!

## Hızlı Komutlar

```bash
# Durum kontrol
git status

# Değişiklikleri ekle
git add .

# Commit
git commit -m "Mesajınız"

# Push
git push

# Pull (güncellemeleri çek)
git pull
```

## ✅ Başarılı Yükleme Kontrolü

GitHub repository sayfanızda şunları görmelisiniz:
- ✅ `app.py`
- ✅ `templates/` klasörü
- ✅ `static/` klasörü
- ✅ `depixlib/` klasörü
- ✅ `api/` klasörü
- ✅ `vercel.json`
- ✅ `requirements.txt`

Tüm klasörler ve dosyalar orada olmalı!
