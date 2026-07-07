import PolicyPageLayout, { PolicySection } from '@/layouts/policy-page-layout';

type StoreInfo = {
    name: string;
};

type Props = {
    storeInfo: StoreInfo;
};

export default function TermsConditions({ storeInfo }: Props) {
    const sections: PolicySection[] = [
        { id: 'pendahuluan', title: 'Pendahuluan' },
        { id: 'akun', title: 'Akun Pengguna' },
        { id: 'pemesanan', title: 'Pemesanan & Pembayaran' },
        { id: 'harga', title: 'Harga & Ketersediaan' },
        { id: 'pengiriman', title: 'Pengiriman Barang' },
        { id: 'pembatalan', title: 'Pembatalan Pesanan' },
        { id: 'hki', title: 'Hak Kekayaan Intelektual' },
        { id: 'tanggung-jawab', title: 'Batasan Tanggung Jawab' },
        { id: 'hukum', title: 'Hukum yang Berlaku' },
        { id: 'perubahan', title: 'Perubahan Syarat' },
    ];

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <PolicyPageLayout title="Syarat & Ketentuan" lastUpdated={today} sections={sections}>
            <section id="pendahuluan" className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Pendahuluan</h2>
                <p>
                    Selamat datang di situs web {storeInfo.name}. Syarat & Ketentuan ini mengatur penggunaan situs web kami dan pembelian produk yang tersedia di dalamnya. 
                </p>
                <p className="mt-4">
                    Dengan mendaftar, mengakses, atau melakukan transaksi di situs ini, Anda dianggap telah membaca, memahami, dan menyetujui secara sadar seluruh Syarat & Ketentuan yang berlaku. Jika Anda tidak menyetujui salah satu bagian dari ketentuan ini, Anda dipersilakan untuk tidak menggunakan layanan kami.
                </p>
            </section>

            <section id="akun" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Akun Pengguna</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Anda diwajibkan untuk memberikan informasi identitas, kontak, dan alamat pengiriman yang akurat dan lengkap saat membuat akun atau melakukan *checkout*.</li>
                    <li>Anda sepenuhnya bertanggung jawab untuk menjaga kerahasiaan kata sandi (password) akun Anda dan bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda.</li>
                    <li>Kami berhak untuk membekukan atau menghapus akun pengguna tanpa pemberitahuan sebelumnya jika ditemukan adanya aktivitas mencurigakan, penipuan, atau pelanggaran terhadap Syarat & Ketentuan ini.</li>
                </ul>
            </section>

            <section id="pemesanan" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Pemesanan dan Pembayaran</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Setiap pesanan yang dibuat tunduk pada penerimaan dan ketersediaan barang.</li>
                    <li>Setelah melakukan pemesanan, Anda akan menerima email konfirmasi pesanan. Status pesanan resmi diterima hanya ketika statusnya berubah menjadi "Diproses" atau pembayaran telah diverifikasi oleh sistem.</li>
                    <li>Kami menerima berbagai metode pembayaran resmi yang tertera di halaman *checkout*. Anda setuju untuk membayar jumlah total yang tertera, termasuk harga produk, biaya pengiriman, dan biaya penanganan (jika ada).</li>
                </ul>
            </section>

            <section id="harga" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Harga dan Ketersediaan Produk</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Harga produk yang dicantumkan di situs dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Namun, perubahan harga tidak akan memengaruhi pesanan yang sudah berhasil dikonfirmasi dan dibayar.</li>
                    <li>Meskipun kami berusaha keras memastikan akurasi stok, terkadang ketersediaan barang dapat berubah cepat. Jika produk yang Anda pesan ternyata habis stoknya setelah Anda membayar, kami akan segera menghubungi Anda untuk menawarkan alternatif penggantian atau pengembalian dana 100%.</li>
                </ul>
            </section>

            <section id="pengiriman" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Pengiriman Barang</h2>
                <p>
                    Estimasi waktu pengiriman bergantung pada lokasi tujuan dan mitra logistik yang dipilih. Kami akan menyerahkan paket kepada kurir secepat mungkin, namun kami tidak bertanggung jawab atas keterlambatan pengiriman yang murni diakibatkan oleh pihak kurir pihak ketiga (force majeure operasional kurir). Risiko kehilangan atau kerusakan barang beralih kepada Anda saat barang telah diterima.
                </p>
            </section>

            <section id="pembatalan" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Pembatalan Pesanan</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Oleh Pembeli:</strong> Pembatalan dapat dilakukan selama status pesanan belum "Diproses" atau "Dikirim". Jika sudah dikirim, maka akan merujuk pada Kebijakan Pengembalian.</li>
                    <li><strong>Oleh Penjual:</strong> Kami berhak membatalkan pesanan sepihak apabila terdapat kesalahan sistem dalam pencantuman harga (harga tidak wajar), stok habis, atau dugaan indikasi penipuan pesanan. Jika dibatalkan, kami akan mengembalikan dana penuh.</li>
                </ul>
            </section>

            <section id="hki" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Hak Kekayaan Intelektual</h2>
                <p>
                    Seluruh konten yang terdapat pada situs ini, termasuk namun tidak terbatas pada teks, grafik, logo, gambar, foto produk, dan kode sumber (source code) adalah milik eksklusif {storeInfo.name} atau pihak ketiga yang melisensikannya kepada kami, dan dilindungi oleh undang-undang hak cipta. Dilarang keras mereproduksi, mendistribusikan, atau menggunakan material tersebut untuk tujuan komersial tanpa izin tertulis.
                </p>
            </section>

            <section id="tanggung-jawab" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Batasan Tanggung Jawab</h2>
                <p>
                    Kami menyediakan situs dan layanan ini sebagaimana adanya ("as is"). {storeInfo.name} tidak akan bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial, termasuk hilangnya keuntungan atau data, yang timbul dari penggunaan atau ketidakmampuan menggunakan situs web kami.
                </p>
            </section>

            <section id="hukum" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. Hukum yang Berlaku</h2>
                <p>
                    Syarat & Ketentuan ini tunduk pada, dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap perselisihan yang timbul dari perjanjian ini akan diselesaikan secara musyawarah, dan apabila gagal, akan diselesaikan di pengadilan yang memiliki yurisdiksi di wilayah domisili {storeInfo.name}.
                </p>
            </section>

            <section id="perubahan" className="scroll-mt-32 mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">10. Perubahan Syarat & Ketentuan</h2>
                <p>
                    Kami berhak merevisi atau memodifikasi Syarat & Ketentuan ini kapan saja. Perubahan akan segera berlaku setelah dipublikasikan di halaman ini. Penggunaan berkelanjutan Anda atas situs ini mengindikasikan penerimaan Anda terhadap Syarat & Ketentuan yang telah direvisi.
                </p>
            </section>
        </PolicyPageLayout>
    );
}
