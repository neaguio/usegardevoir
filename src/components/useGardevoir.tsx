import React from 'react'
import useSWR from 'swr'
import { SWRConfiguration } from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface SWRConfig {
  url: string
  [key: string]: any
}

export default function GardevoirInitialize<
  T extends { [key: string]: (query?: { [key: string]: any }, customConfig?: SWRConfiguration) => SWRConfig },
>(config: T) {
  const findApi = React.useCallback(
    (api: keyof T, options: { query?: { [key: string]: any }; customConfig?: SWRConfiguration } = {}) => {
      const swrConfigFn = config?.[api]

      if (typeof swrConfigFn === 'function') {
        const { url, ...rest } = swrConfigFn(options.query, options.customConfig)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useSWR(url, fetcher, rest)
      }
      // eslint-disable-next-line react-hooks/rules-of-hooks
      if (typeof api === 'string') return useSWR(api, fetcher, {})

      return api
    },
    [config],
  )
  return findApi
}
