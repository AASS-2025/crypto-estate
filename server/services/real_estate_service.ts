import type { Address } from "viem";
import { useViemService } from "./viem_service";
import RealEstateABI, {
  REAL_ESTATE_ADDRESS,
} from "~~/shared/abi/RealEstateABI";

export function useRealEstateService() {
  const { client } = useViemService();

  const getBalance = (add: Address) => {
    return client.readContract({
      address: REAL_ESTATE_ADDRESS,
      abi: RealEstateABI,
      functionName: "balanceOf",
      args: [add],
    });
  };

  return { getBalance };
}
