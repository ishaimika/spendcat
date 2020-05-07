export interface Transaction {
    type: "purchase" | "payment" 
    date: string
    amount: number
    description: string
    city: string
    card: string
    name: string
}
