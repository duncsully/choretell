import { component, effect, html, signal } from 'solit'
import '@ionic/core/css/palettes/dark.system.css'
import { LoginPage } from './pages/Login/Login'
import { pb } from './globals'
import { ChoreListPage } from './pages/ChoreList/ChoreList'

// TODO: Better styling solution?
// TODO: Bundle ionic components properly?

export const App = component(() => {
  const loggedIn = signal(pb.authStore.isValid)

  effect(() => {
    return pb.authStore.onChange(() => loggedIn.set(pb.authStore.isValid), true)
  })

  return html`
    <ion-app>${() => (loggedIn.get() ? ChoreListPage() : LoginPage())}</ion-app>
  `
})
