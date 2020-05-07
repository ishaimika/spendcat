import { ForeignDetails } from "./ForeignDetails"
export interface Transaction {
	identifier: string
	description: string
	statement_end_date: string
	charge_date: string
	supplementary_index: string
	amount: number
	type: string
	reference_id: string
	post_date: string
	first_name: string
	last_name: string
	embossed_name: string
	account_token: string
	sub_type: string
	foreign_details: ForeignDetails
}
