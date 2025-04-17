import zod from "zod";

export const createOfferValidator = zod.object({
  amount: zod.bigint().min(0n),
});
