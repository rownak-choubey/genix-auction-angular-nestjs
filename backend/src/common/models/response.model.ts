import { AuctionDataModel, BidModel, UserDataModel } from "./data.model";

export interface ResponseDataModel<T> {
    ResponseCode: number;
    ResponseData: T;
    ResponseMessage: string;
  }
  
  export interface AuctionResponseModel extends ResponseDataModel<AuctionDataModel> {}
  export interface UserResponseModel extends ResponseDataModel<UserDataModel> {}
  export interface BidResponseModel extends ResponseDataModel<BidModel> {}
  