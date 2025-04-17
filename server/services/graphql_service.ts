export function useGraphQLService() {
  const RUNTIME_CONFIG = useRuntimeConfig();
  const query = (
    operationName: string,
    query: string,
    variables: Record<string, unknown> = {}
  ) => {
    return $fetch(RUNTIME_CONFIG.public.gqlHost, {
      method: "POST",
      body: JSON.stringify({
        operationName,
        query,
        variables,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return { query };
}
