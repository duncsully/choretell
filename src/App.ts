import { Context, component, effect, html, signal } from 'solit'
import PocketBase from 'pocketbase'
import { when } from 'lit-html/directives/when.js'
import '@material/web/textfield/filled-text-field.js'
import '@material/web/icon/icon.js'
import '@material/web/iconbutton/icon-button.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/filled-tonal-button.js'

// TODO: Breakup into smaller components
// TODO: Figure out dark theme
// TODO: Better styling solution?

export const pbContext = new Context({} as PocketBase)

export const App = component(() => {
  const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL)
  const loggedIn = signal(pb.authStore.isValid)
  const showPassword = signal(false)

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
    return html`${() =>
      when(
        loggedIn.get(),
        () => html` <p>Hello</p>
          <button @click=${() => pb.authStore.clear()}>Logout</button>`,
        () => html`
          <form @submit=${handleForm}>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <md-filled-text-field
                label="Email"
                type="email"
                name="username"
                inputmode="email"
                required
                no-asterisk
              ></md-filled-text-field>
              <md-filled-text-field
                label="Password"
                type=${() => (showPassword.get() ? 'text' : 'password')}
                name="password"
                required
                no-asterisk
              >
                <md-icon-button
                  type="button"
                  toggle
                  slot="trailing-icon"
                  @input=${() => {
                    showPassword.update((v) => !v)
                  }}
                >
                  <md-icon>visibility</md-icon>
                  <md-icon slot="selected">visibility_off</md-icon>
                </md-icon-button>
              </md-filled-text-field>
              <div>
                <md-filled-button
                  type="submit"
                  formaction="login"
                  value="login"
                >
                  Login
                </md-filled-button>
                <md-filled-tonal-button
                  type="submit"
                  formaction="register"
                  value="register"
                >
                  Register
                </md-filled-tonal-button>
              </div>
            </div>
          </form>
        `
      )}`
  })
})
