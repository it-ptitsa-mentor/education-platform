export enum LoadingStatus {
  Loading = 'loading',
  Error = 'error',
  Success = 'success',
}

export type DataState =
  | { status: LoadingStatus.Loading }
  | { status: LoadingStatus.Error; error: Error }
  | { status: LoadingStatus.Success; data: number };

export const handleData = (state: DataState): string => {
  switch (state.status) {
    case LoadingStatus.Loading:
      return 'loading...';
    case LoadingStatus.Error:
      return state.error.message;
    case LoadingStatus.Success:
      return String(state.data);
    default:
      return 'unknown';
  }
};
