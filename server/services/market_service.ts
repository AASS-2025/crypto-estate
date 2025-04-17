import RealEstateMarketABI, {
  REAL_ESTATE_MARKET_ADDRESS,
} from "~~/shared/abi/RealEstateMarketABI";
import { useViemService } from "./viem_service";
import type { Account } from "viem";
import { REAL_ESTATE_ADDRESS } from "~~/shared/abi/RealEstateABI";

export function useMarketService() {
  const { client } = useViemService();

  const createOffer = async (
    account: Account,
    tokenId: bigint,
    price: bigint
  ) => {
    const { request } = await client.simulateContract({
      address: REAL_ESTATE_MARKET_ADDRESS,
      abi: RealEstateMarketABI,
      functionName: "createOffer",
      args: [tokenId, REAL_ESTATE_ADDRESS, price],
      account,
    });
    return await client.writeContract(request);
  };

  return { createOffer };
}
