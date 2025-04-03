import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import { useViemService } from "~~/server/services/viem_service";
import type { Database } from "~~/shared/types/database";

/**
 * @description This endpoint is used to create a wallet for the user.
 */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  const client = await serverSupabaseClient<Database>(event);
  // Check if wallet already exists
  const { data, error: walletError } = await client
    .from("wallets")
    .select("*")
    .eq("user_id", user.id);
  if (walletError) {
    console.error("Error fetching wallets:", walletError);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
  if (data?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "Wallet already exists",
    });
  }
  const { generateAccount } = useViemService();
  const { error: insertError } = await client.from("wallets").insert({
    user_id: user.id,
    private_key: generateAccount(),
  });
  if (insertError) {
    console.error("Error creating wallet:", insertError);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
  setResponseStatus(event, 201);
});
