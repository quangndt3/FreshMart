export interface IunsoldProduct {
    productName: string;
    shipments :[
        {
            shipmentId: string;
            purchasePrice: number;
            weight: number;
            _id: string;
            date: string
        } | null
    ]
    createdAt: string 
}

