# 🌿 Explore Kaltara

Platform terdepan untuk menjelajahi keindahan Kalimantan Utara. Temukan pesona alam liar, budaya Dayak yang kaya, dan pengalaman tak terlupakan di ujung utara Borneo.

## ✨ Fitur Utama

- 🗺️ **Destinasi Wisata Lengkap** - Jelajahi tempat-tempat menakjubkan di Kaltara
- 🏨 **Hotel & Penginapan** - Temukan akomodasi terbaik untuk perjalanan Anda
- 🗓️ **Trip Planner** - Rencanakan perjalanan lengkap dengan budget dan itinerary
- 🌤️ **Weather Integration** - Informasi cuaca real-time untuk semua lokasi
- 👤 **User Authentication** - Profil personal dengan preferensi perjalanan
- 🔍 **Advanced Search & Filter** - Cari dan filter berdasarkan berbagai kriteria
- 📱 **Responsive Design** - Optimal di semua perangkat
- 🎨 **Modern UI/UX** - Antarmuka yang indah dan mudah digunakan
- ⚡ **Performance Optimized** - Dibangun dengan Next.js 15 dan Turbopack
- 💾 **Wishlist System** - Simpan destinasi dan hotel favorit

## 🗺️ Wilayah yang Dicakup

- **Tarakan** - Pulau Kumala, Hutan Mangrove, Pantai Amal
- **Malinau** - Taman Nasional Kayan Mentarang, Air Terjun Tujuh Tingkat
- **Bulungan** - Tanjung Selor, Rumah Adat Baloy
- **Nunukan** - Pulau Bunyu, Pantai Batu Lamampu
- **Tana Tidung** - Tideng Pale, Gunung Lumut

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) atau npm/yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd explore-kaltara

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm
- **Build Tool**: Turbopack
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── destinations/      # Halaman destinasi
│   ├── hotels/           # Halaman hotel
│   ├── page.tsx          # Homepage
│   └── layout.tsx        # Root layout
├── data/                 # Data JSON
│   ├── destinations.json # Data destinasi wisata
│   └── hotels.json      # Data hotel
└── components/          # React components (future)
```

## 🎯 Available Routes

- `/` - Homepage dengan featured content
- `/destinations` - Listing semua destinasi dengan filter
- `/destinations/[slug]` - Detail halaman destinasi
- `/hotels` - Listing semua hotel dengan filter
- `/hotels/[slug]` - Detail halaman hotel

## 🔧 Development

### Adding New Destinations

Edit `src/data/destinations.json` dan tambahkan objek baru dengan struktur:

```json
{
  "id": "unique-destination-id",
  "name": "Nama Destinasi",
  "location": "Kota/Kabupaten",
  "category": "alam|budaya",
  "description": "Deskripsi lengkap...",
  "rating": 4.5,
  "image": "https://...",
  "gallery": ["image1.jpg", "image2.jpg"],
  "facilities": ["Fasilitas 1", "Fasilitas 2"],
  "coordinates": {"lat": 0.0, "lng": 0.0},
  "ticketPrice": "IDR 10,000",
  "openingHours": "08:00 - 17:00",
  "bestTimeToVisit": "Pagi hari untuk cahaya terbaik"
}
```

### Adding New Hotels

Edit `src/data/hotels.json` dengan struktur serupa.

## 📊 Data Sources

Data destinasi dan hotel dikumpulkan dari berbagai sumber terpercaya termasuk:
- Google Reviews dan rating
- Website resmi pemerintah daerah
- Platform booking online
- Survey lapangan

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Explore Kaltara Team**
- Website: [https://explorekaltara.com](https://explorekaltara.com)
- Email: info@explorekaltara.com

## 🙏 Acknowledgments

- Pemerintah Provinsi Kalimantan Utara
- Dinas Pariwisata Kaltara
- Komunitas wisata lokal
- Unsplash untuk placeholder images

---

**Made with ❤️ for Kalimantan Utara**
