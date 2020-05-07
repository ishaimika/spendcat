import * as model from "../Transaction"
import { RootObject } from "./RootObject"
import { Body } from "./Body"

export async function fetch(jsonData: RootObject): Promise<model.Transaction[]> {
	const data = Body.toModel(jsonData.body)
    return data
}

