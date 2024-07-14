/// <reference path="..\pb_data\types.d.ts" />

cronAdd('choreResetter', '* * * * *', () => {
  try {
    const { cronExpressionMatchesNow } = require(`${__hooks}/cronUtils`)
    // Check each chore's own cron expression and determine if it should be set done: false
    const chores = $app
      .dao()
      .findRecordsByFilter('chores', 'cron_expr != NULL && done = True')
    chores.forEach((chore) => {
      // The cron we have at home that is actually better than the one we have in PocketBase
      if (cronExpressionMatchesNow(chore.get('cron_expr'))) {
        console.log('Resetting chore:', chore.get('name'))
        chore.set('done', false)
        $app.dao().saveRecord(chore)
      }
    })
  } catch (e) {
    console.error(e)
  }
})
