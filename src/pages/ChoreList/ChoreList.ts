import { component, html, signal } from 'solit'
import { pb } from '../../globals'

export const ChoreListPage = component(() => {
  const isAdding = signal(false)

  const handleDismiss = (e: Event) => {
    isAdding.set(false)
    const form = (e.target as HTMLElement)?.querySelector(
      'form'
    ) as HTMLFormElement
    form?.reset()
    // Text areas don't reset, need to manually clear them
    form
      ?.querySelectorAll('ion-textarea')
      .forEach((el) => ((el as HTMLTextAreaElement).value = ''))
  }

  return html`
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
    <ion-content class="ion-padding" fixed-slot-placement="before">
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click=${() => isAdding.set(true)}>
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-list></ion-list>
      <ion-modal
        .isOpen=${isAdding}
        @didDismiss=${handleDismiss}
        .breakpoints=${[0, 1]}
        initial-breakpoint="1"
        backdrop-dismiss="false"
        backdrop-breakpoint="0.5"
        style="--height: auto;"
      >
        <div class="ion-padding">
          <form
            @submit=${(e: SubmitEvent) => {
              e.preventDefault()
              const form = new FormData(e.target as HTMLFormElement)
              pb.collection('chores').create(form)
              handleDismiss(e)
            }}
            style="display: flex; flex-direction: column;"
          >
            <ion-input placeholder="Chore name" name="name"></ion-input>
            <ion-textarea
              placeholder="Description"
              auto-grow
              name="description"
            ></ion-textarea>
            <ion-button type="submit" fill="clear" style="align-self: end;">
              Add
            </ion-button>
          </form>
        </div>
      </ion-modal>
    </ion-content>
  `
})
