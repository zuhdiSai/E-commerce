import PolicyPageLayout, { PolicySection } from '@/layouts/policy-page-layout';
import { Link } from '@inertiajs/react';

type StoreInfo = {
    name: string;
    email: string;
    phone: string;
};

type Props = {
    storeInfo: StoreInfo;
};

export default function PrivacyPolicy({ storeInfo }: Props) {
    const sections: PolicySection[] = [
        { id: 'pendahuluan', title: 'Pendahuluan' },
        { id: 'data-dikumpulkan', title: 'Data yang Dikumpulkan' },
        { id: 'tujuan', title: 'Tujuan Penggunaan Data' },
        { id: 'penyimpanan', title: 'Penyimpanan & Keamanan Data' },
        { id: 'hak-pengguna', title: 'Hak Pengguna' },
        { id: 'cookie', title: 'Penggunaan Cookie' },
        { id: 'perubahan', title: 'Perubahan Kebijakan' },
        { id: 'kontak', title: 'Hubungi Kami' },
    ];

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <PolicyPageLayout title="Kebijakan Privasi" lastUpdated={today} sections={sections}>
            <section id="pendahuluan" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Pendahuluan</h2>
                <p>
                    Selamat datang di {storeInfo.name}. Kami sangat menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, melindungi, dan memproses data pribadi Anda ketika Anda mengakses situs web dan layanan kami. Kebijakan ini disusun dengan mengacu pada <strong>Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi</strong> yang berlaku di Republik Indonesia.
                </p>
                <p className="mt-4">
                    Dengan menggunakan layanan kami, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini.
                </p>
            </section>

            <section id="data-dikumpulkan" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Data yang Dikumpulkan</h2>
                <p>Kami dapat mengumpulkan berbagai jenis informasi pribadi untuk menyediakan dan meningkatkan layanan kami kepada Anda, termasuk namun tidak terbatas pada:</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li><strong>Informasi Identitas:</strong> Nama lengkap.</li>
                    <li><strong>Informasi Kontak:</strong> Alamat email, nomor telepon, dan alamat pengiriman.</li>
                    <li><strong>Informasi Transaksi:</strong> Riwayat pesanan, produk yang dibeli, dan metode pembayaran (kami tidak menyimpan nomor kartu kredit/debit secara penuh).</li>
                    <li><strong>Informasi Teknis:</strong> Alamat IP, jenis browser, waktu akses, dan halaman yang dikunjungi saat Anda menggunakan situs kami.</li>
                </ul>
            </section>

            <section id="tujuan" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Tujuan Penggunaan Data</h2>
                <p>Data pribadi yang kami kumpulkan akan digunakan untuk tujuan berikut:</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li>Memproses, memverifikasi, dan mengirimkan pesanan Anda.</li>
                    <li>Berkomunikasi dengan Anda terkait status transaksi, pengiriman, dan layanan pelanggan.</li>
                    <li>Mengirimkan penawaran promosi atau buletin berita (hanya jika Anda telah berlangganan).</li>
                    <li>Meningkatkan kualitas layanan, antarmuka pengguna, dan pengalaman belanja di situs kami.</li>
                    <li>Mencegah aktivitas penipuan dan menjaga keamanan akun Anda.</li>
                </ul>
            </section>

            <section id="penyimpanan" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Penyimpanan dan Keamanan Data</h2>
                <p>
                    Keamanan data pribadi Anda sangat penting bagi kami. Kami menyimpan data Anda dalam lingkungan yang aman dan menerapkan standar keamanan yang wajar untuk mencegah akses, pengungkapan, perubahan, atau penghancuran yang tidak sah. 
                </p>
                <p className="mt-4">
                    Kami <strong>tidak akan menjual, menyewakan, atau membagikan</strong> informasi pribadi Anda kepada pihak ketiga tanpa izin Anda, kecuali kepada mitra logistik dan pembayaran yang esensial untuk memproses pesanan Anda, atau jika diwajibkan oleh hukum.
                </p>
            </section>

            <section id="hak-pengguna" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Hak Pengguna</h2>
                <p>Sebagai pengguna, Anda memiliki hak penuh atas data pribadi Anda:</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li><strong>Hak Akses:</strong> Anda berhak melihat data profil dan riwayat transaksi Anda melalui halaman akun.</li>
                    <li><strong>Hak Memperbaiki:</strong> Anda berhak memperbarui alamat atau informasi kontak yang tidak akurat.</li>
                    <li><strong>Hak Menghapus:</strong> Anda berhak meminta penghapusan akun beserta data pribadi Anda dari sistem kami dengan menghubungi layanan pelanggan.</li>
                </ul>
            </section>

            <section id="cookie" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Penggunaan Cookie</h2>
                <p>
                    Situs kami menggunakan <em>cookie</em>—file teks kecil yang disimpan di perangkat Anda—untuk memastikan fungsionalitas dasar seperti mengingat isi keranjang belanja Anda dan preferensi sesi login Anda. Cookie membantu kami menganalisis lalu lintas web dan menyesuaikan situs dengan kebutuhan Anda. Anda dapat mengatur browser Anda untuk menolak cookie, namun hal ini mungkin mempengaruhi beberapa fungsi situs kami.
                </p>
            </section>

            <section id="perubahan" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Perubahan Kebijakan</h2>
                <p>
                    Kami berhak memperbarui Kebijakan Privasi ini sewaktu-waktu untuk menyesuaikan dengan perubahan operasional atau regulasi hukum. Jika kami melakukan perubahan material, kami akan memberi tahu Anda melalui email atau melalui pemberitahuan yang menonjol di situs web kami sebelum perubahan tersebut berlaku efektif.
                </p>
            </section>

            <section id="kontak" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Hubungi Kami</h2>
                <p>
                    Jika Anda memiliki pertanyaan, kekhawatiran, atau keluhan mengenai Kebijakan Privasi ini atau pengelolaan data pribadi Anda, jangan ragu untuk menghubungi kami melalui:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li>Email: <a href={`mailto:${storeInfo.email}`} className="text-indigo-600 hover:underline">{storeInfo.email}</a></li>
                    <li>Halaman Kontak: <Link href="/kontak" className="text-indigo-600 hover:underline">Kirim Pesan</Link></li>
                </ul>
            </section>
        </PolicyPageLayout>
    );
}
