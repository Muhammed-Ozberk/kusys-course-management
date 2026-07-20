# kusys-course-management

Öğrenci ve ders eşleştirmelerini yönetmek için geliştirilmiş, JWT tabanlı kimlik doğrulama ve rol yetkilendirmesi kullanan bir web uygulamasıdır. React arayüzü, Express API'si ve PostgreSQL veritabanından oluşur.

## Özellikler

- Öğrenci ve yönetici girişi
- JWT ile korunan API uçları
- Yalnızca yöneticilere açık öğrenci ekleme, güncelleme ve silme işlemleri
- Öğrencileri derslerle eşleştirme
- Docker Compose ile tek komutla kurulum
- Auth ve rol yetkilendirme testleri

## Ekran görüntüleri

| Eşleştirilen öğrenciler | Ders eşleştirme |
| --- | --- |
| <img src="./screenshots/1.png" alt="Eşleştirilen öğrenciler ekranı" width="760"> | <img src="./screenshots/2.png" alt="Ders eşleştirme penceresi" width="480"> |

## Docker ile çalıştırma

Gereksinimler: Docker ve Docker Compose.

```sh
git clone https://github.com/Muhammed-Ozberk/kusys-course-management.git
cd kusys-course-management
docker compose up --build
```

Uygulama `http://localhost:3000`, API ise `http://localhost:8080` adresinde çalışır. PostgreSQL migrasyonları ve örnek veriler ilk çalıştırmada otomatik olarak yüklenir.

Örnek hesaplar:

| Rol | E-posta | Parola |
| --- | --- | --- |
| Yönetici | `john@example.com` | `1234` |
| Öğrenci | `jane@example.com` | `1234` |

Servisleri durdurmak için `docker compose down`, veritabanı hacmini de silerek temiz bir başlangıç yapmak için `docker compose down --volumes` kullanabilirsiniz.

## Yerel geliştirme

Node.js 20+ ve PostgreSQL 16+ gereklidir.

1. Ortam ayarlarını hazırlayın:

   ```sh
   cp backend/.env.example backend/.env
   ```

2. Backend'i kurup veritabanını hazırlayın:

   ```sh
   cd backend
   npm ci
   npm run db:migrate
   npm run db:seed
   npm start
   ```

3. Ayrı bir terminalde frontend'i başlatın:

   ```sh
   cd frontend
   npm ci
   npm start
   ```

Frontend API adresini değiştirmek için `frontend/.env` dosyasına `VITE_API_URL=http://localhost:8080` ekleyebilirsiniz.

## Testler

Backend auth ve rol yetkilendirme testleri gerçek bir veritabanına ihtiyaç duymaz:

```sh
cd backend
npm test
```

## Lisans

Bu proje [MIT Lisansı](./LICENSE) ile lisanslanmıştır.
