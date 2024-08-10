import PocketBase from 'pocketbase'
import { TypedPocketBase } from '../pocketbase-types'

export const pb = new PocketBase(
  import.meta.env.DEV ? 'http://localhost:8090' : window.location.origin
) as TypedPocketBase
