import * as model from "../Transaction"
export interface Transaction {
	amountNumber: number;
	transactionId: number;
	amount: string;
	city: string;
	postingDate: string;
	originalAmountDate: string;
	description: string;
	reserveAmtFl: boolean;
	digitalReceiptsStatus: string;
	subTransactionDetails: boolean;
	[property: string]: any
}

export namespace Transaction {
	export function toModel(transaction: Transaction, type: "purchase" | "payment", name?: string): model.Transaction {
		return {
			type,
			date: transaction.transactionId.toString().substring(0,4) + "-" + transaction.originalAmountDate,
			amount: transaction.amountNumber,
			description: transaction.description,
			city: transaction.city,
			card: "SEB Mastercard",
			name,
		}
	}
}
