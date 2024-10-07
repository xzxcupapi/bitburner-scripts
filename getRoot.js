/** @param {NS} ns **/
export async function main(ns) {
  // Mengambil nama server dari argumen
  const target = ns.args[0] || "home";

  // Cek apakah server sudah memiliki akses root
  if (ns.hasRootAccess(target)) {
    ns.tprint(`Anda sudah memiliki akses root ke ${target}.`);
    return;
  }

  // Cek jumlah port yang diperlukan untuk mendapatkan akses root
  const portsRequired = ns.getServerNumPortsRequired(target); // Jumlah port yang diperlukan
  let openPorts = 0;

  // Menggunakan program untuk membuka port jika tersedia
  if (ns.fileExists("BruteSSH.exe", "home")) {
    ns.brutessh(target);
    openPorts++;
  }
  if (ns.fileExists("FTPCrack.exe", "home")) {
    ns.ftpcrack(target);
    openPorts++;
  }
  if (ns.fileExists("relaySMTP.exe", "home")) {
    ns.relaysmtp(target);
    openPorts++;
  }
  if (ns.fileExists("HTTPWorm.exe", "home")) {
    ns.httpworm(target);
    openPorts++;
  }
  if (ns.fileExists("SQLInject.exe", "home")) {
    ns.sqlinject(target);
    openPorts++;
  }

  if (openPorts < portsRequired) {
    ns.tprint(`Tidak cukup port terbuka untuk mendapatkan akses ke ${target}.`);
    ns.tprint(
      `Port yang dibutuhkan: ${portsRequired}, Port terbuka: ${openPorts}`
    );
    return;
  }

  // Menggunakan nuke.exe untuk mendapatkan akses root
  ns.tprint(`Mencoba mendapatkan akses root ke ${target}...`);
  ns.nuke(target); // Mendapatkan akses root

  // Cek kembali apakah akses berhasil
  if (ns.hasRootAccess(target)) {
    ns.tprint(`Berhasil mendapatkan akses root ke ${target}!`);

    // Menyalin stolen.js ke server tujuan
    await ns.scp("stolen.js", target);
    ns.tprint(`stolen.js telah disalin ke ${target}.`);
  } else {
    ns.tprint(`Gagal mendapatkan akses root ke ${target}.`);
    return; // Menghentikan eksekusi jika akses gagal
  }

  // Mendapatkan dan mencetak RAM yang dimiliki server target
  const ramAvailable = ns.getServerMaxRam(target); // Mendapatkan RAM maksimum
  const ramUsed = ns.getServerUsedRam(target); // Mendapatkan RAM yang digunakan
  const ramFree = ramAvailable - ramUsed; // Menghitung RAM yang tersedia

  ns.tprint(`RAM yang dimiliki oleh ${target}:`);
  ns.tprint(`  RAM Maksimum: ${ramAvailable} GB`);
  ns.tprint(`  RAM Digunakan: ${ramUsed} GB`);
  ns.tprint(`  RAM Tersedia: ${ramFree} GB`);
}
