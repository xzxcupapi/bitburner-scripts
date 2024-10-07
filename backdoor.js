// /** @param {NS} ns **/
// export async function main(ns) {
//   // Periksa apakah nama server diberikan sebagai argumen
//   if (ns.args.length < 1) {
//     ns.tprint("USAGE: run backdoor.js <server>");
//     return;
//   }

//   const target = ns.args[0];

//   // Periksa apakah server ada
//   if (!ns.serverExists(target)) {
//     ns.tprint(`ERROR: Server '${target}' tidak ditemukan.`);
//     return;
//   }

//   // Periksa apakah kita memiliki akses root ke server
//   if (!ns.hasRootAccess(target)) {
//     ns.tprint(`ERROR: Anda tidak memiliki akses root ke '${target}'.`);
//     return;
//   }

//   // Periksa apakah kita memiliki level hacking yang cukup
//   if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(target)) {
//     ns.tprint(
//       `ERROR: Level hacking Anda tidak cukup untuk backdoor '${target}'.`
//     );
//     return;
//   }

//   // Hubungkan ke server target
//   ns.tprint(`Menghubungkan ke '${target}'...`);
//   await ns.singularity.connect(target);

//   // Install backdoor
//   ns.tprint(`Menginstall backdoor di '${target}'...`);
//   await ns.singularity.installBackdoor();
//   ns.tprint(`Backdoor berhasil diinstall di '${target}'!`);

//   // Kembali ke home server
//   await ns.singularity.connect("home");
// }

/** @param {NS} ns **/
export async function main(ns) {
  const targetServer = ns.args[0]; // Server tujuan

  // Pastikan server tujuan ada
  if (!ns.serverExists(targetServer)) {
    ns.tprint(`ERROR: Server '${targetServer}' tidak ditemukan.`);
    return;
  }

  // Jalankan script 'path.js' untuk mendapatkan path ke target server
  const path = await ns.run("path.js", 1, targetServer);

  // Tunggu sampai path.js selesai berjalan dan hasilnya ada
  if (ns.isRunning(path)) {
    await ns.sleep(200); // Memberi jeda untuk menunggu path.js selesai
  }

  // Ambil hasil dari path.js (asumsi path.js mengembalikan array jalur)
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
}
