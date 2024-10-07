/** @param {NS} ns **/
export async function main(ns) {
  // Mengambil nama server dari argumen
  const server = ns.args[0] || "home"; // Gunakan argumen pertama atau "home" jika tidak ada argumen

  // Mendapatkan informasi RAM
  const totalRam = ns.getServerMaxRam(server); // Total RAM
  const usedRam = ns.getServerUsedRam(server); // RAM yang digunakan
  const freeRam = totalRam - usedRam; // RAM yang tersedia

  // Mendapatkan informasi uang
  const money = ns.getServerMoneyAvailable(server); // Uang yang tersedia
  const minHackingLevel = ns.getServerRequiredHackingLevel(server); // Level hacking yang diperlukan
  const hasRootAccess = ns.hasRootAccess(server); // Status akses root

  // Menampilkan informasi
  ns.tprint(`Server: ${server}`);
  ns.tprint(`Total RAM: ${totalRam.toFixed(2)} GB`); // Total RAM dalam GB
  ns.tprint(`Used RAM: ${usedRam.toFixed(2)} GB`); // RAM yang digunakan dalam GB
  ns.tprint(`Free RAM: ${freeRam.toFixed(2)} GB`); // RAM yang tersedia dalam GB
  ns.tprint(`Money Available: $${ns.nFormat(money, "0.0a")}`); // Uang yang tersedia
  ns.tprint(`Required Hacking Level: ${minHackingLevel}`); // Level hacking yang diperlukan
  ns.tprint(`Root Access: ${hasRootAccess ? "Yes" : "No"}`); // Status akses root
}
