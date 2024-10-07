/** @param {NS} ns **/
export async function main(ns) {
  // Fungsi untuk memindai semua server
  function scanAllServers() {
    let serversToScan = ["home"];
    let scannedServers = new Set();
    let allServers = [];

    while (serversToScan.length > 0) {
      let currentServer = serversToScan.pop();
      if (!scannedServers.has(currentServer)) {
        scannedServers.add(currentServer);
        allServers.push(currentServer);
        serversToScan = serversToScan.concat(ns.scan(currentServer));
      }
    }

    return allServers;
  }

  // Mendapatkan daftar semua server
  let allServers = scanAllServers();
  let serverInfo = [];

  // Loop melalui semua server dan kumpulkan informasi
  for (let server of allServers) {
    const moneyAvailable = ns.getServerMoneyAvailable(server);
    const requiredHackingLevel = ns.getServerRequiredHackingLevel(server);
    const currentHackingLevel = ns.getHackingLevel();
    const ramAvailable = ns.getServerMaxRam(server); // Mendapatkan RAM yang tersedia
    const hasRootAccess = ns.hasRootAccess(server);

    // Memeriksa apakah stolen.js sedang berjalan di server ini
    const runningScripts = ns.ps(server); // Mengambil daftar skrip yang sedang berjalan
    const isStolenRunning = runningScripts.some(
      (script) => script.filename === "stolen.js"
    );

    // Hanya menambahkan server yang menjalankan stolen.js dan memiliki akses root
    if (isStolenRunning && hasRootAccess) {
      serverInfo.push({
        server: server,
        moneyAvailable: moneyAvailable,
        requiredHackingLevel: requiredHackingLevel,
        currentHackingLevel: currentHackingLevel,
        hasRootAccess: hasRootAccess,
        ramAvailable: ramAvailable, // Menyimpan RAM yang tersedia
        isStolenRunning: isStolenRunning, // Menyimpan status apakah stolen.js berjalan
      });
    }
  }

  // Mengurutkan server berdasarkan level hacking yang diperlukan
  serverInfo.sort((a, b) => {
    // Pertama, urutkan berdasarkan level hacking yang diperlukan
    return a.requiredHackingLevel - b.requiredHackingLevel;
  });

  // Membuat string hasil untuk disimpan ke file
  let result = "";
  let serverCount = 1; // Menambahkan counter untuk nomor server

  for (let info of serverInfo) {
    result += `Server ${serverCount}: ${info.server}\n`; // Menambahkan nomor di depan server
    result += `  Uang yang tersedia: $${info.moneyAvailable.toLocaleString()}\n`;
    result += `  Level hacking yang diperlukan: ${info.requiredHackingLevel}\n`;
    result += `  Level hacking saat ini: ${info.currentHackingLevel}\n`;
    result += `  Akses Root: ${info.hasRootAccess ? "Ya" : "Tidak"}\n`;
    result += `  RAM yang dimiliki: ${info.ramAvailable} GB\n`; // Menampilkan RAM
    result += `  Stolen.js aktif: ${info.isStolenRunning ? "Ya" : "Tidak"}\n`; // Menampilkan status stolen.js
    result += `\n`; // Menambahkan garis kosong untuk pemisah
    serverCount++; // Menambah counter untuk server berikutnya
  }

  // Menyimpan hasil ke file AllDone.txt
  await ns.write("AllDone.txt", result, "w"); // Menyimpan hasil ke file

  ns.tprint("Informasi server telah disimpan di AllDone.txt");
}
