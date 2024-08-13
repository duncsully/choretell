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

    let notify = false
    chores.forEach((chore) => {
      const completion = $app
        .dao()
        .findRecordsByFilter(
          'completions',
          `chore = '${chore.get('id')}'`,
          '-created',
          1
        )[0]
      const lastCompletedAt =
        completion &&
        new Date(completion.get('created').toString().replace(' ', 'T'))
      if (choreShouldReset(chore, lastCompletedAt)) {
        console.log('Resetting chore:', chore.get('name'))
        chore.set('done', false)
        $app.dao().saveRecord(chore)
        notify = true
      }
      if (notify) {
        const subscriptions = $app
          .dao()
          .findRecordsByFilter('push_subscriptions', 'user != NULL')
        const {
          sendPushNotifications,
        } = require(`${__hooks}/sendPushNotifications`)
        const vapidConfig = require(`${__hooks}/vapidConfig`)
        sendPushNotifications(vapidConfig, subscriptions)
      }
    })
  } catch (e) {
    console.error(e)
  }
})

/* routerAdd('GET', 'test-push', (c) => {
  try {
    const subscriptions = $app
      .dao()
      // TODO: Only send to admins?
      .findRecordsByFilter('push_subscriptions', 'user != NULL')
    const {
      sendPushNotifications,
    } = require(`${__hooks}/sendPushNotifications`)
    const vapidConfig = require(`${__hooks}/vapidConfig`)
    sendPushNotifications(vapidConfig, subscriptions)
    return c.string(200, 'Push sent!')
  } catch (e) {
    console.error(e)
    return c.string(500, 'Error sending push! ' + e)
  }
}) */
