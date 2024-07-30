/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lbxlgvp0hn17g3k")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jvjrsr9e",
    "name": "count_from_completion",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lbxlgvp0hn17g3k")

  // remove
  collection.schema.removeField("jvjrsr9e")

  return dao.saveCollection(collection)
})
