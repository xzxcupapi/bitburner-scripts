/** @param {NS} ns **/
export async function main(ns) {
  const serverName = ns.args[0] || "n00dles"; // Server target

  // Memastikan Formulas API tersedia
  if (!ns.formulas) {
    ns.tprint("Formulas API tidak tersedia.");
    return;
  }

  const server = ns.getServer(serverName); // Dapatkan informasi server
  const player = ns.getPlayer(); // Dapatkan informasi pemain

  // Menggunakan Formulas API untuk menghitung waktu hack
  const hackTime = ns.formulas.hacking.hackTime(server, player);
  const growTime = ns.formulas.hacking.growTime(server, player);
  const weakenTime = ns.formulas.hacking.weakenTime(server, player);

  ns.tprint(`Waktu Hack: ${ns.tFormat(hackTime)}`);
  ns.tprint(`Waktu Grow: ${ns.tFormat(growTime)}`);
  ns.tprint(`Waktu Weaken: ${ns.tFormat(weakenTime)}`);
}
