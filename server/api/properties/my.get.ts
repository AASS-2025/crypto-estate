import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import type { Hex } from "viem";
import { useGraphQLService } from "~~/server/services/graphql_service";
import { useViemService } from "~~/server/services/viem_service";
import type { RealEstateOwner } from "~~/shared/types/property";

const QUERY = `
query GetProperties($address: String){
  realEstateOwners(where: {ownerAddress_eq: $address}) {
    ownerAddress
    realEstate {
      id
      name
      tokenId
      contractAddress
      description
      image
      latitude
      legalDocumentHash
      longitude
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
      offers {
        id
        price
        blockNumber
        seller
        timestamp
        txHash
      }
    }
  }
}`;

type QueryResponse = {
  realEstateOwners: RealEstateOwner[];
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

  const resp = await gqlClient.query<QueryResponse>("GetProperties", QUERY, {
    address,
  });
  return resp.realEstateOwners;
});
