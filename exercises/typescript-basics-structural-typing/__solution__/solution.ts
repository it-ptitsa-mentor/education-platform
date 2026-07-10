// @ts-check

enum LoadingStatus {
  Loading,
  Success,
  Error,
}

type DataState =
  | { status: LoadingStatus.Loading }
  | { status: LoadingStatus.Success; data: number }
  | { status: LoadingStatus.Error; error: Error }

const handleData = (state: DataState): string => {
  switch (state.status) {
    case LoadingStatus.Loading:
      return 'loading...'
    case LoadingStatus.Success:
      return String(state.data)
    case LoadingStatus.Error:
      return state.error.message
    default:
      return String((state as { status: unknown }).status)
  }
}

export { DataState, LoadingStatus }
export default handleData
