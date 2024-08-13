self.addEventListener('push', (event) => {
  const body = event.data?.text() ?? 'A chore is due!'
  event.waitUntil(
    self.registration.showNotification('Choretell', {
      body,
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  const url = self.location.origin
  event.notification.close() // Android needs explicit close.
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i]
        if (client.url.startsWith(url) && 'focus' in client) {
          return client.focus()
        }
      }
      return self.clients.openWindow?.(url)
    })
  )
})
