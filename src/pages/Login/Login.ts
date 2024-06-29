import { component, html } from 'solit'
import { pb } from '../../globals'
import { showToast } from '../../components/Toast'

export const LoginPage = component(() => {
  const handleForm = async (e: SubmitEvent) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
    const action = e.submitter?.getAttribute('formaction') ?? 'login'
    const email = form.get('email') as string
    const password = form.get('password') as string
    if (action === 'login') {
      try {
        await pb.collection('users').authWithPassword(email, password)
      } catch (err) {
        console.error(err)
        showToast('Failed to login', 'danger')
      }
    } else if (action === 'register') {
      try {
        await pb.collection('users').create({
          email,
          password,
          // We allow the user to see their password, no need to make them type it twice
          passwordConfirm: password,
        })
      } catch (e) {
        window.alert('Failed to register')
      }
    }
  }

  return html`
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
                name="email"
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
})
