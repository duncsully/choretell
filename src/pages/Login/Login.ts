import { bind, component, html, signal } from 'solit'
import { pb } from '../../globals'
import { showToast } from '../../components/Toast'

export const LoginPage = component(() => {
  const handleForm = (e: SubmitEvent) => {
    e.preventDefault()
    handleLogin()
  }

  const handleLogin = async () => {
    try {
      await pb.collection('users').authWithPassword(email.get(), password.get())
    } catch (err) {
      console.error(err)
      showToast({ message: 'Failed to login', color: 'danger' })
    }
  }

  const handleRegister = async () => {
    try {
      await pb.collection('users').create({
        email: email.get(),
        password: password.get(),
        // We allow the user to see their password, no need to make them type it twice
        passwordConfirm: password.get(),
      })
      // TODO: Require email verification?
      handleLogin()
    } catch (e) {
      console.error(e)
      showToast({ message: 'Failed to register', color: 'danger' })
    }
  }

  const email = signal('')
  const password = signal('')

  return html`
    <ion-content>
      <ion-row
        class="ion-align-items-center"
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
                .value=${bind(email)}
                label="Email"
                label-placement="stacked"
                placeholder="Enter email address"
                type="email"
                name="email"
                inputmode="email"
                fill="outline"
                required
              ></ion-input>
              <ion-input
                .value=${bind(password)}
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
                <ion-button type="submit"> Login </ion-button>
                <ion-button @click=${handleRegister} color="secondary">
                  Register
                </ion-button>
              </div>
            </form>
          </ion-card-content>
        </ion-card>
      </ion-row>
    </ion-content>
  `
})
