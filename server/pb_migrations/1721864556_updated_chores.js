/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lbxlgvp0hn17g3k")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "agrlsnql",
    "name": "repeat_selections",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 38,
      "values": [
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
        "31",
        "-1",
        "-2",
        "-3",
        "-4",
        "-5",
        "-6",
        "-7"
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

  return dao.saveCollection(collection)
})
