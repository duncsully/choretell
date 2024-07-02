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

		collection, err := dao.FindCollectionByNameOrId("togr2mnei0mie72")
		if err != nil {
			return err
		}

		// add
		new_chore := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "xdgfij2x",
			"name": "chore",
			"type": "relation",
			"required": false,
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

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("togr2mnei0mie72")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("xdgfij2x")

		return dao.SaveCollection(collection)
	})
}
