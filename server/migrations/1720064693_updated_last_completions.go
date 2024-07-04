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

		collection, err := dao.FindCollectionByNameOrId("y7pp03b3d87p5dl")
		if err != nil {
			return err
		}

		options := map[string]any{}
		if err := json.Unmarshal([]byte(`{
			"query": "SELECT completions.id, completions.chore, MAX(completions.created) as last_completed, completions.by\nFROM completions\nGROUP BY completions.chore"
		}`), &options); err != nil {
			return err
		}
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("ljwuxcka")

		// remove
		collection.Schema.RemoveField("rm9rfgan")

		// remove
		collection.Schema.RemoveField("4nwqadyn")

		// add
		new_chore := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "uup2ksl5",
			"name": "chore",
			"type": "relation",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "lbxlgvp0hn17g3k",
				"cascadeDelete": true,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_chore); err != nil {
			return err
		}
		collection.Schema.AddField(new_chore)

		// add
		new_last_completed := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "kv0pog8o",
			"name": "last_completed",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), new_last_completed); err != nil {
			return err
		}
		collection.Schema.AddField(new_last_completed)

		// add
		new_by := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "abifvj1g",
			"name": "by",
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
		}`), new_by); err != nil {
			return err
		}
		collection.Schema.AddField(new_by)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("y7pp03b3d87p5dl")
		if err != nil {
			return err
		}

		options := map[string]any{}
		if err := json.Unmarshal([]byte(`{
			"query": "SELECT completions.id, completions.chore, MAX(completions.created) as last_completed, completions.by\nFROM completions\nGROUP BY completions.id"
		}`), &options); err != nil {
			return err
		}
		collection.SetOptions(options)

		// add
		del_chore := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "ljwuxcka",
			"name": "chore",
			"type": "relation",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "lbxlgvp0hn17g3k",
				"cascadeDelete": true,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), del_chore); err != nil {
			return err
		}
		collection.Schema.AddField(del_chore)

		// add
		del_last_completed := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "rm9rfgan",
			"name": "last_completed",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), del_last_completed); err != nil {
			return err
		}
		collection.Schema.AddField(del_last_completed)

		// add
		del_by := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "4nwqadyn",
			"name": "by",
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
		}`), del_by); err != nil {
			return err
		}
		collection.Schema.AddField(del_by)

		// remove
		collection.Schema.RemoveField("uup2ksl5")

		// remove
		collection.Schema.RemoveField("kv0pog8o")

		// remove
		collection.Schema.RemoveField("abifvj1g")

		return dao.SaveCollection(collection)
	})
}
