/** @param {NS} ns **/
export async function main(ns) {
  // Ambil nama server dari argumen
  const target = ns.args[0];

  if (!target) {
    ns.tprint("Silakan masukkan nama server sebagai argumen.");
    return;
  }

  // Fungsi untuk menemukan jalur ke server tujuan
  function findPath(currentServer, targetServer, visited) {
    // Tandai server saat ini sebagai dikunjungi
    visited.add(currentServer);

    // Jika server saat ini adalah server tujuan, kembalikan jalur
    if (currentServer === targetServer) {
      return [currentServer];
    }

    // Mendapatkan server yang terhubung
    const connectedServers = ns.scan(currentServer);

    for (const server of connectedServers) {
      // Jika server belum dikunjungi, lakukan pencarian rekursif
      if (!visited.has(server)) {
        const path = findPath(server, targetServer, visited);
        if (path) {
          return [currentServer, ...path]; // Kembalikan jalur
        }
      }
    }

    return null; // Jika tidak ditemukan jalur
  }

  // Mencari jalur dari home ke server tujuan
  const visited = new Set();
  const path = findPath("home", target, visited);

  if (path) {
    ns.tprint(`Jalur ke ${target}: ${path.join(" -> ")}`);
    // Simpan jalur ke dalam file
    ns.write("path.txt", path.join(","), "w");
  } else {
    ns.tprint(`Tidak dapat menemukan jalur ke ${target}.`);
  }
}
