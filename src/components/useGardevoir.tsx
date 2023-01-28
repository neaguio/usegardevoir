import React from 'react'
import useSWR from 'swr'
import { SWRConfiguration } from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface SWRConfig {
  url: string
  [key: string]: any
}

type QueryOptionsData = { [key: string]: any };

interface QueryOptions {
  QueryOptionsData?: QueryOptionsData;
  FetchOptions?: SWRConfiguration
}


export default function GardevoirInitialize<
  T extends { [key: string]: (QueryOptionsData?: QueryOptions) => SWRConfig  },
>(ApiConfig: T) {
  const findAPIbyName = React.useCallback(
    (apiName: keyof T, options: QueryOptions) => {
      const swrConfigFn = ApiConfig?.[apiName]

      if (typeof swrConfigFn === 'function') {
        const { url, ...rest } = swrConfigFn(options)
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
