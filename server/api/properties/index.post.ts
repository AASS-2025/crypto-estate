import { serverSupabaseUser } from "#supabase/server";
import { useViemService } from "~~/server/services/viem_service";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  const { getBalance } = useViemService();
  return getBalance("0x8643eFdC8F334cA8Db3fed16CcFB1Bb0f7b8dd99");
});
