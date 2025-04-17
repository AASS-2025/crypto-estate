type GraphQLResponse<T> = {
  data: T;
  errors?: {
    message: string;
    locations: {
      line: number;
      column: number;
    }[];
  };
};

export function useGraphQLService() {
  const RUNTIME_CONFIG = useRuntimeConfig();
  const query = async <T>(
    operationName: string,
    query: string,
    variables: Record<string, unknown> = {}
  ) => {
    const resp = await $fetch<GraphQLResponse<T>>(RUNTIME_CONFIG.gqlHost, {
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
    console.error(resp);
    if (resp.errors) {
      throw createError({
        statusCode: 500,
        statusMessage: "GraphQL error",
        data: resp.errors,
      });
    }
    return resp.data;
  };

  return { query };
}
