/**
 * Take wei string and convert to float ETH
 * @param wei
 * @returns
 */
export const weiToEth = (wei: string) => {
  const weiBigInt = BigInt(wei);
  const ethBigInt = weiBigInt / BigInt(10 ** 18);
  const ethDecimal = weiBigInt % BigInt(10 ** 18);
  const ethFloat = Number(ethBigInt) + Number(ethDecimal) / Math.pow(10, 18);
  return ethFloat;
};

/**
 * Take float ETH and convert to wei string
 * @param eth
 * @returns
 */
export const ethToWei = (eth: number) => {
  const weiBigInt = BigInt(Math.floor(eth * Math.pow(10, 18)));
  return weiBigInt.toString();
};
