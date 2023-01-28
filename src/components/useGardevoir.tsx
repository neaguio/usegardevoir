import React from 'react'
import useSWR from 'swr'
import { SWRConfiguration } from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// export interface ConfigType {
//   property1: string;
//   property2: string;
// }

// export default function GardevoirInitialize(config: { [key: string]: any }) {
//   const findApi = React.useCallback(
//     (
//       api: keyof typeof config,
//       {
//         query = {},
//         customConfig = {},
//       }: {
//         query?: { [key: string]: any }
//         customConfig?: SWRConfiguration
//       } = {},
//     ) => {
//       const swrConfigFn = config?.[api]

//       if (typeof swrConfigFn === 'function') {
//         const { url, ...rest } = swrConfigFn(query, customConfig)
//         // eslint-disable-next-line react-hooks/rules-of-hooks
//         return useSWR(url, fetcher, {
//           ...rest,
//         })
//       }
//       // eslint-disable-next-line react-hooks/rules-of-hooks
//       if (typeof api === 'string') return useSWR(api, fetcher, {})

//       return api;
//     },
//     [config],
//   )
//   return findApi
// }

interface SWRConfig {
  url: string
  [key: string]: any
}

interface GardevoirInitializeConfig {
  [key: string]: (query?: { [key: string]: any }, customConfig?: SWRConfiguration) => SWRConfig
}

export default function GardevoirInitialize(config: GardevoirInitializeConfig) {
  const findApi = React.useCallback(
    (
      api: keyof GardevoirInitializeConfig,
      options: { query?: { [key: string]: any }; customConfig?: SWRConfiguration } = {},
    ) => {
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
