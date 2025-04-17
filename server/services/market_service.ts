import RealEstateMarketABI, {
  REAL_ESTATE_MARKET_ADDRESS,
} from "~~/shared/abi/RealEstateMarketABI";
import { useViemService } from "./viem_service";
import type { Account } from "viem";
import { REAL_ESTATE_ADDRESS } from "~~/shared/abi/RealEstateABI";
import consola from "consola";

const logger = consola.create({
  defaults: {
    tag: "market_service",
  },
});

export function useMarketService() {
  const { client } = useViemService();

  const createOffer = async (
    account: Account,
    tokenId: bigint,
    price: bigint
  ) => {
    logger.info("Creating offer", {
      tokenId,
      price,
    });
    const { request } = await client.simulateContract({
      address: REAL_ESTATE_MARKET_ADDRESS,
      abi: RealEstateMarketABI,
      functionName: "createOffer",
      args: [tokenId, REAL_ESTATE_ADDRESS, price],
      account,
    });
    const resp = await client.writeContract(request);
    logger.success("Offer created", {
      resp,
    });
    return resp;
  };

  return { createOffer };
}
