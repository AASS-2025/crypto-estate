import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import type { Database } from "~~/shared/types/database";

/**
 * @description This endpoint is used to check if a wallet exists for the user.
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
  const { data: existingWallets } = await client
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (!existingWallets) {
    throw createError({
      statusCode: 404,
      statusMessage: "Wallet not found",
    });
  }
  setResponseStatus(event, 201);
});
