import type { H3Event } from "h3";
const RUNTIME_CONFIG = useRuntimeConfig();

const TOKEN_COOKIE_0 = `sb-${RUNTIME_CONFIG.supabaseInstance}-auth-token.0`;
const TOKEN_COOKIE_1 = `sb-${RUNTIME_CONFIG.supabaseInstance}-auth-token.1`;

export const getAuthCookie = (event: H3Event) => {
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
  return `${TOKEN_COOKIE_0}=${cookie0}; ${TOKEN_COOKIE_1}=${cookie1}`;
};
