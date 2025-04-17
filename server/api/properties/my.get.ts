import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import type { Hex } from "viem";
import { useGraphQLService } from "~~/server/services/graphql_service";
import { useViemService } from "~~/server/services/viem_service";
import type { ExtendedRealEstateOwner } from "~~/shared/types/property";

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

type QueryResponse = {
  realEstateOwners: ExtendedRealEstateOwner[];
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
  return resp.realEstateOwners.map((owner) => {
    return {
      ownerAddress: owner.ownerAddress,
      realEstate: {
        ...owner.realEstate,
        mine: owner.ownerAddress === address,
      },
    };
  });
});
