/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "34p75483ylv1gub",
    "created": "2024-08-11 20:38:47.209Z",
    "updated": "2024-08-11 20:38:47.209Z",
    "name": "push_subscriptions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "d5phoywh",
        "name": "subscription_data",
        "type": "json",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "jkktla6o",
        "name": "user",
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
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("34p75483ylv1gub");

  return dao.deleteCollection(collection);
})
