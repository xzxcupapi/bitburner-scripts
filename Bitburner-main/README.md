# Bitburner

Ini adalah skrip-skrip yang saya tulis untuk Game Bitburner. Sebelum saya memulai game ini, saya tidak bisa menulis kode sama sekali.

Bitburner adalah game inkremental berbasis pemrograman yang berkisar pada tema hacking dan cyberpunk. Game ini dapat dimainkan di [browser](https://bitburner-official.github.io/) atau diinstal melalui [Steam](https://store.steampowered.com/app/1812820/Bitburner/).

## Genesis

### collect.js

Tahap 1: beroperasi berdasarkan thread minimal.
Ini mencatat detail yang diperlukan seperti hostname, tindakan yang diperlukan (weak, grow, hack), dan thread yang dibutuhkan untuk setiap tindakan.
Setelah daftar lengkap, diurutkan berdasarkan jumlah thread, dan kemudian semua entri dalam jaringan diinstal.
Jika ada entri yang gagal diinstal sepenuhnya, skrip akan berhenti dan menunggu sampai jaringan kosong lagi sebelum melanjutkan dengan putaran instalasi berikutnya.

Tahap 2: beroperasi berdasarkan probabilitas.
Dalam proses ini, skrip akan mengiterasi melalui daftar server, dan jika ada probabilitas lebih dari 80%,
akan menghitung langkah-langkah yang diperlukan untuk meluncurkan serangan ke server. Ini kemudian diinstal dalam jaringan.
Tidak seperti collectstage1, skrip tidak memverifikasi apakah instalasi berhasil; dengan demikian, mengadopsi pendekatan yang agak lebih agresif.
Tidak akan pernah menggunakan lebih banyak thread daripada yang diperlukan untuk menjaga jaringan tetap tersedia untuk menjalankan sebanyak mungkin skrip.
Selain itu, di samping fokus pada probabilitas 80%, skrip lain yang disebut pre_weak.js diinisiasi di server rumah.
Skrip ini membantu membawa server yang berada di luar ambang probabilitas kembali ke dalam kisaran 80%.

> run collect.js

### hacknet.js

Skrip ini akan beroperasi secara otonom sampai semua argumen yang diberikan terpenuhi, pada saat itu akan berhenti. Jika tidak ada argumen yang diberikan, skrip akan secara otomatis membeli 4 node dengan 25 level, 2 gigabyte RAM, dan 1 core. Konfigurasi ini cukup untuk menerima undangan dari Netburners.

Skrip menerima argumen berikut:

- Jumlah node yang akan dibeli
- Jumlah level per node yang akan dibeli
- Jumlah RAM per node yang akan dibeli (dalam gigabyte)
- Jumlah core per node yang akan dibeli

`args: opsional`

> run hacknet.js 5 100 16 2

### pck\_\*.js

Skrip-skrip ini memiliki fungsi yang sama dengan sqn_gwh.js tetapi dipisahkan untuk kontrol yang lebih baik atas waktu dan thread. Argumen disediakan oleh collectStage3.js

- Melemahkan keamanan server, gunakan arg untuk menentukan server target dengan delay
- Menumbuhkan uang server, gunakan arg untuk menentukan server target dengan delay
- Meretas uang yang tersedia dari server, gunakan arg untuk menentukan server target dengan delay

`args diperlukan`

> run pck_grow.js sigma-cosmetics 2000

### server.js

Skrip ini akan terus membeli server hingga 32GB. Awalnya, akan membeli server dengan RAM 4GB. Setelah semua 24 server memiliki RAM 4GB, akan mengganti setiap server dengan versi RAM 8GB. Proses ini akan berlanjut, meningkatkan RAM setiap server hingga jumlah RAM 32GB tercapai. Skrip akan mempertimbangkan total RAM yang tersedia dalam jaringan. Jika penggunaan lebih dari 90% dari total RAM, skrip akan membeli upgrade.

> run servers.js

### sharePower.js

Ketika semua selesai, dan yang Anda tunggu hanyalah reputasi dari sebuah faksi, jalankan skrip ini. Jaringan akan dibanjiri dengan sharepower sehingga menunggu reputasi dapat berlangsung lebih cepat.

`flags --home --network`

> run sharePower.js

### stockmarket.js

Skrip pasar saham dirancang untuk mengumpulkan informasi tentang semua saham yang melebihi ambang batas pembelian atau di mana saham saat ini dipegang. Setelah dikumpulkan, data ini diurutkan untuk memprioritaskan peluang investasi. Berdasarkan analisis ini, saham kemudian dibeli sesuai. Sebaliknya, jika nilai saham turun di bawah ambang batas penjualan, skrip secara otomatis memicu penjualan semua saham terkait untuk mengurangi potensi kerugian. Untuk gambaran terperinci tentang status dan transaksi saat ini, Anda dapat merujuk ke log komprehensif yang dihasilkan oleh skrip.

`flags --sell`

> run stockmarket.js

## Singularity

### company.js

Saat memulai, Anda harus menentukan perusahaan yang ingin Anda bekerja dan reputasi maksimum yang ingin Anda capai di sana. Setelah Anda memberikan informasi ini, skrip akan mulai bekerja menuju tujuan yang ditentukan. Jika tidak ada argumen yang diberikan saat startup, skrip akan bekerja di 4sigma sampai mencapai status CEO, CFO, atau CTO. Ini seharusnya cukup untuk Silhouette, karena ini adalah salah satu persyaratan untuk bekerja untuk geng.

`args opsional` `flags --cfo`

> run company.js ECorp 400000

### core.js

core.js akan terus membeli selama skrip berjalan.

> run core.js

### crime.js

Saat memulai skrip, Anda perlu memberikan dua argumen: Kills dan Karma. Awalnya, akan fokus pada Kills, yang dicapai melalui pembunuhan. Setelah itu selesai, akan beralih ke Karma, yang dicapai melalui robStore. Jika poin kesehatan pemain menurun, kunjungan ke rumah sakit akan diprioritaskan. Setelah semua statistik ditangani, skrip akan menutup diri. crime.js adalah bagian dari fokus pada bekerja pada program, faksi, kelas, atau perusahaan, yang semuanya lebih diprioritaskan daripada kejahatan.

`args diperlukan`

> run crime.js 10 -45

### faction.js

faction.js adalah skrip manajemen untuk persyaratan, reputasi, instalasi, dan bitnode. Ketika faction.js dimulai tanpa flag, semua faksi termasuk dalam evaluasi. Jika dijalankan dengan flag, alur cerita akan memimpin. faction.js memeriksa setiap faksi, memilih augmentasi dengan nilai reputasi tertinggi. Berdasarkan ini, semua faksi diurutkan, dan yang memiliki nilai reputasi terendah dipilih untuk dikerjakan. Kemudian, memeriksa apakah faksi yang bersangkutan sudah mengirim undangan; jika tidak, skrip ini akan memulai skrip persyaratan. Setelah semua persyaratan terpenuhi, skrip ini akan kembali memeriksa undangan. Jika ada, skrip reputasi diinisiasi. Ketika semua reputasi diperoleh, kembali ke faction.js, yang kemudian melanjutkan ke install.js. Setelah instalasi, game dimulai ulang, langsung menjalankan skrip awal system.js, dan semuanya dimulai lagi. Jika tidak ada lagi faksi untuk dikerjakan, bitnode.js dimulai, dan game dimainkan secara otomatis.

`flags --story`

> run faction.js

### gym.js

Saat memulai skrip ini, Anda diminta untuk menentukan melalui argumen berapa banyak keterampilan yang ingin Anda peroleh. Saat memulai skrip, pertama-tama akan mencoba memasang backdoor pada server gym untuk diskon kecil. Kemudian, Anda akan diarahkan ke lokasi yang benar. Setelah itu, Anda akan mulai membangun keterampilan Anda sampai titik yang telah Anda tentukan. Setelah tujuan tercapai, skrip akan secara otomatis menutup diri.

keterampilan: str, def, dex, agi

`args diperlukan`

> run gym.js 20 20 20 20

### install.js

Skrip dimulai dengan nama faksi. Selanjutnya, skrip akan menutup semua skrip yang mengonsumsi uang seperti pasar saham, RAM, core, server, hacknet, dan program, dan semua saham akan dijual. Kemudian, daftar akan dicetak ke log yang berisi augmentasi yang akan dibeli. Setelah itu, augmentasi termahal akan diperoleh terlebih dahulu, turun ke yang termurah. Jika augmentasi yang memerlukan pra-instalasi akan dibeli, itu akan diperoleh terlebih dahulu. Setelah semua augmentasi dibeli, sisa dana akan dihabiskan untuk NeuroFlux. Jika Anda tidak lagi memiliki uang atau reputasi untuk membeli augmentasi berikutnya, semua augmentasi akan diinstal dan system.js akan di-boot.

`args diperlukan` `flags --neuroflux`

> run install.js NiteSec

### programs.js

Selama fokusnya, Programs akan selalu diprioritaskan di atas skrip serupa lainnya. Skrip ini berisi daftar program penting yang akan dibeli atau dibuat. Setelah semua program diperoleh, skrip akan ditutup untuk membebaskan ruang bagi skrip lain.

> run programs.js

### ram.js

Ram.js akan terus membeli selama skrip berjalan.

> run ram.js

### reputation.js

reputation.js bertanggung jawab untuk mencapai reputasi. Skrip harus dijalankan dengan nama faksi. Di log, Anda dapat menemukan ikhtisar yang memperkirakan total waktu, ringkasan reputasi yang diperoleh, dan persentase kemajuan menuju tujuan Anda. Jika Anda memiliki lebih dari 150 favor, skrip juga akan membeli reputasi jika saldo Anda melebihi 1t. reputation.js adalah bagian dari fokus dan diprioritaskan di atas semua aktivitas lain karena reputasi membutuhkan waktu paling lama untuk dicapai.

`args diperlukan`

> run reputation.js NiteSec

### requirement.js

Skrip requirement.js menangani prasyarat untuk setiap faksi. Yang perlu Anda berikan sebagai argumen hanyalah nama faksi. Setelah semua persyaratan terpenuhi, skrip akan kembali ke faction.js untuk melanjutkan dengan tindakan yang diperlukan.

`args diperlukan`

> run reputation.js

### school.js

Saat memulai skrip ini, Anda diminta untuk menentukan melalui argumen berapa banyak karisma yang ingin Anda peroleh. Saat memulai skrip, pertama-tama akan mencoba memasang backdoor pada server sekolah untuk diskon kecil. Kemudian, Anda akan diarahkan ke lokasi yang benar. Setelah itu, Anda akan mulai membangun karisma Anda sampai titik yang telah Anda tentukan. Setelah tujuan tercapai, skrip akan secara otomatis menutup diri.

`args diperlukan`

> run school.js 375
