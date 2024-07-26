/// <reference path="..\pb_data\types.d.ts" />

cronAdd('choreResetter', '* * * * *', () => {
  try {
    const { choreShouldReset } = require(`${__hooks}/choreShouldReset`)

    const chores = $app
      .dao()
      // Will need to update this to not look for done if we ever want to
      // send notifications for chores that are not done but still scheduled
      .findRecordsByFilter('chores', 'done = True && start_on <= @now')
    console.log('Chores to check:', chores.length)

    chores.forEach((chore) => {
      if (choreShouldReset(chore)) {
        console.log('Resetting chore:', chore.get('name'))
        chore.set('done', false)
        $app.dao().saveRecord(chore)
      }
    })
  } catch (e) {
    console.error(e)
  }
})
