Using SWR as dependency, Gardevoir helps you define your routes and map them to specific components with ease.



### How to use :

1. Create a config file : 
```js
const config = {
    getPokemon(query = '', config = {}){
        return {
            url : `https://pokeapi.co/api/v2/pokemon/${query?.name}`,
            ...config,
        }
    }
}
export default config;
```

2.  Create a hook to trigger the fetch :
```js
import InitializeGardevoir from 'usegardevoir'
import config from './config';


const useGardevoir = () => {
    const useGardevoirCb = InitializeGardevoir(config);
    return useGardevoirCb;
}

export default useGardevoir;
```

3. Inside your component run the hook.
```js
const pokeDitto = useGardevoir()('getPokemon',{
    query : {
      name : 'ditto'
    }
})
```