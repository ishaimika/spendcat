import { default as fetch, RequestInfo, RequestInit, Response } from "node-fetch"
import * as tough from "tough-cookie"
import { Statement } from "./Statement"
import { Period } from "./Period"
import { Transaction } from "./Transaction"

export class Session {
	private constructor(private readonly cookies: string) {
	}
	private async fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
		return fetch(url, { ...init, headers: { ...init?.headers, cookie: this.cookies } })
	}

	async getStatementPeriods(): Promise<Period[] | undefined> {
		const response = await this.fetch("https://global.americanexpress.com/api/servicing/v1/financials/statement_periods", {
			headers: {
				accept: "*/*",
				"accept-language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7",
				account_token: "FKVEIRYHTSGAWHM",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
			},
			method: "GET",
		})
		return response.ok ? await response.json() as Period[] : undefined
	}

	async loadStatementPeriods(): Promise<Transaction[]> {
		const periods = await this.getStatementPeriods()
		const allPeriods = periods ? await Promise.all(periods.map(p => this.load(p.statement_end_date))) : undefined
		return allPeriods?.reduce<Transaction[]>((r, p) => p ? r.concat(p.transactions) : r, []) ?? []
	}

	async load(endDate: string): Promise<Statement | undefined> {
		const response = await this.fetch("https://global.americanexpress.com/api/servicing/v1/financials/transactions?limit=1000&offset=0&statement_end_date=" + endDate + "&status=posted", {
			headers: {
				accept: "*/*",
				"accept-language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7",
				account_token: "FKVEIRYHTSGAWHM",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
			},
			method: "GET",
		})
		return response.ok ? await response.json() as Statement : undefined
	}
	static async login(user: string, password: string): Promise<Session | undefined> {
		const response = await fetch("https://global.americanexpress.com/myca/logon/emea/action/login", {
			method: "POST",
			headers: {
			  "content-type": "application/x-www-form-urlencoded; charset=utf-8",
			},
			body: "request_type=login&Face=sv_SE&UserID=" + user + "&Password=" + password + "&REMEMBERME=off&Logon=Logon&inauth_profile_transaction_id=USLOGON-37447535-e256-4d5f-96d6-7bee3ad1f7b0&DestPage=https%3A%2F%2Fglobal.americanexpress.com%2Ftransactions%3FBPIndex%3D2&devicePrint=version%253D3%252E4%252E0%252E0%255F1%2526pm%255Ffpua%253Dmozilla%252F5%252E0%2520%2528macintosh%253B%2520intel%2520mac%2520os%2520x%252010%255F14%255F6%2529%2520applewebkit%252F537%252E36%2520%2528khtml%252C%2520like%2520gecko%2529%2520chrome%252F81%252E0%252E4044%252E129%2520safari%252F537%252E36%257C5%252E0%2520%2528Macintosh%253B%2520Intel%2520Mac%2520OS%2520X%252010%255F14%255F6%2529%2520AppleWebKit%252F537%252E36%2520%2528KHTML%252C%2520like%2520Gecko%2529%2520Chrome%252F81%252E0%252E4044%252E129%2520Safari%252F537%252E36%257CMacIntel%2526pm%255Ffpsc%253D24%257C2560%257C1440%257C1417%2526pm%255Ffpsw%253D%2526pm%255Ffptz%253D1%2526pm%255Ffpln%253Dlang%253Dsv%252DSE%257Csyslang%253D%257Cuserlang%253D%2526pm%255Ffpjv%253D0%2526pm%255Ffpco%253D1%2526pm%255Ffpasw%253Dinternal%252Dpdf%252Dviewer%257Cmhjfbmdgcfjbbpaeojofohoefgiehjai%257Cinternal%252Dnacl%252Dplugin%2526pm%255Ffpan%253DNetscape%2526pm%255Ffpacn%253DMozilla%2526pm%255Ffpol%253Dtrue%2526pm%255Ffposp%253D%2526pm%255Ffpup%253D%2526pm%255Ffpsaw%253D2560%2526pm%255Ffpspd%253D24%2526pm%255Ffpsbd%253D%2526pm%255Ffpsdx%253D%2526pm%255Ffpsdy%253D%2526pm%255Ffpslx%253D%2526pm%255Ffpsly%253D%2526pm%255Ffpsfse%253D%2526pm%255Ffpsui%253D%2526pm%255Fos%253DMac%2526pm%255Fbrmjv%253D81%2526pm%255Fbr%253DChrome%2526pm%255Finpt%253D%2526pm%255Fexpt%253D"
			})
		const cookies = response.ok && response.headers.raw()["set-cookie"].map(c => tough.Cookie.parse(c, { loose: true }))
		const cookieString = cookies && cookies.map(c => c?.cookieString()).join(";")
		return cookieString ? new Session(cookieString) : undefined
	}
}
