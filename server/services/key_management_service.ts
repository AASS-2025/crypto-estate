import type { H3Event, EventHandlerRequest } from "h3";
import { ofetch } from "ofetch";
import type {
  EncodeFunctionDataReturnType,
  Hex,
  SignTransactionReturnType,
} from "viem";
import { getAuthCookie } from "~~/shared/utils/supa";

const RUNTIME_CONFIG = useRuntimeConfig();

const api = ofetch.create({
  baseURL: RUNTIME_CONFIG.keyManagementApi,
});

type KeyManagementResponse = {
  privateKey: Hex;
};

type SignTransactionResponse = {
  signature: SignTransactionReturnType;
};

export function useKeyManagementService(event: H3Event<EventHandlerRequest>) {
  const getCurrentKey = async () => {
    const resp = await api<KeyManagementResponse>("/key", {
      credentials: "include",
      headers: {
        Cookie: getAuthCookie(event),
      },
    });
    return resp.privateKey;
  };

  const signTransaction = async (
    data: EncodeFunctionDataReturnType,
    to: Hex,
    value?: bigint
  ) => {
    const resp = await api<SignTransactionResponse>("/sign", {
      method: "POST",
      body: {
        data,
        to,
        value: value ? value.toString() : undefined,
      },
      credentials: "include",
      headers: {
        Cookie: getAuthCookie(event),
      },
    });
    return resp.signature;
  };

  return { getCurrentKey, signTransaction };
}
