import useSWR from 'swr';
import { SWRConfiguration } from 'swr';

export const fetcher = (url : string) => fetch(url).then(res => res.json());

export default function initializeGardevoir(config : { [key:string] : any }){
    function useGardevoir( api : keyof typeof config,
        {
            query = {},
            customConfig = {}
        } : {
            query? : { [key:string] : any };
            customConfig?: SWRConfiguration } = {}
    ) {
        const swrConfigFn = config?.[api];
    
        if(typeof swrConfigFn === 'function'){
            const {url, ...rest} = swrConfigFn(query,customConfig);
            return createRequest(url,rest);
        }
        if(typeof api === 'string') return createRequest(api);
        
        throw new Error('The API name does not exist in the configuration.');
    }
    return useGardevoir
}


function createRequest(url : string,rest={}){
    return useSWR(
        url,fetcher, {
            ...rest
        }
    )
}