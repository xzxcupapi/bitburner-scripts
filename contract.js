/** @param {NS} ns **/
export async function main(ns) {
  const servers = ns.scan("home"); // Mulai dari home

  // Array untuk menyimpan semua server yang telah dikunjungi
  const visitedServers = new Set(servers);
  const toVisit = [...servers];

  while (toVisit.length > 0) {
    const currentServer = toVisit.pop();

    // Mengambil kontrak dari server saat ini
    const contracts = ns.ls(currentServer, ".cct"); // Mengambil semua file kontrak dengan ekstensi .cct

    // Hanya mencetak jika kontrak ditemukan
    if (contracts.length > 0) {
      ns.tprint(`Kontrak ditemukan di ${currentServer}:`);
      for (const contract of contracts) {
        ns.tprint(`  - ${contract}`);
      }

      // Menambahkan baris kosong setelah mencetak kontrak
      ns.tprint(""); // Baris kosong
    }

    // Menambahkan server yang terhubung untuk dijelajahi
    const connectedServers = ns.scan(currentServer);
    for (const server of connectedServers) {
      if (!visitedServers.has(server)) {
        visitedServers.add(server);
        toVisit.push(server);
      }
    }
  }
}
