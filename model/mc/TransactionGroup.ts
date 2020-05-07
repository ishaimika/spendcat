import * as model from "../Transaction"
import { Transaction } from "./Transaction"
export interface TransactionGroup {
	title: string;
	total: string;
	type: string;
	transactions: Transaction[];
    totalNumber: number;
    [property: string]: any
}

export namespace TransactionGroup {
	export function toModel(group: TransactionGroup, name?: string): model.Transaction[] {
        return group.transactions.map(t => Transaction.toModel(t, group.type == "Payment" ? "payment" : "purchase", name))
	}
}

