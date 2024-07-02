import PocketBase from 'pocketbase'
import { TypedPocketBase } from '../pocketbase-types'

// TODO: Use environment variables
export const pb = new PocketBase(
  import.meta.env.DEV
    ? 'http://localhost:8090'
    : import.meta.env.VITE_POCKETBASE_URL
) as TypedPocketBase
