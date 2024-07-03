/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Chores = "chores",
	ChoresWithLatestCompletions = "choresWithLatestCompletions",
	Completions = "completions",
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

export type ChoresWithLatestCompletionsRecord<Tcompleted_time = unknown> = {
	completed_by: RecordIdString
	completed_time?: null | Tcompleted_time
	completion_id?: RecordIdString
	description?: HTMLString
	done?: boolean
	name: string
}

export type CompletionsRecord = {
	by: RecordIdString
	chore: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type ChoresResponse<Texpand = unknown> = Required<ChoresRecord> & BaseSystemFields<Texpand>
export type ChoresWithLatestCompletionsResponse<Tcompleted_time = unknown, Texpand = unknown> = Required<ChoresWithLatestCompletionsRecord<Tcompleted_time>> & BaseSystemFields<Texpand>
export type CompletionsResponse<Texpand = unknown> = Required<CompletionsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	chores: ChoresRecord
	choresWithLatestCompletions: ChoresWithLatestCompletionsRecord
	completions: CompletionsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	chores: ChoresResponse
	choresWithLatestCompletions: ChoresWithLatestCompletionsResponse
	completions: CompletionsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'chores'): RecordService<ChoresResponse>
	collection(idOrName: 'choresWithLatestCompletions'): RecordService<ChoresWithLatestCompletionsResponse>
	collection(idOrName: 'completions'): RecordService<CompletionsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
