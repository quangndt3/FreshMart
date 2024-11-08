export interface IEvaluation {
   
    productId: string;
    content?: string;
    imgUrl?: string;
    rate: number;
    orderId: string | null;
    phoneNumber?: string;
    userName?: string 
    userId? : string | null
}

export interface IEvaluationFull {
    _id:string;
    userId : {
        avatar:string;
        userName: string
        phoneNumber: string
        rate: number
    }  | null;
    
    productId:{
        images: {
            url : string
        }[];
        productName: string
        
    }  | null
    content: string;
    imgUrl: string;
    rate: number;
    orderId: string | null;
    isReviewVisible: boolean;
    phoneNumber: string;
    userName: string;
    createdAt: string 
}