import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Hex } from "viem";
import { useMarketService } from "~~/server/services/market_service";
import { useViemService } from "~~/server/services/viem_service";
import { buyOfferValidator } from "~~/server/validators/offer_validator";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  const body = await readValidatedBody(event, buyOfferValidator.parse);
  const rawTokenId = getRouterParam(event, "id");
  if (!rawTokenId) {
    throw createError({
      statusCode: 400,
      statusMessage: "TokenId is required",
    });
  }
  // Check if tokenId is valid BigInt
  const tokenId = BigInt(rawTokenId);
  const client = await serverSupabaseClient<Database>(event);
  // Check if wallet already exists
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
  const { getAccount } = useViemService();
  const { buyOffer } = useMarketService(event);

  const privateKey = wallet.private_key as Hex;
  const account = getAccount(privateKey);

  return await buyOffer(account, tokenId, body.price);
});
