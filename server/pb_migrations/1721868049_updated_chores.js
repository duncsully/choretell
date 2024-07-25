/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lbxlgvp0hn17g3k")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9r2yc9yw",
    "name": "repeat_weekdays",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 7,
      "values": [
        "Su",
        "Mo",
        "Tu",
        "We",
        "Th",
        "Fr",
        "Sa"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lbxlgvp0hn17g3k")

  // remove
  collection.schema.removeField("9r2yc9yw")

  return dao.saveCollection(collection)
})
