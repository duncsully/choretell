import { when } from 'lit-html/directives/when.js'
import { component, effect, html, signal } from 'solit'
import '@ionic/core/css/palettes/dark.system.css'
import { LoginPage } from './pages/Login/Login'
import { pb } from './globals'
import { ChoreListPage } from './pages/ChoreList/ChoreList'
import { currentConfirmationDialog } from './components/ConfirmationModal'
import { currentToast } from './components/Toast'

// TODO: Better styling solution?
// TODO: Bundle ionic components properly?

// TODO: Make this context when that works
export const user = signal(pb.authStore.model)

export const App = component(() => {
  const loggedIn = signal(pb.authStore.isValid)

  effect(() => {
    return pb.authStore.onChange(() => {
      loggedIn.set(pb.authStore.isValid)
      user.set(pb.authStore.model)
    }, true)
  })

  return html`
    <ion-app>
      ${() => when(loggedIn.get(), ChoreListPage, LoginPage)}
      ${currentConfirmationDialog} ${currentToast}
    </ion-app>
  `
})
