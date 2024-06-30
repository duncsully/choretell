import PocketBase from 'pocketbase'
import { TypedPocketBase } from '../pocketbase-types'

// TODO: Use environment variables
export const pb = new PocketBase('http://localhost:8090') as TypedPocketBase
