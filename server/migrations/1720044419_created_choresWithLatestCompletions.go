package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `{
			"id": "bxobll92tr4ycqw",
			"created": "2024-07-03 22:06:59.325Z",
			"updated": "2024-07-03 22:06:59.325Z",
			"name": "choresWithLatestCompletions",
			"type": "view",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "gja95lna",
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
				},
				{
					"system": false,
					"id": "eqieywrx",
					"name": "description",
					"type": "editor",
					"required": false,
					"presentable": false,
					"unique": false,
					"options": {
						"convertUrls": false
					}
				},
				{
					"system": false,
					"id": "qq09wr24",
					"name": "done",
					"type": "bool",
					"required": false,
					"presentable": false,
					"unique": false,
					"options": {}
				},
				{
					"system": false,
					"id": "haefxylb",
					"name": "latest_completion",
					"type": "json",
					"required": false,
					"presentable": false,
					"unique": false,
					"options": {
						"maxSize": 1
					}
				}
			],
			"indexes": [],
			"listRule": null,
			"viewRule": null,
			"createRule": null,
			"updateRule": null,
			"deleteRule": null,
			"options": {
				"query": "SELECT chores.id, chores.name, chores.description, chores.done, chores.created, chores.updated, MAX(completions.created) AS latest_completion\nFROM chores\nINNER JOIN completions ON chores.id = completions.chore\nGROUP BY chores.id"
			}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return daos.New(db).SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("bxobll92tr4ycqw")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
