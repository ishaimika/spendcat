import * as model from "../Transaction"
import { TransactionGroup } from "./TransactionGroup";
export interface CardGroup {
	nameOnCard: string;
	maskedCardNumber: string;
	transactionGroups: TransactionGroup[];
	total: string;
    totalNumber: number;
    [property: string]: any

}

export namespace CardGroup {
	export function toModel(cardgroup: CardGroup): model.Transaction[] {
        return ([] as model.Transaction[]).concat(...cardgroup.transactionGroups.map(t => TransactionGroup.toModel(t, cardgroup.nameOnCard)))
	}
}