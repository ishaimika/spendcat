import { CardGroup } from "./CardGroup";
import { TransactionGroup } from "./TransactionGroup";
import * as model from "../Transaction"

export interface Body {
	total: string;
	moreDataExists: boolean;
	cardGroups: CardGroup[];
	transactionGroups: TransactionGroup[];
    totalNumber: number;
    [property: string]: any
}
export namespace Body {
	export function toModel(body: Body): model.Transaction[] {
        return ([] as model.Transaction[]).concat(...body.cardGroups.map(t => CardGroup.toModel(t)), ...body.transactionGroups.map(t => TransactionGroup.toModel(t)))
	}
}