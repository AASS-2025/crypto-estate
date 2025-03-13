import type { Address } from "viem";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import RealEstateABI, {
  REAL_ESTATE_ADDRESS,
} from "~~/shared/abi/RealEstateABI";

export function useViemService() {
  const client = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const getBalance = (add: Address) => {
    return client.readContract({
      address: REAL_ESTATE_ADDRESS,
      abi: RealEstateABI,
      functionName: "balanceOf",
      args: [add],
    });
  };

  return { client, getBalance };
}
