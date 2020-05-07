import { Body } from "./Body";
export interface RootObject {
	returnCode: string;
    body: Body;
    [property: string]: any
}
