import { computed, html, signal, Signal } from 'solit'
import { pb } from '../../../globals'
import { showToast } from '../../../components/Toast'
import { useResetOnBack } from '../../../hooks/useBackHandler'

export const ProfileModal = (isOpen: Signal<boolean>) => {
  // TODO: Really ought to have a confirmation modal here too
  useResetOnBack(isOpen)

  const user = pb.authStore.model!
  const avatar = signal(null as File | null)
  const avatarPreview = computed(() => {
    const file = avatar.get()
    if (file) {
      return URL.createObjectURL(file)
    }
    if (user.avatar) {
      return pb.files.getUrl(user, user.avatar)
    }
    return 'https://ionicframework.com/docs/img/demos/avatar.svg'
  })
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      await pb.collection('users').update(pb.authStore.model?.id, formData)
      showToast({ message: 'Profile updated', color: 'success' })
    } catch (err) {
      console.error(err)
      showToast({ message: 'Failed to update profile', color: 'danger' })
    }
  }

  return html`
    <ion-modal .isOpen=${isOpen}>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click=${isOpen.reset}>
              <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>Profile</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <form id="profile-form" @submit=${handleSubmit}>
          <ion-list>
            <ion-item>
              <ion-input
                name="name"
                label="Name"
                value=${user.name}
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-input
                type="file"
                name="avatar"
                label="Avatar"
                accept="image/*"
                @change=${(e: InputEvent) => {
                  const input = e.target as HTMLInputElement
                  avatar.set(input.files?.[0] ?? null)
                }}
              ></ion-input>
              <ion-avatar slot="end">
                <img src=${avatarPreview} />
              </ion-avatar>
            </ion-item>
          </ion-list>
        </form>
      </ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-buttons slot="end">
            <ion-button
              type="submit"
              form="profile-form"
              color="primary"
              fill="clear"
            >
              Save
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    </ion-modal>
  `
}
