import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Hex } from "viem";
import { useMarketService } from "~~/server/services/market_service";
import { useRealEstateService } from "~~/server/services/real_estate_service";
import { useViemService } from "~~/server/services/viem_service";
import { createOfferValidator } from "~~/server/validators/offer_validator";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  const body = await readValidatedBody(event, createOfferValidator.parse);
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
  const { getAccount, getAddress } = useViemService();
  const { createOffer } = useMarketService(event);
  const { isApprovedForMarket, approveForMarket } = useRealEstateService();

  const privateKey = wallet.private_key as Hex;
  const address = getAddress(privateKey);
  const account = getAccount(privateKey);
  // Check if is approved for market
  const isApproved = await isApprovedForMarket(address);
  if (!isApproved) {
    // Approve for market
    const approved = await approveForMarket(account);
    if (!approved) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to approve for market",
      });
    }
  }
  console.log("Creating offer...", {
    account: account.address,
    tokenId,
    price: body.amount,
  });
  return await createOffer(tokenId, body.amount);
});
