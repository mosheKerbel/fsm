## Demo

Check out the live demo of the State Machine Library [here](https://intuit-fsm.vercel.app/).

## Instructions on how to run locally:

To run the demo app locally, follow these steps:

```
yarn
yarn dev
```

## What I would do additionally or differently if I had infinite time

#### Adding this description here as it was part of the instructions of the home assignment:

1. Remove the utils I created for deepClone and random id generator and use a library like Lodash. I sturggled with jest configuration issues of ESM / CJS modules of external libraries so I decided to fallback into this custom implementation.
2. Write full types for the missing parts using Generics.
3. Write down a more complex Demo app to be able to showcase the advantages of a Finite State Machine in a real world application.