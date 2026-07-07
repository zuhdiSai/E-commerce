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

export default function ReturnPolicy({ storeInfo }: Props) {
    const sections: PolicySection[] = [
        { id: 'ketentuan-umum', title: 'Ketentuan Umum' },
        { id: 'bisa-diretur', title: 'Kondisi yang Bisa Diretur' },
        { id: 'tidak-bisa-diretur', title: 'Barang Tidak Bisa Diretur' },
        { id: 'alasan-retur', title: 'Alasan Retur yang Diterima' },
        { id: 'cara-pengajuan', title: 'Cara Mengajukan Retur' },
        { id: 'refund', title: 'Proses Pengembalian Dana' },
        { id: 'biaya-kirim', title: 'Biaya Pengiriman Retur' },
    ];

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <PolicyPageLayout title="Kebijakan Pengembalian" lastUpdated={today} sections={sections}>
            <section id="ketentuan-umum" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Ketentuan Umum</h2>
                <p>
                    Kami di {storeInfo.name} ingin memastikan Anda sepenuhnya puas dengan produk yang Anda beli. Jika Anda tidak puas dengan pesanan Anda karena cacat produksi atau kesalahan pengiriman, Anda dapat mengajukan permintaan pengembalian barang (retur) dalam waktu <strong>7 hari sejak barang diterima</strong> menurut sistem resi kurir pengiriman.
                </p>
                <p className="mt-4 text-rose-600 dark:text-rose-400 font-medium">
                    Permintaan pengembalian yang diajukan lebih dari 7 hari setelah barang diterima tidak dapat kami proses.
                </p>
            </section>

            <section id="bisa-diretur" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Kondisi Barang yang Bisa Diretur</h2>
                <p>Agar memenuhi syarat untuk diretur, barang harus memenuhi semua kondisi berikut:</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li>Barang belum pernah digunakan, dicuci, atau dipakai.</li>
                    <li>Semua tag, label harga, dan stiker merek masih terpasang utuh pada posisinya.</li>
                    <li>Barang harus berada dalam kemasan aslinya (misalnya kotak sepatu, polybag jaket) yang belum rusak parah.</li>
                </ul>
            </section>

            <section id="tidak-bisa-diretur" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Barang yang Tidak Bisa Diretur</h2>
                <p>Untuk alasan kebersihan dan kebijakan final sale, item berikut <strong>TIDAK</strong> dapat dikembalikan atau ditukar:</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li>Pakaian dalam (underwear), kaus kaki, dan pakaian renang.</li>
                    <li>Aksesoris tertentu (anting, masker, dsb).</li>
                    <li>Produk custom atau barang pre-order yang dibuat sesuai pesanan spesifik pembeli.</li>
                    <li>Barang diskon besar (Flash Sale atau kategori *Clearance/Final Sale*), kecuali barang tersebut diterima dalam keadaan cacat pabrik.</li>
                </ul>
            </section>

            <section id="alasan-retur" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Alasan Retur yang Diterima</h2>
                <p>Kami hanya akan menyetujui pengembalian jika terjadi hal-hal berikut:</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li><strong>Cacat Produksi:</strong> Produk memiliki kerusakan bawaan pabrik (jahitan lepas parah, resleting rusak, noda yang tidak bisa hilang).</li>
                    <li><strong>Salah Kirim:</strong> Kami mengirimkan barang dengan varian ukuran (size), warna, atau model yang berbeda dari detail invoice pesanan Anda.</li>
                    <li><strong>Tidak Sesuai Deskripsi:</strong> Spesifikasi fisik produk sangat jauh berbeda dengan deskripsi yang tertera di halaman produk.</li>
                </ul>
                <p className="mt-4 italic text-slate-500">Catatan: Sedikit perbedaan warna akibat pencahayaan layar monitor/ponsel bukan merupakan alasan cacat yang valid.</p>
            </section>

            <section id="cara-pengajuan" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Cara Mengajukan Retur</h2>
                <ol className="list-decimal pl-5 mt-4 space-y-3">
                    <li><strong>Hubungi Kami:</strong> Silakan masuk ke halaman <Link href="/kontak" className="text-indigo-600 hover:underline">Kontak</Link> atau email ke {storeInfo.email} dalam waktu maksimal 7 hari setelah terima barang.</li>
                    <li><strong>Sertakan Bukti:</strong> Wajib melampirkan (1) Nomor Pesanan, (2) Foto atau video unboxing yang jelas menunjukkan cacat/kesalahan barang. Tanpa bukti foto/video *unboxing*, klaim dapat ditolak.</li>
                    <li><strong>Tunggu Konfirmasi:</strong> Tim Customer Service kami akan meninjau dan merespons dalam 1-2 hari kerja.</li>
                    <li><strong>Kirim Barang:</strong> Jika disetujui, kami akan memberikan alamat gudang pengembalian. Anda harus mengirimkan barang kembali dalam waktu 3 hari sejak persetujuan.</li>
                </ol>
            </section>

            <section id="refund" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Proses Pengembalian Dana (Refund)</h2>
                <p>
                    Setelah paket retur tiba di gudang dan lolos inspeksi kualitas (kondisi memenuhi syarat), kami akan memproses pengembalian dana atau penukaran barang baru dalam waktu <strong>3-7 hari kerja</strong>. Pengembalian dana akan dikirim ke metode pembayaran asli Anda atau melalui transfer bank yang akan kami konfirmasi kembali ke Anda.
                </p>
            </section>

            <section id="biaya-kirim" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Biaya Pengiriman Retur</h2>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li>Jika retur dikarenakan murni kesalahan kami (barang cacat, salah ukuran/warna kirim), <strong>kami yang akan menanggung penuh</strong> biaya pengiriman retur Anda.</li>
                    <li>Kami tidak melayani retur karena alasan "berubah pikiran" (change of mind) atau salah pilih ukuran/warna dari pihak pembeli.</li>
                </ul>
            </section>
        </PolicyPageLayout>
    );
}
