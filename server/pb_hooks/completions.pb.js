/// <reference path="../pb_data/types.d.ts" />

onRecordBeforeUpdateRequest((e) => {
  const isDone = e.record.get('done')
  const wasDone = e.record.originalCopy().get('done')
  try {
    if (isDone && !wasDone) {
      const chore = e.record.get('id')
      const by = e.httpContext.get('authRecord').get('id')
      const completions = $app.dao().findCollectionByNameOrId('completions')
      const completion = new Record(completions, { chore, by })

      $app.dao().saveRecord(completion)
    } else if (!isDone && wasDone) {
      const lastCompletion = $app
        .dao()
        .findFirstRecordByFilter(
          'last_completions',
          `chore="${e.record.get('id')}"`
        )

      const completion = $app
        .dao()
        .findRecordById('completions', lastCompletion.get('id'))
      $app.dao().deleteRecord(completion)
    }
  } catch (e) {
    console.error(e)
  }
}, 'chores')
