export interface UserDataModel {
  id: number;
  username: string;
  email: string;
  password?: string;
  avatar?: Buffer;
}

export interface AuctionDataModel {
  id: number;
  title: string;
  description: string;
  startingBid: number;
  endDate: Date;
  userId: number;
  image?: Buffer;
}

export interface BidModel {
  id: number;
  amount: number;
  bidder: number;
  auctionId: number;
}
