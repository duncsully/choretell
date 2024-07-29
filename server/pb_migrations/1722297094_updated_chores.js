/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lbxlgvp0hn17g3k")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nlz7piyu",
    "name": "repeat_unit",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "day",
        "week",
        "month"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lbxlgvp0hn17g3k")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nlz7piyu",
    "name": "repeat_unit",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "week",
        "month"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
