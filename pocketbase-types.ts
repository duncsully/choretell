/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Chores = "chores",
	Completions = "completions",
	LastCompletions = "last_completions",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type ChoresRecord = {
	cron_expr?: string
	description?: HTMLString
	done?: boolean
	name: string
}

export type CompletionsRecord = {
	by: RecordIdString
	chore: RecordIdString
}

export type LastCompletionsRecord<Tlast_completed = unknown> = {
	by: RecordIdString
	chore: RecordIdString
	last_completed?: null | Tlast_completed
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type ChoresResponse<Texpand = unknown> = Required<ChoresRecord> & BaseSystemFields<Texpand>
export type CompletionsResponse<Texpand = unknown> = Required<CompletionsRecord> & BaseSystemFields<Texpand>
export type LastCompletionsResponse<Tlast_completed = unknown, Texpand = unknown> = Required<LastCompletionsRecord<Tlast_completed>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	chores: ChoresRecord
	completions: CompletionsRecord
	last_completions: LastCompletionsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	chores: ChoresResponse
	completions: CompletionsResponse
	last_completions: LastCompletionsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'chores'): RecordService<ChoresResponse>
	collection(idOrName: 'completions'): RecordService<CompletionsResponse>
	collection(idOrName: 'last_completions'): RecordService<LastCompletionsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
