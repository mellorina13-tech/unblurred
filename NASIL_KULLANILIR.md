# Web Uygulamasını Başlatma Rehberi

## Adım 1: Gerekli Paketleri Yükleyin

Komut satırını (PowerShell veya CMD) açın ve şu komutu çalıştırın:

```bash
pip install -r requirements.txt
```

Bu komut Flask ve diğer gerekli Python paketlerini yükleyecek.

## Adım 2: Web Sunucusunu Başlatın

Aynı klasörde şu komutu çalıştırın:

```bash
python app.py
```

Sunucu başladığında şöyle bir mesaj göreceksiniz:
```
============================================================
🚀 Depixelization Web Application
============================================================
📍 Server starting at: http://localhost:5000
📝 Press CTRL+C to stop the server
============================================================
```

## Adım 3: Tarayıcıda Açın

Tarayıcınızda şu adresi açın:
```
http://localhost:5000
```

## Kullanım

1. **Fotoğraf Yükle**: Pixelli fotoğrafınızı sürükleyip bırakın veya "Dosya Seç" butonuna tıklayın
2. **Önizleme**: Yüklenen fotoğrafı kontrol edin
3. **Gelişmiş Ayarlar** (Opsiyonel): 
   - Ortalama tipi seçin (Gamma Corrected veya Linear)
   - Arkaplan rengini belirtin (örn: 40,41,35)
4. **Fotoğrafı Temizle**: Butona tıklayın ve işlemin bitmesini bekleyin
5. **İndir**: Temizlenmiş fotoğrafı indirin

## Sunucuyu Durdurmak

Komut satırında `CTRL+C` tuşlarına basın.

## Sorun Giderme

### "Python was not found" hatası
- Python'un yüklü olduğundan emin olun
- Python'u PATH'e eklediğinizden emin olun

### "No module named 'flask'" hatası
- `pip install -r requirements.txt` komutunu çalıştırın

### Port zaten kullanımda hatası
- Başka bir uygulama 5000 portunu kullanıyor olabilir
- `app.py` dosyasındaki son satırda port numarasını değiştirin (örn: 5001)

## Notlar

- Web uygulaması sadece yerel bilgisayarınızda çalışır
- İnternet bağlantısı gerekmez
- Yüklenen ve işlenen dosyalar `uploads/` ve `outputs/` klasörlerinde saklanır
