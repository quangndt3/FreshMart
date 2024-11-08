export interface ErrorResponse {
   data: {
      message: string;
   };
}

export interface DataAuthResponse {
   body: {
      data: {
         accessToken: string;
         expires: number;
         data: IUser;
      };
   };
   message: string;
}

export interface AuthSignupInput {
   email: string;
   userName: string;
   password: string;
   phoneNumber: string;
   address: string;
   avatar?: string;
   confirmPassword: string;
}

export interface AuthLoginInput {
   email: string;
   password: string;
}

export interface IUser {
   _id?: string;
   userName: string;
   email: string;
   password?: string;
   phoneNumber: string;
   address: string;
   avatar: string;
   role: 'admin' | 'member';
   cartId?: string;
   orders?: string[];
   notifications?: string[];
   voucher?: string[];
   state?: boolean;
   createAt?: string;
}

export type InputUser = Omit<IUser, '_id' | 'createAt'>;

export interface TokenResponse {
   body: {
      accessToken: string;
      expries: number;
      data: IUser;
   };
   message: string;
   status: number;
}
