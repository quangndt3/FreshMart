import { IProductExpanded } from "./product";

export interface ICartDataBaseItem{
    productId:IProductExpanded,
    weight:number,
    _id:string
}
export interface ICartDataBase{
    products:ICartDataBaseItem[]
}