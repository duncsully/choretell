import PocketBase from 'pocketbase'
import { TypedPocketBase } from '../pocketbase-types'

export const pb = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL
) as TypedPocketBase
