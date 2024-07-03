package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("bxobll92tr4ycqw")
		if err != nil {
			return err
		}

		collection.ListRule = types.Pointer("")

		collection.ViewRule = types.Pointer("")

		// remove
		collection.Schema.RemoveField("uhlxwbpt")

		// remove
		collection.Schema.RemoveField("ovvsmsa5")

		// remove
		collection.Schema.RemoveField("ha8jwfmh")

		// remove
		collection.Schema.RemoveField("gwetsyyg")

		// remove
		collection.Schema.RemoveField("khot0dag")

		// remove
		collection.Schema.RemoveField("nlm2k6wx")

		// add
		new_name := &schema.SchemaField{}
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
		}`), new_name); err != nil {
			return err
		}
		collection.Schema.AddField(new_name)

		// add
		new_description := &schema.SchemaField{}
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
		}`), new_description); err != nil {
			return err
		}
		collection.Schema.AddField(new_description)

		// add
		new_done := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "lqo53dsi",
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
		}`), new_completion_id); err != nil {
			return err
		}
		collection.Schema.AddField(new_completion_id)

		// add
		new_completed_by := &schema.SchemaField{}
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
		}`), new_completed_by); err != nil {
			return err
		}
		collection.Schema.AddField(new_completed_by)

		// add
		new_completed_time := &schema.SchemaField{}
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

		collection.ListRule = nil

		collection.ViewRule = nil

		// add
		del_name := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "uhlxwbpt",
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
			"id": "ovvsmsa5",
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
			"id": "ha8jwfmh",
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
			"id": "gwetsyyg",
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
			"id": "khot0dag",
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
			"id": "nlm2k6wx",
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

		return dao.SaveCollection(collection)
	})
}
