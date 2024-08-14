function sendPushNotifications(vapidConfig, subscriptions) {
  const { VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = vapidConfig

  if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warning('Missing VAPID config, skipping push notifications')
    return
  }

  subscriptions.forEach((sub) => {
    const data = JSON.parse(sub.get('subscription_data'))
    $os
      .cmd(
        'web-push',
        'send-notification',
        `--endpoint=${data.endpoint}`,
        `--key=${data.keys.p256dh}`,
        `--auth=${data.keys.auth}`,
        `--vapid-subject=${VAPID_SUBJECT}`,
        `--vapid-pubkey=${VAPID_PUBLIC_KEY}`,
        `--vapid-pvtkey=${VAPID_PRIVATE_KEY}`,
        `--payload=A chore is due!`
      )
      .run()
  })
}

module.exports = {
  sendPushNotifications,
}
