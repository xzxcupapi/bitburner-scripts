/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("ALL");
  ns.tail();
  ns.print("Starting crime script...");

  const crimes = [
    "shoplift",
    "rob store",
    "mug",
    "larceny",
    "deal drugs",
    "bond forgery",
    "traffick arms",
    "homicide",
    "grand theft auto",
    "kidnap",
    "assassinate",
    "heist",
  ];

  while (true) {
    let bestCrime = "";
    let bestChance = 0;
    let bestMoney = 0;

    for (const crime of crimes) {
      const stats = ns.singularity.getCrimeStats(crime);
      const chance = ns.singularity.getCrimeChance(crime);
      const moneyPerSecond = (stats.money * chance) / stats.time;

      if (moneyPerSecond > bestMoney) {
        bestCrime = crime;
        bestChance = chance;
        bestMoney = moneyPerSecond;
      }
    }

    ns.print(
      `Attempting ${bestCrime} (${(bestChance * 100).toFixed(2)}% chance)`
    );

    const success = await ns.singularity.commitCrime(bestCrime);

    if (success) {
      ns.print(`Successfully committed ${bestCrime}`);
    } else {
      ns.print(`Failed to commit ${bestCrime}`);
    }

    // Tunggu sebentar sebelum mencoba lagi
    await ns.sleep(1000);
  }
}
