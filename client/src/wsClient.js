import {createClient} from 'graphql-ws'

const client = createClient({url: 'ws://localhost:3000/graphql'});

export default client;