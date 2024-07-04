import type {
  ChoresResponse,
  LastCompletionsResponse,
} from '../pocketbase-types'

export type ChoreWithLastCompletion = ChoresResponse<{
  last_completions_via_chore: LastCompletionsResponse[]
}>
