import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import type { Hex } from "viem";
import { useGraphQLService } from "~~/server/services/graphql_service";
import { useViemService } from "~~/server/services/viem_service";

const QUERY = `
query GetProperties($address: String){
  realEstateOwners(where: {ownerAddress_eq: $address}) {
    ownerAddress
    realEstate {
      tokenId
      contractAddress
      description
      image
      latitude
      legalDocumentHash
      longitude
      id
      name
      propertyAddress
      squareMeters
      tokenUri
      verified
      verifier
      yearBuilt
      transfers {
        from
        id
        txHash
        timestamp
        to
        blockNumber
      }
    }
  }
}`;

type Transfer = {
  from: string;
  id: string;
  txHash: string;
  timestamp: string;
  to: string;
  blockNumber: string;
};

type RealEstate = {
  tokenId: string;
  contractAddress: string;
  description: string;
  image: string;
  latitude: string;
  legalDocumentHash: string;
  longitude: string;
  id: string;
  name: string;
  propertyAddress: string;
  squereMeters: string;
  tokenUri: string;
  verified: boolean;
  verifier: string;
  yearBuilt: string;
  transfers: Transfer[];
};

type RealEstateOwner = {
  ownerAddress: string;
  realEstate: RealEstate[];
};

export default defineEventHandler(async (event) => {
  const gqlClient = useGraphQLService();
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  const client = await serverSupabaseClient<Database>(event);

  const { data: wallet } = await client
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!wallet) {
    throw createError({
      statusCode: 404,
      statusMessage: "Wallet not found",
    });
  }

  const { getAddress } = useViemService();

  const address = getAddress(wallet.private_key as Hex);

  const owner = await (gqlClient.query("GetProperties", QUERY, {
    address,
  }) as Promise<RealEstateOwner>);
  if (!owner) {
    throw createError({
      statusCode: 404,
      statusMessage: "Owner not found",
    });
  }
  console.log(owner);
  return owner.realEstate;
});
