import React from 'react'
import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'
type SWRConfig = {
  url: string
}

export type GardevoirReturnOptions = SWRConfig & SWRConfiguration

export type QueryOptions = {
  FetchOptions?: any
  SwrOptions?: SWRConfiguration
}

type FetchOptions = {
  [key: string]: any
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type TypeGardevoirConfig = {
  [key: string]: (FetchOptions?: FetchOptions, SwrOptions?: SWRConfiguration) => GardevoirReturnOptions
}

export default function initializeGardevoir<T extends TypeGardevoirConfig>(GardevoirConfig: T) {
  const findAPIbyName = React.useCallback(
    (apiName: keyof T, QueryOptions: QueryOptions) => {
      const swrConfigFn = GardevoirConfig?.[apiName]
      if (typeof swrConfigFn === 'function') {
        let FetchOptions = {}
        let SwrOptions = {}
        if (QueryOptions?.FetchOptions) FetchOptions = QueryOptions.FetchOptions
        if (QueryOptions?.SwrOptions) SwrOptions = QueryOptions.SwrOptions
        const { url, ...rest } = swrConfigFn(FetchOptions, SwrOptions)
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
