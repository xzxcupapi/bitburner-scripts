/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("ALL");
  ns.tail();
  ns.print("Starting auto gym script...");

  // Konfigurasi
  const gym = "Powerhouse Gym"; // Ganti dengan nama gym yang Anda inginkan
  const statToTrain = "strength"; // Pilih antara: "strength", "defense", "dexterity", "agility"
  const desiredLevel = 100; // Level yang ingin dicapai
  const moneyThreshold = 1000000; // Jumlah uang minimum yang harus dimiliki

  while (true) {
    // Periksa uang
    if (ns.getServerMoneyAvailable("home") < moneyThreshold) {
      ns.print("Uang tidak cukup. Menunggu...");
      await ns.sleep(60000); // Tunggu 1 menit
      continue;
    }

    // Periksa level stat saat ini
    let currentStat;
    switch (statToTrain) {
      case "strength":
        currentStat = ns.getPlayer().strength;
        break;
      case "defense":
        currentStat = ns.getPlayer().defense;
        break;
      case "dexterity":
        currentStat = ns.getPlayer().dexterity;
        break;
      case "agility":
        currentStat = ns.getPlayer().agility;
        break;
    }

    if (currentStat >= desiredLevel) {
      ns.print(
        `${statToTrain} sudah mencapai level ${desiredLevel}. Script berhenti.`
      );
      break;
    }

    // Latihan di gym
    try {
      if (ns.singularity.gymWorkout(gym, statToTrain)) {
        ns.print(
          `Berlatih ${statToTrain} di ${gym}. Level saat ini: ${currentStat}`
        );
      } else {
        ns.print(
          "Gagal memulai latihan. Mungkin sudah di gym atau lokasi salah."
        );
      }
    } catch (error) {
      ns.print("Error: " + error.message);
      ns.print(
        "Pastikan Anda berada di BitNode yang tepat atau memiliki Source-File yang diperlukan."
      );
      break;
    }

    // Tunggu sebentar sebelum loop berikutnya
    await ns.sleep(60000); // Cek setiap 1 menit
  }
}
