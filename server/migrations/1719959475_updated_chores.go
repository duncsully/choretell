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

		collection, err := dao.FindCollectionByNameOrId("lbxlgvp0hn17g3k")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("f5ezgc8c")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("lbxlgvp0hn17g3k")
		if err != nil {
			return err
		}

		// add
		del_completions := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "f5ezgc8c",
			"name": "completions",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "togr2mnei0mie72",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": null,
				"displayFields": null
			}
		}`), del_completions); err != nil {
			return err
		}
		collection.Schema.AddField(del_completions)

		return dao.SaveCollection(collection)
	})
}
