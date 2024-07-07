/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "y7pp03b3d87p5dl",
    "created": "2024-07-07 03:49:27.854Z",
    "updated": "2024-07-07 03:49:27.858Z",
    "name": "last_completions",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "sclx2pkq",
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
      },
      {
        "system": false,
        "id": "gd4deqz8",
        "name": "last_completed",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "4kuqdkk2",
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
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT completions.id, completions.chore, MAX(completions.created) as last_completed, completions.by\nFROM completions\nGROUP BY completions.chore"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("y7pp03b3d87p5dl");

  return dao.deleteCollection(collection);
})
