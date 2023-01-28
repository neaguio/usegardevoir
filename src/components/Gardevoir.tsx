import React from 'react'
import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'
const fetcher = (url: string) => fetch(url).then((res) => res.json())

type SWRConfig = {
  url: string
}

type SWRExtendedConfig = SWRConfig & SWRConfiguration

type QueryOptionsData = { [key: string]: any }

interface QueryOptions {
  FetchOptions: QueryOptionsData
  SwrOptions?: SWRConfiguration
}

export type TypeGardevoirConfig = { [key: string]: (options: QueryOptions) => SWRExtendedConfig }

export default function GardevoirInitialize<T extends TypeGardevoirConfig>(GardevoirConfig: T) {
  const findAPIbyName = React.useCallback(
    (apiName: keyof T, QueryOptions: QueryOptions) => {
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
