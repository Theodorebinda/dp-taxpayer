import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
  type QueryKey,
  type QueryFunctionContext,
} from "@tanstack/react-query";

export function useApiQuery<TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey,
    queryFn,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });
}

export function useApiInfiniteQuery<
  TQueryFnData,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
>(
  queryKey: TQueryKey,
  queryFn: (context: { pageParam: TPageParam }) => Promise<TQueryFnData>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
    "queryKey" | "queryFn"
  >
): UseInfiniteQueryResult<TData, TError> {
  return useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>({
    queryKey,
    queryFn: (ctx: QueryFunctionContext<TQueryKey, TPageParam>) =>
      queryFn({ pageParam: ctx.pageParam as TPageParam }),
    getNextPageParam:
      ((options as unknown as { getNextPageParam?: unknown })
        ?.getNextPageParam as
        | ((
            lastPage: TQueryFnData,
            allPages: TQueryFnData[],
            lastPageParam: TPageParam,
            allPageParams: TPageParam[]
          ) => TPageParam)
        | undefined) ?? (() => undefined as unknown as TPageParam),
    initialPageParam:
      ((options as unknown as { initialPageParam?: TPageParam })
        ?.initialPageParam as TPageParam | undefined) ??
      (undefined as unknown as TPageParam),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });
}

export function useApiMutation<TInput, TOutput>(
  mutationFn: (input: TInput) => Promise<TOutput>,
  options?: UseMutationOptions<TOutput, unknown, TInput>
) {
  return useMutation({
    mutationFn,
    retry: 1,
    ...options,
  });
}
