import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import { useGraphQLService } from "~~/server/services/graphql_service";
import type { OfferWithRealEstate } from "~~/shared/types/property";

const QUERY = `
query GetOffers {
  offers(orderBy: timestamp_DESC, where: {status_eq: active})  {
    id
    price
    blockNumber
    seller
    timestamp
    txHash
    realEstate: realEstateId {
      id
      name
      contractAddress
      propertyAddress
      squareMeters
      tokenId
      verifier
      verified
      tokenUri
      yearBuilt
      longitude
      legalDocumentHash
      latitude
      image
      description
      transfers {
        blockNumber
        from
        id
        timestamp
        to
        txHash
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
}
`;
type QueryResponse = {
  offers: OfferWithRealEstate[];
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

  const resp = await gqlClient.query<QueryResponse>("GetOffers", QUERY);
  return resp.offers;
});
