import { pb } from '../../globals'

export const registerPushNotifications = async () => {
  try {
    Notification.requestPermission()
    const registration = await navigator.serviceWorker.register(
      import.meta.env.MODE === 'production'
        ? '/service-worker.js'
        : '/dev-sw.js?dev-sw'
    )

    const existingSubscription =
      await registration.pushManager.getSubscription()
    if (existingSubscription) {
      return
    }

    const vapidKey = import.meta.env.VITE_VAPID_PUB_KEY
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    })

    pb.collection('push_subscriptions').create({
      user: pb.authStore.model?.id,
      subscription_data: subscription.toJSON(),
    })
  } catch (err) {
    console.error(err)
  }
}
