import { scriptPath, scriptStart } from "../../lib/settings";

/** @param {NS} ns */
export async function main(ns) {
  /** _                _
   * | |    ___   __ _(_) ___ __ _
   * | |   / _ \ / _` | |/ __/ _` |
   * | |__| (_) | (_| | | (_| (_| |
   * |_____\___/ \__, |_|\___\__,_|
   *              |___/
   *
   * start > corporation "CapitalPrinter Inc"
   * start > buy first division "Agriculture"
   * start > buy Unlocks "Export", "Smart Supply"
   *
   * corporation > run divisions we have
   * corporation > try to buy next division
   * corporation > buy Upgrades
   * corporation > buy Unlocks
   * corporation > set dividents based on timeline
   * corporation > go public if divisions > 2
   *
   * division > expand to all cities first
   * division > get all cities a warehouse, then continue
   * division > run the office
   * division > run the warehouse
   * division > hire advert
   * division > create / discontinue product
   * division > fill warehouse with booster material en export
   * division > buy research upgrades
   *
   * office > hire employees
   * office > set jobs for employees
   * office > buy some tea
   * office > throw a party
   * office > upgrade office size
   *
   * warehouse > set Smart Supply
   * warehouse > sell material
   * warehouse > sell product
   * warehouse > expand warehouse size
   */

  //\\ SCRIPT SETTINGS
  scriptStart(ns);
  ns.tail();

  //\\ GENERAL DATA
  const SCRIPT = scriptPath(ns);
  const API = ns.corporation;
  const AVG_EMPLOYEE_HEALTH = 90;
  const WAREHOUSE_USAGE_PROD_MULT = 0.5;

  let SPENDMONEY = true;
  let CREDIT_BUFFER = API.getCorporation().expenses;

  const ALL_CITIES = [
    ns.enums.CityName.Sector12,
    ns.enums.CityName.Aevum,
    ns.enums.CityName.Chongqing,
    ns.enums.CityName.NewTokyo,
    ns.enums.CityName.Ishima,
    ns.enums.CityName.Volhaven,
  ];

  const NEW_DIVISIONS = [
    { type: "Agriculture", name: "AGRCL" },
    { type: "Spring Water", name: "SPRNG" },
    { type: "Restaurant", name: "RESTO" },
    { type: "Tobacco", name: "TOBCO" },
    { type: "Software", name: "SOFTW" },
    { type: "Refinery", name: "REFIN" },
    { type: "Chemical", name: "CHEMI" },
    { type: "Fishing", name: "FISHY" },
    { type: "Water Utilities", name: "WATUT" },
    { type: "Pharmaceutical", name: "PHRMA" },
    { type: "Mining", name: "MINE" },
    { type: "Computer Hardware", name: "CPHW" },
    { type: "Real Estate", name: "RLST8" },
    { type: "Healthcare", name: "HLTHC" },
    { type: "Robotics", name: "ROBO" },
    { type: "Agriculture", name: "FARMG" },
    { type: "Software", name: "CODE" },
    { type: "Real Estate", name: "ESTAT" },
    { type: "Healthcare", name: "MEDIC" },
    { type: "Robotics", name: "BOTIC" },
  ];

  const RESEARCHUPGRADESMT = [
    "Hi-Tech R&D Laboratory",
    "AutoBrew",
    "AutoPartyManager",
    "Drones",
    "Drones - Assembly",
    "Drones - Transport",
    "Self-Correcting Assemblers",
    "Automatic Drug Administration",
    "CPH4 Injections",
    "Go-Juice",
    "Overclock",
    "Sti.mu",
    "Market-TA.I",
    "Market-TA.II",
  ];

  const RESEARCHUPGRADESMP = [
    "uPgrade: Fulcrum",
    "uPgrade: Dashboard",
    "uPgrade: Capacity.I",
    "uPgrade: Capacity.II",
  ];

  function logCorporation(corp) {
    // log corp status

    ns.print("Name\t\t" + corp.name);
    ns.print("Funds\t\t" + ns.formatNumber(corp.funds));
    ns.print("Revenue\t\t" + ns.formatNumber(corp.revenue));
    ns.print("Expense\t\t" + ns.formatNumber(corp.expenses));
    ns.print("DividendRate\t" + ns.formatPercent(corp.dividendRate));
    ns.print("Divisions\t" + corp.divisions.length);
    ns.print("Credit buffer\t" + ns.formatNumber(CREDIT_BUFFER));
    ns.print("Spend\t\t" + SPENDMONEY);
  }

  function logDivision(division) {
    // log division status

    ns.print("\nDivision\t" + division.name);
    ns.print(
      "Profit\t\t" +
        ns.formatNumber(division.lastCycleRevenue - division.lastCycleExpenses)
    );
    ns.print("Awareness\t" + Math.round(division.awareness));
    ns.print("Popularity\t" + Math.round(division.popularity));
    ns.print("Research\t" + Math.round(division.researchPoints));
    if (division.makesProducts) {
      ns.print(
        "Products\t" + division.products.length + "/" + division.maxProducts
      );
    }
  }

  function expandDivision(division) {
    // expand to all cities with warehouse

    if (division.cities.length < 6) {
      ALL_CITIES.forEach((city) => {
        if (
          !division.cities.includes(city) &&
          API.getCorporation().funds > 9e9
        ) {
          API.expandCity(division.name, city);
          API.purchaseWarehouse(division.name, city);
        }
      });
      return false;
    } else {
      return true;
    }
  }

  function getSellMaterials(divisionName) {
    // @return the industie required material for production

    switch (divisionName) {
      case "AGRCL":
        return ["Plants", "Food"];
      case "SPRNG":
        return ["Water"];
      case "RESTO":
        return ["Food", "Water"];
      case "TOBCO":
        return ["Plants"];
      case "SOFTW":
        return ["AI Cores"];
      case "REFIN":
        return ["Metal"];
      case "CHEMI":
        return ["Chemicals"];
      case "FISHY":
        return ["Food"];
      case "WATUT":
        return ["Water"];
      case "PHRMA":
        return ["Drugs"];
      case "MINE":
        return ["Ore", "Minerals"];
      case "CPHW":
        return ["Hardware"];
      case "RLST8":
        return ["Real Estate"];
      case "HLTHC":
        return [];
      case "ROBO":
        return ["Robots"];
      case "FARMG":
        return ["Plants", "Food"];
      case "CODE":
        return ["AI Cores"];
      case "ESTAT":
        return ["Real Estate"];
      case "MEDIC":
        return [];
      case "BOTIC":
        return ["Robots"];
    }
  }

  function getProductionMultiplierMaterial(divisionName) {
    switch (divisionName) {
      case "AGRCL":
        return "Real Estate";
      case "SPRNG":
        return "Real Estate";
      case "RESTO":
        return "AI Cores";
      case "TOBCO":
        return "Robots";
      case "SOFTW":
        return "Real Estate";
      case "REFIN":
        return "Hardware";
      case "CHEMI":
        return "Real Estate";
      case "FISHY":
        return "Robots";
      case "WATUT":
        return "Real Estate";
      case "PHRMA":
        return "Robots";
      case "MINE":
        return "Robots";
      case "CPHW":
        return "Robots";
      case "RLST8":
        return "Robots";
      case "HLTHC":
        return "Real Estate";
      case "ROBO":
        return "Real Estate";
      case "FARMG":
        return "Real Estate";
      case "CODE":
        return "Real Estate";
      case "ESTAT":
        return "Robots";
      case "MEDIC":
        return "Real Estate";
      case "BOTIC":
        return "Real Estate";
    }
  }

  function setSmartSupply(smartSupplyEnabled, divisionName, city) {
    // set smart supply

    if (!smartSupplyEnabled) {
      API.setSmartSupply(divisionName, city, true);
    }
  }

  function sellMaterial(divisionName, city) {
    // set sell materials

    let sellMaterial = getSellMaterials(divisionName);
    for (let material of sellMaterial) {
      let stored = API.getMaterial(divisionName, city, material).stored;

      if (API.hasResearched(divisionName, "Market-TA.I")) {
        API.setMaterialMarketTA1(divisionName, city, material, false);
      } else if (API.hasResearched(divisionName, "Market-TA.II")) {
        API.setMaterialMarketTA2(divisionName, city, material, false);
      }

      if (API.getCorporation().nextState === "START" && stored > 100) {
        // ns.print("WARN OVERFLOW")
        API.sellMaterial(divisionName, city, material, "MAX", 0);
      } else if (API.getCorporation().prevState === "SALE") {
        API.sellMaterial(divisionName, city, material, "MAX", "MP");
      }
    }
  }

  function sellProduct(makeProducts, products, divisionName, city) {
    // set sell to products

    if (makeProducts) {
      for (let product of products) {
        API.sellProduct(divisionName, city, product, "MAX", "MP");

        if (API.hasResearched(divisionName, "Market-TA.I")) {
          API.setProductMarketTA1(divisionName, product, true);
        } else if (API.hasResearched(divisionName, "Market-TA.II")) {
          API.setProductMarketTA2(divisionName, product, true);
        }
      }
    }
  }

  function expandWarehouseSize(sizeUsed, size, divisionName, city) {
    // upgrade warehouse size with level upgrade

    if ((sizeUsed / size) * 100 > 90) {
      if (
        API.getCorporation().funds >
        API.getUpgradeLevelCost("Smart Storage") + CREDIT_BUFFER
      ) {
        API.levelUpgrade("Smart Storage");
      } else if (
        API.getCorporation().funds >
        API.getUpgradeWarehouseCost(divisionName, city, 1) + CREDIT_BUFFER
      ) {
        API.upgradeWarehouse(divisionName, city, 1);
      }
    }
  }

  function handleWarehouse(division) {
    // __        __             _
    // \ \      / /_ _ _ __ ___| |__   ___  _   _ ___  ___
    //  \ \ /\ / / _` | '__/ _ \ '_ \ / _ \| | | / __|/ _ \
    //   \ V  V / (_| | | |  __/ | | | (_) | |_| \__ \  __/
    //    \_/\_/ \__,_|_|  \___|_| |_|\___/ \__,_|___/\___|

    for (let city of division.cities) {
      let warehouseData = API.getWarehouse(division.name, city);
      setSmartSupply(warehouseData.smartSupplyEnabled, division.name, city);
      sellMaterial(division.name, city);
      sellProduct(
        division.makesProducts,
        division.products,
        division.name,
        city
      );
      expandWarehouseSize(
        warehouseData.sizeUsed,
        warehouseData.size,
        division.name,
        city
      );
    }
  }

  function hireEmployees(employees, size, divisionName, city) {
    // hire employees

    if (SPENDMONEY) {
      if (employees < size) {
        let amount = size - employees;
        for (var i = 0; i < amount; i++) {
          API.hireEmployee(divisionName, city);
        }
      }
    }
  }

  function assignJobDistribution(employees, research) {
    // @return distribution for employees

    let distribution = {};

    if (research) {
      distribution = {
        o: Math.round(employees * 0.35),
        e: Math.round(employees * 0.25),
        b: Math.floor(employees * 0.2),
        m: Math.floor(employees * 0.1),
        r: Math.floor(employees * 0.1),
        i: Math.floor(employees * 0.0),
      };
    } else {
      distribution = {
        o: Math.round(employees * 0.35),
        e: Math.round(employees * 0.3),
        b: Math.floor(employees * 0.25),
        m: Math.floor(employees * 0.1),
        r: Math.floor(employees * 0.0),
        i: Math.floor(employees * 0.0),
      };
    }

    let x = 0;
    for (let key in distribution) {
      x += distribution[key];
    }
    let leftover = employees - x;
    if (leftover > 0) {
      distribution.o += leftover;
    }
    if (leftover < 0) {
      distribution.m += leftover;
    }

    return distribution;
  }

  function researchCompleted(divisionName, makeProducts) {
    // check is all research is complete

    let complete = true;

    for (let rs of RESEARCHUPGRADESMT) {
      if (!API.hasResearched(divisionName, rs)) {
        return false;
      }
    }

    if (makeProducts) {
      for (let rs of RESEARCHUPGRADESMP) {
        if (!API.hasResearched(divisionName, rs)) {
          return false;
        }
      }
    }
    return complete;
  }

  function assignJobs(employees, divisionName, city, makeProducts) {
    // assign tasks to all employees

    let distribution;

    if (employees === 3) {
      API.setAutoJobAssignment(divisionName, city, "Operations", 1);
      API.setAutoJobAssignment(divisionName, city, "Engineer", 1);
      API.setAutoJobAssignment(divisionName, city, "Business", 1);
    } else if (
      employees > 30 &&
      !researchCompleted(divisionName, makeProducts)
    ) {
      distribution = assignJobDistribution(employees, true);
      API.setAutoJobAssignment(
        divisionName,
        city,
        "Operations",
        distribution.o
      );
      API.setAutoJobAssignment(divisionName, city, "Engineer", distribution.e);
      API.setAutoJobAssignment(divisionName, city, "Business", distribution.b);
      API.setAutoJobAssignment(
        divisionName,
        city,
        "Management",
        distribution.m
      );
      API.setAutoJobAssignment(
        divisionName,
        city,
        "Research & Development",
        distribution.r
      );
    } else {
      distribution = assignJobDistribution(employees, false);
      API.setAutoJobAssignment(
        divisionName,
        city,
        "Research & Development",
        distribution.r
      );
      API.setAutoJobAssignment(
        divisionName,
        city,
        "Operations",
        distribution.o
      );
      API.setAutoJobAssignment(divisionName, city, "Engineer", distribution.e);
      API.setAutoJobAssignment(divisionName, city, "Business", distribution.b);
      API.setAutoJobAssignment(
        divisionName,
        city,
        "Management",
        distribution.m
      );
    }
  }

  function boostEnergy(avgEnergy, divisionName, city) {
    // boost energy with tea

    if (SPENDMONEY) {
      if (
        avgEnergy < AVG_EMPLOYEE_HEALTH &&
        API.getCorporation().funds > CREDIT_BUFFER
      ) {
        API.buyTea(divisionName, city);
      }
    }
  }

  function boostMoral(avgMorale, divisionName, city) {
    // boost morale with a party

    if (SPENDMONEY) {
      if (
        avgMorale < AVG_EMPLOYEE_HEALTH &&
        API.getCorporation().funds > CREDIT_BUFFER
      ) {
        API.throwParty(divisionName, city, 1e6);
      }
    }
  }

  function upgradeOfficeSize(divisionName, city) {
    // upgrade office size by 3

    if (SPENDMONEY) {
      if (
        API.getCorporation().funds >
        API.getOfficeSizeUpgradeCost(divisionName, city, 3) + CREDIT_BUFFER
      ) {
        API.upgradeOfficeSize(divisionName, city, 3);
      }
    }
  }

  function researchUpgrades(divisionName, makeProducts) {
    // get research upgrades

    for (var i = 0; i < RESEARCHUPGRADESMT.length; ) {
      if (!API.hasResearched(divisionName, RESEARCHUPGRADESMT[i])) {
        if (
          API.getDivision(divisionName).researchPoints >
          API.getResearchCost(divisionName, RESEARCHUPGRADESMT[i])
        ) {
          API.research(divisionName, RESEARCHUPGRADESMT[i]);
        } else {
          break;
        }
      } else {
        i++;
      }
    }

    if (makeProducts) {
      for (var i = 0; i < RESEARCHUPGRADESMP.length; ) {
        if (!API.hasResearched(divisionName, RESEARCHUPGRADESMP[i])) {
          if (
            API.getDivision(divisionName).researchPoints >
            API.getResearchCost(divisionName, RESEARCHUPGRADESMP[i])
          ) {
            API.research(divisionName, RESEARCHUPGRADESMP[i]);
          } else {
            break;
          }
        } else {
          i++;
        }
      }
    }
  }

  function handleOffice(division) {
    //   ___   __  __ _
    //  / _ \ / _|/ _(_) ___ ___
    // | | | | |_| |_| |/ __/ _ \
    // | |_| |  _|  _| | (_|  __/
    //  \___/|_| |_| |_|\___\___|

    let totalEmployees = 0;

    for (let city of division.cities) {
      let officeData = API.getOffice(division.name, city);
      hireEmployees(
        officeData.numEmployees,
        officeData.size,
        division.name,
        city
      );
      assignJobs(
        officeData.numEmployees,
        division.name,
        city,
        division.makesProducts
      );
      boostEnergy(officeData.avgEnergy, division.name, city);
      boostMoral(officeData.avgMorale, division.name, city);
      upgradeOfficeSize(division.name, city);
      researchUpgrades(division.name, division.makesProducts);
      totalEmployees += officeData.numEmployees;
    }
    ns.print("Employees\t" + totalEmployees);
  }

  function hireAdvert(divisionName) {
    // hires adverts
    if (SPENDMONEY) {
      if (
        API.getCorporation().funds >
        API.getHireAdVertCost(divisionName) + CREDIT_BUFFER
      ) {
        API.hireAdVert(divisionName);
      }
    }
  }

  function createNewProductName(existingProducts) {
    // create product name base on existing product numbers

    const baseName = "Product-";
    let numberOfProducts = 0;

    existingProducts.forEach((prod) => {
      let num = prod.split("-")[1];

      if (num > numberOfProducts) {
        numberOfProducts = num;
      }
    });
    numberOfProducts++;
    return baseName + numberOfProducts;
  }

  function handleProduct(
    makesProducts,
    products,
    maxProducts,
    divisionName,
    divisionCities
  ) {
    // create / discontinue products

    if (makesProducts) {
      if (products.length === 0) {
        API.makeProduct(divisionName, "Sector-12", "Product-0", 1, 1);
        API.makeProduct(divisionName, "Sector-12", "Product-1", 1, 1);
        API.makeProduct(divisionName, "Sector-12", "Product-2", 1, 1);
      } else if (products.length < maxProducts) {
        // develop product
        let numOfProductsToMake = maxProducts - products.length;
        for (var i = 0; i < numOfProductsToMake; i++) {
          let invest = API.getCorporation().funds / 2;
          API.makeProduct(
            divisionName,
            "Sector-12",
            createNewProductName(products),
            invest,
            invest
          );
        }
      } else {
        // discontinue product
        let discontinueProduct = { division: "none", productName: "none" };

        products.forEach((product) => {
          divisionCities.forEach((city) => {
            let data = API.getProduct(divisionName, city, product);
            if (
              data.developmentProgress === 100 &&
              API.getCorporation().prevState === "SALE" &&
              data.stored > 100
            ) {
              ns.tprint(
                "WARN DISCONTINUE PROD " +
                  product +
                  " " +
                  divisionName +
                  " " +
                  city
              );
              discontinueProduct.division = divisionName;
              discontinueProduct.productName = product;
            }
          });
        });

        if (
          discontinueProduct.division != "none" &&
          discontinueProduct.productName != "none"
        ) {
          API.discontinueProduct(
            discontinueProduct.division,
            discontinueProduct.productName
          );
        }
      }
    }
  }

  function handleProductionMult(divisionName, divisionCities) {
    let data = [];
    divisionCities.forEach((city) => {
      let prodMultMaterial = getProductionMultiplierMaterial(divisionName);
      let material = API.getMaterial(divisionName, city, prodMultMaterial);
      let materialData = API.getMaterialData(prodMultMaterial);
      let warehouse = API.getWarehouse(divisionName, city);

      data.push({
        city: city,
        prodMult: prodMultMaterial,
        marketPrice: material.marketPrice,
        materialSize: materialData.size,
        stored: material.stored,
        storedInSize: material.stored * materialData.size,
        warehouseMaxStored: warehouse.size / materialData.size,
        exports: material.exports,
      });
    });

    data.sort((a, b) => a.marketPrice - b.marketPrice);

    for (let get of data) {
      let demand;

      if (get.city === data[0].city) {
        ns.print("Export \t\t" + get.city);

        // buy here
        API.sellMaterial(divisionName, get.city, get.prodMult, 0, "MP");

        // bulk purchase max amount
        demand = get.warehouseMaxStored / 2 - get.stored;
        let price = demand * get.marketPrice;

        if (demand > 0 && API.getCorporation().funds > CREDIT_BUFFER) {
          if (API.getCorporation().funds > price) {
            API.bulkPurchase(divisionName, get.city, get.prodMult, demand);
          } else {
            let parcialDemand = API.getCorporation().funds / get.marketPrice;
            API.bulkPurchase(
              divisionName,
              get.city,
              get.prodMult,
              parcialDemand
            );
          }
        }
      } else {
        // sell in city
        API.sellMaterial(divisionName, get.city, get.prodMult, "MAX", "MP");

        // remove old exports of city when buy city changes
        for (let oldExport of get.exports) {
          API.cancelExportMaterial(
            divisionName,
            get.city,
            oldExport.division,
            oldExport.city,
            get.prodMult
          );
        }

        if (API.getCorporation().nextState === "EXPORT") {
          // set up exports from buyCity
          if (get.warehouseMaxStored / 2 - get.stored > 0) {
            // find if export exists
            let exportExists = false;
            for (let runningExports of data[0].exports) {
              if (runningExports.city === get.city) {
                exportExists = true;
              }
            }

            // set up export
            if (!exportExists) {
              demand = get.warehouseMaxStored / 2 - get.stored;
              if (demand > 0) {
                API.exportMaterial(
                  divisionName,
                  data[0].city,
                  divisionName,
                  get.city,
                  get.prodMult,
                  demand * get.materialSize
                );
              }
            }
          }
        } else {
          // remove all exports from buyCity when done
          for (let oldExport of data[0].exports) {
            API.cancelExportMaterial(
              divisionName,
              data[0].city,
              divisionName,
              oldExport.city,
              get.prodMult
            );
          }
        }
      }
    }
  }

  function handleDivisions(divisions) {
    //  ____  _       _     _
    // |  _ \(_)_   _(_)___(_) ___  _ __  ___
    // | | | | \ \ / / / __| |/ _ \| '_ \/ __|
    // | |_| | |\ V /| \__ \ | (_) | | | \__ \
    // |____/|_| \_/ |_|___/_|\___/|_| |_|___/

    for (let division of divisions) {
      let divisionData = API.getDivision(division);
      logDivision(divisionData);

      if (expandDivision(divisionData)) {
        handleWarehouse(divisionData);
        handleOffice(divisionData);
        hireAdvert(divisionData.name);
        handleProduct(
          divisionData.makesProducts,
          divisionData.products,
          divisionData.maxProducts,
          divisionData.name,
          divisionData.cities
        );
        handleProductionMult(divisionData.name, divisionData.cities);
      }
    }
  }

  function expandIndustry(divisions) {
    // expand industy only if prev has 6 cities

    if (divisions.length < 20) {
      if (
        API.getDivision(divisions[divisions.length - 1]).cities.length === 6
      ) {
        let nextIndustry = NEW_DIVISIONS[divisions.length];
        let industyData = API.getIndustryData(nextIndustry.type);

        ns.print("\nNext industry \t" + nextIndustry.type);
        ns.print("Cost\t\t" + ns.formatNumber(industyData.startingCost));

        if (API.getCorporation().funds > industyData.startingCost) {
          API.expandIndustry(nextIndustry.type, nextIndustry.name);
        }
      }
    }
  }

  function buyUpgrades() {
    // auto buy upgrades
    const wantedUpgrades = [
      "ABC SalesBots",
      "DreamSense",
      "Smart Factories",
      "Nuoptimal Nootropic Injector Implants",
      "Speech Processor Implants",
      "FocusWires",
      "Neural Accelerators",
      "Wilson Analytics",
    ];

    if (SPENDMONEY) {
      wantedUpgrades.forEach((upgrade) => {
        if (
          API.getCorporation().funds >
          API.getUpgradeLevelCost(upgrade) + CREDIT_BUFFER
        ) {
          API.levelUpgrade(upgrade);
        }
      });
    }
  }

  function buyUnlocks() {
    // todo

    if (SPENDMONEY) {
    }
  }

  function setDividents(publicCorp, numOfDivisions) {
    // issue dividents base on running scripts

    let rate = 0;

    if (numOfDivisions > 10) {
      rate = 0.01;
    }
    if (SPENDMONEY) {
      if (publicCorp && numOfDivisions > 3) {
        if (ns.scriptRunning(SCRIPT.programs, "home")) {
          API.issueDividends(0.2);
        } else if (ns.scriptRunning(SCRIPT.install, "home")) {
          API.issueDividends(0.9);
        } else {
          API.issueDividends(rate);
        }
      }
    }
  }

  function bribeFactions(funds, revenue) {
    // put some factions under presure

    if (ns.scriptRunning(SCRIPT.reputation, "home")) {
      let runningScripts = ns.ps("home");
      let reputationScript = runningScripts.find(
        (o) => o.filename === "bin/singularity/reputation.js"
      );

      let amt = revenue * 0.2;

      if (funds > 1e9) {
        if (API.bribe(reputationScript.args[0], amt)) {
          ns.print("WARN\t\tBribe Money " + ns.formatNumber(amt));
        }
      }
    }
  }

  function goPublic(publicCorp, numOfDivisions) {
    // go public after 2 divisions
    if (!publicCorp && numOfDivisions > 2) {
      API.goPublic(1);
    }
  }

  function spendMoney() {
    // spend of buy divisions
    API.getBonusTime() > 2000 ? (SPENDMONEY = false) : (SPENDMONEY = true);
  }

  function setCreditBuffer(divisions) {
    // set credit buffer
    if (divisions > 2) {
      if (CREDIT_BUFFER != API.getCorporation().expenses * divisions) {
        CREDIT_BUFFER = API.getCorporation().expenses * divisions;
      }
    }
  }

  //\\ LOGIC
  while (true) {
    //   ____                                 _   _
    //  / ___|___  _ __ _ __   ___  _ __ __ _| |_(_) ___  _ __
    // | |   / _ \| '__| '_ \ / _ \| '__/ _` | __| |/ _ \| '_ \
    // | |__| (_) | |  | |_) | (_) | | | (_| | |_| | (_) | | | |
    //  \____\___/|_|  | .__/ \___/|_|  \__,_|\__|_|\___/|_| |_|
    //                 |_|

    await API.nextUpdate();
    ns.clearLog();

    let corporationData = API.getCorporation();

    goPublic(corporationData.public, corporationData.divisions.length);
    setDividents(corporationData.public, corporationData.divisions.length);
    setCreditBuffer(corporationData.divisions.length);
    logCorporation(corporationData);
    bribeFactions(corporationData.funds, corporationData.revenue);
    handleDivisions(corporationData.divisions);
    expandIndustry(corporationData.divisions);
    spendMoney();
    buyUpgrades();
    buyUnlocks();
  }
}

// CORPORATION ================================================================================================================================================
// hasCorporation()	                                                                            Returns whether the player has a corporation. Does not require API access.
// createCorporation(corporationName, selfFund)	                                                Create a Corporation
// nextUpdate()	                                                                                Sleep until the next Corporation update has happened.

// getCorporation()	                                                                            Get corporation data
// getDivision(divisionName)	                                                                Get division data

// getIndustryData(industryName)	                                                            Get constant industry definition data for a specific industry
// expandCity(divisionName, city)	                                                            Expand to a new city
// expandIndustry(industryType, divisionName)	                                                Expand to a new industry
// hasUnlock(upgradeName)	                                                                    Check if you have a one time unlockable upgrade

// getBonusTime()	                                                                            Get bonus time.
// getConstants()	                                                                            Get corporation related constants

// getMaterialData(materialName)	                                                            Get constant data for a specific material
// getUnlockCost(upgradeName)	                                                                Gets the cost to unlock a one time unlockable upgrade
// purchaseUnlock(upgradeName)	                                                                Unlock an upgrade
// getUpgradeLevel(upgradeName)	                                                                Get the level of a levelable upgrade
// getUpgradeLevelCost(upgradeName)	                                                            Gets the cost to unlock the next level of a levelable upgrade
// levelUpgrade(upgradeName)	                                                                Level an upgrade.

// goPublic(numShares)	                                                                        Go public
// issueDividends(rate)	                                                                        Issue dividends
// getInvestmentOffer()	                                                                        Get an offer for investment based on you companies current valuation
// acceptInvestmentOffer()	                                                                    Accept investment based on you companies current valuation
// issueNewShares(amount)	                                                                    Issue new shares
// buyBackShares(amount)	                                                                    Buyback Shares. Spend money from the player's wallet to transfer shares from public traders to the CEO.
// sellShares(amount)	                                                                        Sell Shares. Transfer shares from the CEO to public traders to receive money in the player's wallet.
// sellDivision(divisionName)	                                                                Sell a division

// bribe(factionName, amountCash)	                                                            Bribe a faction

// OFFICE =====================================================================================================================================================
// getOffice(divisionName, city)	                                                            Get data about an office
// hireEmployee(divisionName, city, employeePosition)	                                        Hire an employee.
// setAutoJobAssignment(divisionName, city, job, amount)	                                    Set the auto job assignment for a job
// getOfficeSizeUpgradeCost(divisionName, city, size)	                                        Cost to Upgrade office size.
// upgradeOfficeSize(divisionName, city, size)                                                  Upgrade office size.

// getHireAdVertCount(divisionName)	                                                            Get the number of times you have hired AdVert.
// getHireAdVertCost(divisionName)	                                                            Get the cost to hire AdVert.
// hireAdVert(divisionName)	                                                                    Hire AdVert.

// hasResearched(divisionName, researchName)	                                                Gets if you have unlocked a research
// getResearchCost(divisionName, researchName)	                                                Get the cost to unlock research
// research(divisionName, researchName)	                                                        Purchase a research

// throwParty(divisionName, city, costPerEmployee)	                                            Throw a party for your employees
// buyTea(divisionName, city)	                                                                Buy tea for your employees

// WAREHOUSE ==================================================================================================================================================
// hasWarehouse(divisionName, city)	                                                            Check if you have a warehouse in city
// purchaseWarehouse(divisionName, city)	                                                    Purchase warehouse for a new city
// getWarehouse(divisionName, city)	                                                            Get warehouse data
// getUpgradeWarehouseCost(divisionName, city, amt)	                                            Gets the cost to upgrade a warehouse to the next level
// upgradeWarehouse(divisionName, city, amt)	                                                Upgrade warehouse

// setSmartSupply(divisionName, city, enabled)	                                                Set smart supply
// setSmartSupplyOption(divisionName, city, materialName, option)	                            Set whether smart supply uses leftovers before buying

// sellMaterial(divisionName, city, materialName, amt, price)	                                Set material sell data.
// sellProduct(divisionName, city, productName, amt, price, all)	                            Set product sell data.

// getMaterial(divisionName, city, materialName)	                                            Get material data
// buyMaterial(divisionName, city, materialName, amt)	                                        Set material buy data
// bulkPurchase(divisionName, city, materialName, amt)	                                        Set material to bulk buy
// exportMaterial(sourceDivision, sourceCity, targetDivision, targetCity, materialName, amt)	Set material export data
// cancelExportMaterial(sourceDivision, sourceCity, targetDivision, targetCity, materialName)	Cancel material export

// getProduct(divisionName, cityName, productName)	                                            Get product data
// makeProduct(divisionName, city, productName, designInvest, marketingInvest)	                Create a new product
// discontinueProduct(divisionName, productName)	                                            Discontinue a product.

// limitMaterialProduction(divisionName, city, materialName, qty)	                            Limit Material Production.
// limitProductProduction(divisionName, city, productName, qty)	                                Limit Product Production.

// setMaterialMarketTA1(divisionName, city, materialName, on)	                                Set market TA 1 for a material.
// setMaterialMarketTA2(divisionName, city, materialName, on)	                                Set market TA 2 for a material.

// setProductMarketTA1(divisionName, productName, on)	                                        Set market TA 1 for a product.
// setProductMarketTA2(divisionName, productName, on)	                                        Set market TA 2 for a product.
