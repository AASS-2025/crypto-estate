export type Transfer = {
  from: string;
  id: string;
  txHash: string;
  timestamp: string;
  to: string;
  blockNumber: string;
};

export type RealEstate = {
  id: string;
  contractAddress: string;
  tokenId: string;
  description: string | null;
  image: string | null;
  latitude: string | null;
  legalDocumentHash: string | null;
  longitude: string | null;
  name: string | null;
  propertyAddress: string | null;
  squareMeters: string | null;
  tokenUri: string | null;
  verified: boolean | null;
  verifier: string | null;
  yearBuilt: string | null;
  transfers: Transfer[] | null;
  offers: Offer[];
};

export type RealEstateOwner = {
  ownerAddress: string;
  realEstate: RealEstate;
};

export type Offer = {
  id: string;
  price: string;
  blockNumber: number;
  seller: string;
  timestamp: number;
  txHash: string;
};

export type OfferWithRealEstate = Offer & {
  realEstate: RealEstate;
};
