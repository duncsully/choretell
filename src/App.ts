import { Context, component, effect, html, signal } from 'solit'
import PocketBase from 'pocketbase'
import { when } from 'lit-html/directives/when.js'
import '@ionic/core/css/palettes/dark.system.css'

// TODO: Breakup into smaller components
// TODO: Better styling solution?
// TODO: Bundle ionic components properly?

export const pbContext = new Context({} as PocketBase)

export const App = component(() => {
  const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL)
  const loggedIn = signal(pb.authStore.isValid)

  effect(() => {
    return pb.authStore.onChange(() => loggedIn.set(pb.authStore.isValid), true)
  })

  const handleForm = async (e: SubmitEvent) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
    const action = e.submitter?.getAttribute('formaction') ?? 'login'
    if (action === 'login') {
      try {
        await pb
          .collection('users')
          .authWithPassword(
            form.get('username') as string,
            form.get('password') as string
          )
      } catch (e) {
        window.alert('Invalid username or password')
      }
    } else if (action === 'register') {
      try {
        await pb.collection('users').create({
          email: form.get('username') as string,
          password: form.get('password') as string,
          passwordConfirm: form.get('password') as string,
        })
      } catch (e) {
        window.alert('Failed to register')
      }
    }
  }

  return pbContext.provide(pb, () => {
    return html`
      <ion-app>
        ${() =>
          when(
            loggedIn.get(),
            () => html`
              <ion-header>
                <ion-toolbar>
                  <ion-title>Choretell</ion-title>
                  <ion-buttons slot="end">
                    <ion-button @click=${() => pb.authStore.clear()}>
                      Logout
                      <ion-icon slot="end" name="log-out-outline"></ion-icon>
                    </ion-button>
                  </ion-buttons>
                </ion-toolbar>
              </ion-header>
              <ion-content> </ion-content>
            `,
            () => html`
              <ion-content>
                <ion-row
                  class="ion-justify-content-center ion-align-items-center"
                  style="flex-direction: column; height: 100%;"
                >
                  <ion-text color="primary">
                    <h1>Welcome to Choretell!</h1>
                  </ion-text>
                  <ion-card>
                    <ion-card-content>
                      <form
                        @submit=${handleForm}
                        style="display: flex; flex-direction: column; gap: 8px;"
                      >
                        <ion-input
                          label="Email"
                          label-placement="stacked"
                          placeholder="Enter email address"
                          type="email"
                          name="username"
                          inputmode="email"
                          fill="outline"
                          required
                        ></ion-input>
                        <ion-input
                          label="Password"
                          label-placement="stacked"
                          placeholder="Enter password"
                          type="password"
                          name="password"
                          fill="outline"
                          required
                        >
                          <ion-input-password-toggle
                            slot="end"
                          ></ion-input-password-toggle>
                        </ion-input>
                        <div style="margin: 0 auto">
                          <ion-button type="submit" formaction="login">
                            Login
                          </ion-button>
                          <ion-button
                            type="submit"
                            formaction="register"
                            color="secondary"
                          >
                            Register
                          </ion-button>
                        </div>
                      </form>
                    </ion-card-content>
                  </ion-card>
                </ion-row>
              </ion-content>
            `
          )}
      </ion-app>
    `
  })
})
