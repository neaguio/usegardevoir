<center>
  <img src="gardevoir.webp" width="100" height="100"/>
</center>

---

Using **SWR** from Vercel as dependency, **Gardevoir** helps you define your routes and map them to specific components with ease.



### How to use :

1. Create a config file : 
```js
import { GardevoirReturnOptions } from "usegardevoir";
const config  = {
    getPokemon : (FetchOptions, SwrOptions) 
      : GardevoirReturnOptions  => {
        const {name} = FetchOptions || "gardevoir";
        return {
            url : `https://pokeapi.co/api/v2/pokemon/${name}`,
            revalidateIfStale : true,
            revalidateOnFocus : true,
            ...SwrOptions
        }
    }
}
export default config;
```

2.  Create a hook to get the react callback function based on your config file.
```js
import initializeGardevoir from 'usegardevoir';
import config from './config';
function useGardevoir(){
    const gardevoirCb = initializeGardevoir(config);
    return gardevoirCb;
};
export default useGardevoir;
```

3. Inside your component run the hook.
```js
  const swr = useGardevoir();
  const data = swr('getPokemon',{
    FetchOptions : {
      name : 'ditto'
    },
    SwrOptions : {
      // if needed
    }
  })
```


Both FetchOptions and SwrOptions are optional, SwrOptions retrieve the types from SwrConfiguration and you'll receive the name of keys from the config file as api.