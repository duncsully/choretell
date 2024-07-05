import type {
  ChoresResponse,
  LastCompletionsResponse,
  UsersResponse,
} from '../pocketbase-types'

export type ChoreWithLastCompletion = ChoresResponse<{
  last_completions_via_chore: LastCompletionsResponse<
    string,
    { by: UsersResponse }
  >[]
}>
