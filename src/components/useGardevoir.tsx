import React from 'react'
import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface SWRConfig {
  url: string
  [key: string]: any
}

type QueryOptionsData = { [key: string]: any }

interface QueryOptions {
  FetchOptions: QueryOptionsData
  SwrOptions: SWRConfiguration
}

export default function GardevoirInitialize<T extends { [key: string]: (FetchOptions: QueryOptions) => SWRConfig }>(
  ApiConfig: T,
) {
  const findAPIbyName = React.useCallback(
    (apiName: keyof T, QueryOptions: QueryOptions) => {
      const swrConfigFn = ApiConfig?.[apiName]

      if (typeof swrConfigFn === 'function') {
        const { url, ...rest } = swrConfigFn(QueryOptions)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useSWR(url, fetcher, rest)
      }
      // eslint-disable-next-line react-hooks/rules-of-hooks
      if (typeof apiName === 'string') return useSWR(apiName, fetcher, {})

      return apiName
    },
    [ApiConfig],
  )
  return findAPIbyName
}
