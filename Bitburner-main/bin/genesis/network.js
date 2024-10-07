import { scriptPath } from "lib/settings"

/** @param {NS} ns */
export function Nmap(ns) {

	// returns a list of all servers names in the network

	let servers = []
	let serversToScan = ns.scan("home")
	while (serversToScan.length > 0) {

		let server = serversToScan.shift()
		if (!servers.includes(server) && server !== "home") {
			servers.push(server)
			serversToScan = serversToScan.concat(ns.scan(server))
		}
	}
	return servers
}

/** @param {NS} ns */
export function NmapMoneyServers(ns) {

	//returns a list of servers names with money

	let servers = Nmap(ns)
	let list = []

	for (let server of servers) {
		if (ns.getServerMaxMoney(server) > 0) {
			list.push(server)
		}
	}
	return list
}

/** @param {NS} ns */
export function NmapRamServers(ns) {

	//returns a list of servers names with ram

	const excludedServers = [
		"hacknet-server-0",
		"hacknet-server-1",
		"hacknet-server-2",
		"hacknet-server-3",
		"hacknet-server-4",
		"hacknet-server-5",
		"hacknet-server-6",
		"hacknet-server-7",
		"hacknet-server-8",
		"hacknet-server-9",
		"hacknet-server-10",
		"hacknet-server-11",
		"hacknet-server-12",
		"hacknet-server-13",
		"hacknet-server-14",
		"hacknet-server-15",
		"hacknet-server-16",
		"hacknet-server-17",
		"hacknet-server-18",
		"hacknet-server-19",
	]

	let servers = Nmap(ns)
	let list = []

	for (let server of servers) {
		if (ns.getServerMaxRam(server) > 0 &&
			!excludedServers.includes(server)) {
			list.push(server)
		}
	}
	return list
}

/** @param {NS} ns */
export function NmapClear(ns) {

	//clears the network of all running scripts

	let servers = NmapRamServers(ns)

	for (let server of servers) {
		ns.killall(server)
	}
}

/** @param {NS} ns */
export function NmapTotalRam(ns) {

	//returns the total ram in the network

	let ram = 0
	let servers = NmapRamServers(ns)

	for (let server of servers) {
		if (ns.hasRootAccess(server)) {
			ram = ram + ns.getServerMaxRam(server)
		}
	}
	return Math.floor(ram)
}

/** @param {NS} ns */
export function NmapFreeRam(ns) {

	//returns the usable ram in the network

	let ram = 0
	let servers = NmapRamServers(ns)

	for (let server of servers) {
		if (ns.hasRootAccess(server)) {
			ram = ram + ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
		}
	}
	return Math.floor(ram)
}

/** @param {NS} ns */
export function getRootAccess(ns, server) {

	//cracks ports to gain access

	let portsOpen = 0
	if (!ns.hasRootAccess(server)) {
		if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(server); portsOpen++ }
		if (ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(server); portsOpen++ }
		if (ns.fileExists("RelaySMTP.exe", "home")) { ns.relaysmtp(server); portsOpen++ }
		if (ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(server); portsOpen++ }
		if (ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(server); portsOpen++ }
		if (ns.getServerNumPortsRequired(server) <= portsOpen) { ns.nuke(server) }
	}
}

/** @param {NS} ns */
export function copyHackScripts(ns, server) {

	//copy the scripts to the destination server

	const path = scriptPath(ns)
	const files = [path.grow, path.weak, path.hack]

	if (!ns.fileExists(path.grow, server)
		|| !ns.fileExists(path.weak, server)
		|| !ns.fileExists(path.hack, server)) {
		ns.scp(files, server, "home")
	}
}

/** @param {NS} ns */
export function watchForNewServer(ns) {
	Nmap(ns).forEach(server => {
		getRootAccess(ns, server)
		copyHackScripts(ns, server)
	})
}

/** @param {NS} ns */
export function canRunOnHome(ns, script) {

	// check if script is not running
	// @return boolean 

	if (!ns.scriptRunning(script, "home")) {

		let ramAvailable = ns.getServerMaxRam("home") - ns.getServerUsedRam("home")
		return ramAvailable > ns.getScriptRam(script, "home")

	} else {

		return false
	}
}

/** @param {NS} ns */
export function getServerPath(ns, server) {

	// returns the path to a server

	let serverNameList = Nmap(ns)
	let serverPathList = serverNameList.map(function () {
		return ""
	})

	let visited = []
	let queue = ["home"]

	while (queue.length > 0) {
		let node = queue.shift()
		visited.push(node)
		let neighbours = ns.scan(node)
		for (let server of neighbours) {
			if (!visited.includes(server)) {
				serverPathList[serverNameList.indexOf(server)] = node
				queue.push(server)
			}
		}
	}

	if (ns.serverExists(server)) {
		let path = [server]

		while (path[path.length - 1] != "home") {
			let lasthop = path[path.length - 1]
			let nexthop = serverPathList[serverNameList.indexOf(lasthop)]
			path.push(nexthop)
		}
		path.reverse()
		return path
	}
}

/** @param {NS} ns */
export async function installBackdoor(ns, server) {

	if (!ns.getServer(server).backdoorInstalled &&
		ns.getHackingLevel() > ns.getServerRequiredHackingLevel(server) &&
		ns.hasRootAccess(server)) {

		getServerPath(ns, server).forEach(node => { ns.singularity.connect(node) })
		await ns.singularity.installBackdoor()
		ns.tprint("Backdoor installed on " + server)
		ns.singularity.connect("home")
	}
}