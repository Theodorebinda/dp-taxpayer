import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
  type QueryKey,
} from "@tanstack/react-query";

export function useApiQuery<TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">
) {
  return useQuery({ queryKey, queryFn, ...options });
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
    queryFn,
    ...options,
  });
}

export function useApiMutation<TInput, TOutput>(
  mutationFn: (input: TInput) => Promise<TOutput>,
  options?: UseMutationOptions<TOutput, unknown, TInput>
) {
  return useMutation({ mutationFn, ...options });
}
