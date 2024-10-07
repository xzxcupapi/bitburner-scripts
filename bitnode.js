/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("ALL");
  ns.tail();
  ns.print("Checking current BitNode status...");

  let bitNodeInfo;
  let sourceFiles;

  try {
    bitNodeInfo = ns.getPlayer().bitNodeN;
    sourceFiles = ns.singularity.getOwnedSourceFiles();
  } catch (error) {
    ns.print("Error: Tidak dapat mengakses informasi BitNode.");
    ns.print("Ini mungkin karena Anda belum menyelesaikan BitNode pertama.");
    ns.print("Lanjutkan bermain hingga Anda mencapai 'Destroy' pertama Anda.");
    return;
  }

  ns.print(`Anda saat ini berada di BitNode-${bitNodeInfo}`);

  ns.print("\nSource Files yang dimiliki:");
  if (sourceFiles.length === 0) {
    ns.print("Anda belum memiliki Source Files.");
  } else {
    for (const sf of sourceFiles) {
      ns.print(`- Source File ${sf.n} (Level ${sf.lvl})`);
    }
  }

  ns.print("\nKemampuan yang tersedia berdasarkan BitNode dan Source Files:");

  if (bitNodeInfo === 4 || sourceFiles.some((sf) => sf.n === 4)) {
    ns.print("- Singularity Functions tersedia (ns.singularity)");
  } else {
    ns.print("- Singularity Functions TIDAK tersedia");
  }

  if (bitNodeInfo === 5 || sourceFiles.some((sf) => sf.n === 5)) {
    ns.print("- Intelligence stat dan Hacknet Servers tersedia");
  }

  if (bitNodeInfo === 6 || sourceFiles.some((sf) => sf.n === 6)) {
    ns.print("- Bladeburner API tersedia (ns.bladeburner)");
  }

  if (bitNodeInfo === 7 || sourceFiles.some((sf) => sf.n === 7)) {
    ns.print("- Netscript Stock API tersedia (ns.stock)");
  }

  if (bitNodeInfo === 9 || sourceFiles.some((sf) => sf.n === 9)) {
    ns.print("- Corporation API tersedia (ns.corporation)");
  }

  ns.print("\nUntuk informasi lebih lanjut tentang setiap BitNode,");
  ns.print("kunjungi Terminal dan ketik 'help hitchhiker'.");
}
