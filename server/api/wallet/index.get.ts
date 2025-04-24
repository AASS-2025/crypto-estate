import { useKeyManagementService } from "~~/server/services/key_management_service";
import { useViemService } from "~~/server/services/viem_service";

/**
 * @description This endpoint is used to check if a wallet exists for the user.
 */
export default defineEventHandler(async (event) => {
  const keyManagementService = useKeyManagementService(event);
  const privateKey = await keyManagementService.getCurrentKey();
  const { getAccount } = useViemService();
  return getAccount(privateKey);
});
