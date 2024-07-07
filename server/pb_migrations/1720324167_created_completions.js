/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "togr2mnei0mie72",
    "created": "2024-07-07 03:49:27.854Z",
    "updated": "2024-07-07 03:49:27.854Z",
    "name": "completions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bmzwhx6v",
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
      },
      {
        "system": false,
        "id": "xdgfij2x",
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
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": null,
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("togr2mnei0mie72");

  return dao.deleteCollection(collection);
})
