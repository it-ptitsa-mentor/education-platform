const loading: DataState = { status: LoadingStatus.Loading };
console.log(handleData(loading)); // loading...

const error: DataState = { status: LoadingStatus.Error, error: new Error('some error') };
console.log(handleData(error)); // some error

const success: DataState = { status: LoadingStatus.Success, data: 42 };
console.log(handleData(success)); // 42