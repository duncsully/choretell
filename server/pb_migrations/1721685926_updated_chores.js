/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lbxlgvp0hn17g3k")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "agrlsnql",
    "name": "repeat_selections",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 62,
      "values": [
        "-31",
        "-30",
        "-29",
        "-28",
        "-27",
        "-26",
        "-25",
        "-24",
        "-23",
        "-22",
        "-21",
        "-20",
        "-19",
        "-18",
        "-17",
        "-16",
        "-15",
        "-14",
        "-13",
        "-12",
        "-11",
        "-10",
        "-9",
        "-8",
        "-7",
        "-6",
        "-5",
        "-4",
        "-3",
        "-2",
        "-1",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pw9jx3hq",
    "name": "start_on",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6vt5fhgp",
    "name": "repeat_interval",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": true
    }
  }))

  // add
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lbxlgvp0hn17g3k")

  // remove
  collection.schema.removeField("agrlsnql")

  // remove
  collection.schema.removeField("pw9jx3hq")

  // remove
  collection.schema.removeField("6vt5fhgp")

  // remove
  collection.schema.removeField("nlz7piyu")

  return dao.saveCollection(collection)
})
