import React from 'react'
import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'
type SWRConfig = {
  url: string
}
export type GardevoirReturnOptions = SWRConfig & SWRConfiguration
type QueryOptions = {
  FetchOptions?: { [key: string]: any }
  SwrOptions?: SWRConfiguration
}
type TypeGardevoirConfig = { [key: string]: (options: QueryOptions) => GardevoirReturnOptions }
const fetcher = (url: string) => fetch(url).then((res) => res.json())
export default function GardevoirInitialize<T extends TypeGardevoirConfig>(GardevoirConfig: T) {
  const findAPIbyName = React.useCallback(
    (apiName: keyof T, QueryOptions: TypeGardevoirConfig) => {
      const swrConfigFn = GardevoirConfig?.[apiName]
      if (typeof swrConfigFn === 'function') {
        const { url, ...rest } = swrConfigFn(QueryOptions)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useSWR(url, fetcher, rest)
      }
      // eslint-disable-next-line react-hooks/rules-of-hooks
      if (typeof apiName === 'string') return useSWR(apiName, fetcher, {})
      return apiName
    },
    [GardevoirConfig],
  )
  return findAPIbyName
}
