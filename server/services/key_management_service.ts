import type { H3Event, EventHandlerRequest } from "h3";
import { ofetch } from "ofetch";
import type { Hex } from "viem";

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

    const resp = await api<KeyManagementResponse>("/key", {
      credentials: "include",
      headers: {
        Cookie: `${TOKEN_COOKIE_0}=${cookie0}; ${TOKEN_COOKIE_1}=${cookie1}`,
      },
    });
    return resp.privateKey;
  };

  return { getCurrentKey };
}
