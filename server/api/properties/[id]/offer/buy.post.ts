import {serverSupabaseUser } from "#supabase/server";
import { useKafkaMarketService } from "~~/server/services/kafka_market_service";
import { buyOfferValidator } from "~~/server/validators/offer_validator";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const marketService = useKafkaMarketService();
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  const body = await readValidatedBody(event, buyOfferValidator.parse);
  const rawOfferId = getRouterParam(event, "id");
  if (!rawOfferId) {
    throw createError({
      statusCode: 400,
      statusMessage: "TokenId is required",
    });
  }
  // Check if tokenId is valid BigInt
  const offerId = BigInt(rawOfferId);
  try {
    const processId = await marketService.startBuyMarketOffer(
      offerId.toString(),
      user.id
    );
    return {
      success: true,
      processInstanceId: processId,
      message: "Offer purchase process started"
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to buy offer with error: " + error.message
    });
  }
});