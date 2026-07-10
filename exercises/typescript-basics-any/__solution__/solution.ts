// @ts-check

/* eslint-disable @typescript-eslint/no-explicit-any */

const getParams = (query: string): any => {
  const params: any = {}
  query.split('&').forEach((pair) => {
    const [key, value] = pair.split('=')
    params[key] = value
  })
  return params
}

export default getParams
