import React from 'react'
import useSWR from 'swr'
import { SWRConfiguration } from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function GardevoirInitialize(config: { [key: string]: any }) {
  const findApi = React.useCallback(
    (
      api: keyof typeof config,
      {
        query = {},
        customConfig = {},
      }: {
        query?: { [key: string]: any }
        customConfig?: SWRConfiguration
      } = {},
    ) => {
      const swrConfigFn = config?.[api]

      if (typeof swrConfigFn === 'function') {
        const { url, ...rest } = swrConfigFn(query, customConfig)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useSWR(url, fetcher, {
          ...rest,
        })
      }
      // eslint-disable-next-line react-hooks/rules-of-hooks
      if (typeof api === 'string') return useSWR(api, fetcher, {})

      return api
    },
    [config],
  )
  return findApi
}
