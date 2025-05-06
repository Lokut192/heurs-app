import type {
  DefaultError,
  UseBaseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';

export type UseSoftQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
> = Omit<
  UseBaseQueryOptions<TQueryFnData, TError, TData>,
  'queryFn' | 'queryKey' | 'select'
>;

export type UseSoftMutationOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationFn' | 'mutationKey' | 'select'
>;
