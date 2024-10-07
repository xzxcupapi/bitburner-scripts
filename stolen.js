/** @param {NS} ns **/
export async function main(ns) {
  // Mengambil nama server dari argumen
  const target = ns.args[0] || "home"; // Gunakan argumen pertama atau "omega-net" jika tidak ada argumen

  while (true) {
    // Cek apakah server memiliki uang yang cukup untuk dicuri
    const moneyAvailable = ns.getServerMoneyAvailable(target);
    const moneyMax = ns.getServerMaxMoney(target);

    if (moneyAvailable > 0) {
      // Hack server dan dapatkan uang
      const stolen = await ns.hack(target);
      ns.print(
        `Telah berhasil mencuri uang sebanyak $${stolen} dari ${target}`
      );
    } else {
      ns.print(`Uang di ${target} sudah habis.`);
    }
  }
}
