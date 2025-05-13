import type { H3Event, EventHandlerRequest } from "h3";
import { ofetch } from "ofetch";
import type { Hex } from "viem";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

const RUNTIME_CONFIG = useRuntimeConfig();

const api = ofetch.create({
  baseURL: RUNTIME_CONFIG.keyManagementApi,
});

type KeyManagementResponse = {
  privateKey: Hex;
};
export function useKeyManagementService(event: H3Event<EventHandlerRequest>) {
  const TOKEN_COOKIE_0 = `sb-${RUNTIME_CONFIG.supabaseInstance}-auth-token.0`;
  const TOKEN_COOKIE_1 = `sb-${RUNTIME_CONFIG.supabaseInstance}-auth-token.1`;

  const getCurrentKey = async () => {
    // Forward supabase cookies
    console.log(TOKEN_COOKIE_0, TOKEN_COOKIE_1);
    const cookie0 = getCookie(event, TOKEN_COOKIE_0);
    const cookie1 = getCookie(event, TOKEN_COOKIE_1);
    if (!cookie0) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized - missing cookie 0",
      });
    }
    if (!cookie1) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized - missing cookie 1",
      });
    }
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
    return existingWallets.private_key
  };

  return { getCurrentKey };
}
