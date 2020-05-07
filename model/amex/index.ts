import * as model from "../Transaction"
import { Session } from "./Session"

export async function fetch(user: string, password: string): Promise<model.Transaction[]> {
    const session = await Session.login(user, password)
	const data = session && await session.loadStatementPeriods()
    return data ? data.map<model.Transaction>(t => { 
			return {
                type: t.sub_type == "payment" && t.type == "CREDIT" ? "payment" : "purchase",
                date: t.post_date,
                amount: t.amount,
                description: t.description.substring(0, 22).trim(),
                city: t.description.substring(24),
                card: "American Express",
                name: t.last_name + " " + t.first_name, 
            }
		}) : []
}