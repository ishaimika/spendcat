import { Transaction } from "./Transaction"

export interface Statement {
	total_count: number
	status: string
	transactions: Transaction[]
}
