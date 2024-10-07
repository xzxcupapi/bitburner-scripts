/** @param {NS} ns **/
export async function main(ns) {
  const targetServer = ns.args[0]; // Server tujuan

  // Pastikan server tujuan ada
  if (!ns.serverExists(targetServer)) {
    ns.tprint(`ERROR: Server '${targetServer}' tidak ditemukan.`);
    return;
  }

  // Cek apakah server sudah memiliki akses root
  if (ns.hasRootAccess(targetServer)) {
    ns.tprint(`Anda sudah memiliki akses root ke ${targetServer}.`);
  } else {
    // Cek jumlah port yang diperlukan untuk mendapatkan akses root
    const portsRequired = ns.getServerNumPortsRequired(targetServer); // Jumlah port yang diperlukan
    let openPorts = 0;

    // Menggunakan program untuk membuka port jika tersedia
    if (ns.fileExists("BruteSSH.exe", "home")) {
      ns.brutessh(targetServer);
      openPorts++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
      ns.ftpcrack(targetServer);
      openPorts++;
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
      ns.relaysmtp(targetServer);
      openPorts++;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
      ns.httpworm(targetServer);
      openPorts++;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
      ns.sqlinject(targetServer);
      openPorts++;
    }

    if (openPorts < portsRequired) {
      ns.tprint(
        `Tidak cukup port terbuka untuk mendapatkan akses ke ${targetServer}.`
      );
      ns.tprint(
        `Port yang dibutuhkan: ${portsRequired}, Port terbuka: ${openPorts}`
      );
      return;
    }

    // Menggunakan nuke.exe untuk mendapatkan akses root
    ns.tprint(`Mencoba mendapatkan akses root ke ${targetServer}...`);
    ns.nuke(targetServer); // Mendapatkan akses root

    // Cek kembali apakah akses berhasil
    if (ns.hasRootAccess(targetServer)) {
      ns.tprint(`Berhasil mendapatkan akses root ke ${targetServer}!`);

      // Menyalin stolen.js ke server tujuan
      await ns.scp("stolen.js", targetServer);
      ns.tprint(`stolen.js telah disalin ke ${targetServer}.`);
    } else {
      ns.tprint(`Gagal mendapatkan akses root ke ${targetServer}.`);
      return; // Menghentikan eksekusi jika akses gagal
    }
  }

  // Jalankan script 'path.js' untuk mendapatkan path ke target server
  const path = await ns.run("path.js", 1, targetServer);

  // Tunggu sampai path.js selesai berjalan dan hasilnya ada
  while (ns.isRunning(path)) {
    await ns.sleep(200); // Memberi jeda untuk menunggu path.js selesai
  }

  // Ambil hasil dari path.js (asumsi path.js mengembalikan jalur ke server)
  const serverPath = ns.read("path.txt").split(",");

  if (serverPath.length === 0 || serverPath[0] === "") {
    ns.tprint(`ERROR: Jalur ke server '${targetServer}' tidak ditemukan.`);
    return;
  }

  // Koneksi ke setiap server dalam jalur
  for (const server of serverPath) {
    ns.singularity.connect(server);
  }

  // Install backdoor di server tujuan
  ns.tprint(`Menghubungkan ke '${targetServer}'...`);
  await ns.singularity.connect(targetServer);
  await ns.singularity.installBackdoor();
  ns.tprint(`Backdoor berhasil diinstall di '${targetServer}'!`);

  // Mendapatkan dan mencetak RAM yang dimiliki server target
  const ramAvailable = ns.getServerMaxRam(targetServer); // Mendapatkan RAM maksimum
  const ramUsed = ns.getServerUsedRam(targetServer); // Mendapatkan RAM yang digunakan
  const ramFree = ramAvailable - ramUsed; // Menghitung RAM yang tersedia

  ns.tprint(`RAM yang dimiliki oleh ${targetServer}:`);
  ns.tprint(`  RAM Maksimum: ${ramAvailable} GB`);
  ns.tprint(`  RAM Digunakan: ${ramUsed} GB`);
  ns.tprint(`  RAM Tersedia: ${ramFree} GB`);
}
