import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { logger } from "camunda-external-task-client-js";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  const processId = getRouterParam(event, "id");
  if (!processId) {
      throw createError({
      statusCode: 400,
      statusMessage: "TransactionId is required",
      });
  }
  const client = await serverSupabaseClient<Database>(event);
  logger.success(`Fetching transaction with processId: ${processId} for user: ${user.id}`);
  const { data: transaction } = await client
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("process_id", processId)
    .single();

    return transaction;

});
