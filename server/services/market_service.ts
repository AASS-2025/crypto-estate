import RealEstateMarketABI, {
  REAL_ESTATE_MARKET_ADDRESS,
} from "~~/shared/abi/RealEstateMarketABI";
import type { H3Event } from "h3";
import { useViemService } from "./viem_service";
import type { Account } from "viem";
import consola from "consola";
import { ofetch } from "ofetch";
import { getAuthCookie } from "~~/shared/utils/supa";

const logger = consola.create({
  defaults: {
    tag: "market_service",
  },
});

const RUNTIME_CONFIG = useRuntimeConfig();

const chainSystemApi = ofetch.create({
  baseURL: RUNTIME_CONFIG.chainSystemApi,
});

type CreateOfferResponse = {
  message: string;
  transactionHash: string;
};

export function useMarketService(event: H3Event) {
  const { client } = useViemService();

  const authCookie = getAuthCookie(event);
  console.log("Auth cookie", authCookie);

  const createOffer = async (tokenId: bigint, amount: bigint) => {
    const resp = await chainSystemApi<CreateOfferResponse>(
      `/properties/${tokenId}/offer`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Cookie: authCookie,
        },
        body: {
          amount: amount.toString(),
        },
      }
    );
    return resp;
  };

  const buyOffer = async (account: Account, tokenId: bigint, price: bigint) => {
    logger.info("Buying offer", {
      tokenId,
      price,
    });
    const { request } = await client.simulateContract({
      address: REAL_ESTATE_MARKET_ADDRESS,
      abi: RealEstateMarketABI,
      functionName: "buyOffer",
      args: [tokenId],
      account,
      value: price,
    });
    const resp = await client.writeContract(request);
    logger.success("Offer bought", {
      resp,
    });
    return resp;
  };

  const removeOffer = async (account: Account, tokenId: bigint) => {
    logger.info("Removing offer", {
      tokenId,
    });
    const { request } = await client.simulateContract({
      address: REAL_ESTATE_MARKET_ADDRESS,
      abi: RealEstateMarketABI,
      functionName: "removeOffer",
      args: [tokenId],
      account,
    });
    const resp = await client.writeContract(request);
    logger.success("Offer removed", {
      resp,
    });
    return resp;
  };

  return { createOffer, buyOffer, removeOffer };
}
