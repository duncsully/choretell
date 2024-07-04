package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("bxobll92tr4ycqw")
		if err != nil {
			return err
		}

		options := map[string]any{}
		if err := json.Unmarshal([]byte(`{
			"query": "SELECT chores.id, chores.name, chores.description, chores.done, chores.created, chores.updated, completions.id AS completion_id, completions.by AS completed_by, MAX(completions.created) AS completed_time\nFROM chores\nLEFT JOIN completions ON chores.id = completions.chore\nGROUP BY chores.id"
		}`), &options); err != nil {
			return err
		}
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("32oajiaf")

		// remove
		collection.Schema.RemoveField("4kjdv6v7")

		// remove
		collection.Schema.RemoveField("lqo53dsi")

		// remove
		collection.Schema.RemoveField("6kvap8uy")

		// remove
		collection.Schema.RemoveField("jqtj2y1z")

		// remove
		collection.Schema.RemoveField("loq38bxn")

		// add
		new_name := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "iowcyyzh",
			"name": "name",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_name); err != nil {
			return err
		}
		collection.Schema.AddField(new_name)

		// add
		new_description := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "4vtxhhnc",
			"name": "description",
			"type": "editor",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"convertUrls": false
			}
		}`), new_description); err != nil {
			return err
		}
		collection.Schema.AddField(new_description)

		// add
		new_done := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "ylldsf2a",
			"name": "done",
			"type": "bool",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {}
		}`), new_done); err != nil {
			return err
		}
		collection.Schema.AddField(new_done)

		// add
		new_completion_id := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "0ubh0pty",
			"name": "completion_id",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "togr2mnei0mie72",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_completion_id); err != nil {
			return err
		}
		collection.Schema.AddField(new_completion_id)

		// add
		new_completed_by := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "iofhb5ze",
			"name": "completed_by",
			"type": "relation",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "_pb_users_auth_",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_completed_by); err != nil {
			return err
		}
		collection.Schema.AddField(new_completed_by)

		// add
		new_completed_time := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "5lya9agl",
			"name": "completed_time",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), new_completed_time); err != nil {
			return err
		}
		collection.Schema.AddField(new_completed_time)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("bxobll92tr4ycqw")
		if err != nil {
			return err
		}

		options := map[string]any{}
		if err := json.Unmarshal([]byte(`{
			"query": "SELECT chores.id, chores.name, chores.description, chores.done, chores.created, chores.updated, completions.id AS completion_id, completions.by AS completed_by, MAX(completions.created) AS completed_time\nFROM chores\nINNER JOIN completions ON chores.id = completions.chore\nGROUP BY chores.id"
		}`), &options); err != nil {
			return err
		}
		collection.SetOptions(options)

		// add
		del_name := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "32oajiaf",
			"name": "name",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), del_name); err != nil {
			return err
		}
		collection.Schema.AddField(del_name)

		// add
		del_description := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "4kjdv6v7",
			"name": "description",
			"type": "editor",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"convertUrls": false
			}
		}`), del_description); err != nil {
			return err
		}
		collection.Schema.AddField(del_description)

		// add
		del_done := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "lqo53dsi",
			"name": "done",
			"type": "bool",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {}
		}`), del_done); err != nil {
			return err
		}
		collection.Schema.AddField(del_done)

		// add
		del_completion_id := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "6kvap8uy",
			"name": "completion_id",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "togr2mnei0mie72",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), del_completion_id); err != nil {
			return err
		}
		collection.Schema.AddField(del_completion_id)

		// add
		del_completed_by := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "jqtj2y1z",
			"name": "completed_by",
			"type": "relation",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "_pb_users_auth_",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), del_completed_by); err != nil {
			return err
		}
		collection.Schema.AddField(del_completed_by)

		// add
		del_completed_time := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "loq38bxn",
			"name": "completed_time",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), del_completed_time); err != nil {
			return err
		}
		collection.Schema.AddField(del_completed_time)

		// remove
		collection.Schema.RemoveField("iowcyyzh")

		// remove
		collection.Schema.RemoveField("4vtxhhnc")

		// remove
		collection.Schema.RemoveField("ylldsf2a")

		// remove
		collection.Schema.RemoveField("0ubh0pty")

		// remove
		collection.Schema.RemoveField("iofhb5ze")

		// remove
		collection.Schema.RemoveField("5lya9agl")

		return dao.SaveCollection(collection)
	})
}
