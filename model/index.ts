import * as amex from "./amex"
import * as mc from "./mc"
import { Transaction } from "./Transaction"

(async () => {
    const month = "2020-04"
    const transactions1 = await amex.fetch("user", "pw")
    const transactions2 = await mc.fetch("Json code")
    const transactions = [...transactions2, ...transactions1]
    console.log(JSON.stringify(transactions, undefined, 2))
    const summary = summarize(transactions)
    console.log(JSON.stringify(summary[month], undefined, 2))
})()


function monthly(data: Transaction[]): { [month: string] : Transaction[] | undefined } {
	return data.reduceRight<{ [month: string] : Transaction[] | undefined  }>((r, t) => {
		const month = t.date.substring(0, 7)
		if (!r[month])
			r[month] = []
		r[month]!.push(t)
		return r
	}, {})
}

interface Categories {
	[name: string]: {
		[category: string]: number
	}
}

function summarize(data: Transaction[]): { [month: string]: Categories } {
	return Object.entries(monthly(data)).map<[string, Categories]>(m => [m[0], categorize(m[1] ?? [])]).reduce<{ [month: string]: Categories }>((r, c) => {
		r[c[0]] = c[1]
		return r
	}, {})
}
function round(p: number, t: number) {
	return p = Math.round(100 * (p + t)) / 100
}

function categorize(data: Transaction[]) {
	return data.reduce<Categories>((s, t) => {
		if (t.type != "payment") {
			const p = s[(t.name ?? "noname").toLowerCase()] ?? { total: 0, private: 0, collective: 0, abbonemang: 0, betterglobe: 0, charity: 0, lokaltrafik: 0, privatHygien: 0, matHemmaHygien: 0, matUte: 0, systemet: 0, clothes: 0, utbildningTräning: 0, resor: 0, renovering: 0, nöje: 0, bil: 0, årsavgift: 0, övrigt: 0}
				p.total = round(p.total, t.amount)
				if (["NETFLIX", "APPLE.COM/BILL", "SPOTIFY"].some(n => t.description.includes(n)))
					p.abbonemang = round(p.abbonemang, t.amount)
				else if (["WWW.BETTERGLOBE.COM"].some(n => t.description.includes(n)))
					p.betterglobe = round(p.betterglobe, t.amount)
				else if (["CANCERFONDEN"].some(n => t.description.includes(n)))
					p.charity = round(p.charity, t.amount)
				else if (["VOI", "LIM*RIDE", "TIER", "UBER", "SJ AB", "T-BANA", "TAXI", "TVERBANAN", "LILJEHOLMEN C", "FAC Flygbussarna", "T-CENTRALEN"].some(n => t.description.includes(n)))
					p.lokaltrafik = round(p.lokaltrafik, t.amount)
				else if (["ICA", "COOP", "HEMKÖP", "WILLYS", "Apotea", "APOTEK", "RITUALS", "LIDL", "APOTEA"].some(n => t.description.includes(n)))
					p.matHemmaHygien = round(p.matHemmaHygien, t.amount)
				else if (["NH LILJEHOLMEN", "AQUA DENTAL", "ÅHLENS", "AHLENS"].some(n => t.description.includes(n)))
					p.privatHygien = round(p.privatHygien, t.amount)
				else if (["Mcdonalds", "MCDONALDS", "MCD", "GELATO", "SHISH", "KEBAB", "Drinks", "CRPERIE", "WERDSHUSET", "RASTA", "BURGER", "REST 2112", "BEER", "Pasta", "PASTA", "JURESKOGS", "Burger", "ESPRESSO", "TGI", "BRASSERIET", "Cafe", "CAFE", "7-ELEVEN", "DRINKS", "OLSTUGAN", "HMSHOST", "PIZZA", "Pizza", "VAPIANO", "TEXAS LONGHORN", "TEXAS LONG HORN", "BASTARD BURGERS", "TACO BAR", "PRESSBYRÅN", "Convini", "RESTAURANG", "OLEARYS", "STARBUCKS", "Bar", "Food", "FOOD", "MAX", "BAGERI", "BAR", "PUB"].some(n => t.description.includes(n)))
					p.matUte = round(p.matUte, t.amount)
				else if (["SYSTEMBOLAGET"].some(n => t.description.includes(n)))
					p.systemet = round(p.systemet, t.amount)
				else if (["H & M", "FOOTWAY", "XXL SPORT", "BIRKENSTOCK", "na-kd", "Stronger.se", "BUBBLEROOM.SE", "ZALANDO", "DRESSMAN", "LINDEX", "KAPPAHL", "GINA TRICOT", "PULL&BEAR", "STADIUM", "OHLSSONS TYGER"].some(n => t.description.includes(n)))
					p.clothes = round(p.clothes, t.amount)
				else if (["RACKETHALL", "AKADEMIBOKHANDE", "DISCGOLF", "CYKELKEDJAN"].some(n => t.description.includes(n)))
					p.utbildningTräning = round(p.utbildningTräning, t.amount)
				else if (["skistar.com", "Chatflights"].some(n => t.description.includes(n)))
					p.resor = round(p.resor, t.amount)
				else if (["IKEA", "ELGIGANTEN", "CERVERA", "BAUHAUS", "MEDIA MARKT", "CLAS OHLSON", "BILTEMA", "JULA", "KJELL & CO", "RUSTA", "K-RAUTA"].some(n => t.description.includes(n)))
					p.renovering = round(p.renovering, t.amount)
				else if (["YASURAGI", "Filmstaden", "FILMSTADEN", "TICKETMASTER", "LEKIA", "LEKPLANETEN", "GRÖNA LUNDS TIV", "BOWLING", "DJI", "AXS", "RAMMSTEIN"].some(n => t.description.includes(n)))
					p.nöje = round(p.nöje, t.amount)
				else if (["EasyPark", "OKQ8", "SHELL", "ST1", "M SWEDEN", "HERTZ", "INGO", "PARKERING", "Qpark", "QPark", "PREEM", "CIRCLE K", "EUROPCAR"].some(n => t.description.includes(n)))
					p.bil = round(p.bil, t.amount)
				else if (["ÅRSAVGIFT FÖR KONTOT"].some(n => t.description.includes(n)))
					p.årsavgift = round(p.årsavgift, t.amount)
				else {
					p.övrigt = round(p.övrigt, t.amount)
					console.error(t.description)
				}
				p.collective = p.matHemmaHygien + p.renovering
				p.private = p.total - p.collective
				s[(t.name ?? "noname").toLowerCase()] = p
			}
		return s
	}, {})
}