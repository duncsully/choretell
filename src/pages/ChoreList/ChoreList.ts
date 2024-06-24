import { component, computedGroup, effect, html, signal } from 'solit'
import { pb } from '../../globals'
import { styleMap } from 'lit-html/directives/style-map.js'
//import { ref, createRef, type Ref } from 'lit/directives/ref.js'
//import { repeat } from 'lit/directives/repeat.js'
import { ChoresResponse } from '../../../pocketbase-types'

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

  const items = signal([] as ChoresResponse[])
  pb.collection('chores').getFullList().then(items.set)
  effect(() => {
    const unsub = pb.collection('chores').subscribe('*', () => {
      // TODO: Not efficient, but works for now
      pb.collection('chores').getFullList().then(items.set)
    })
    return () => unsub.then((u) => u())
  })

  const [done, notDone] = computedGroup(() => {
    const done = [] as ChoresResponse[]
    const notDone = [] as ChoresResponse[]
    items.get().forEach((item) => {
      if (item.done) done.push(item)
      else notDone.push(item)
    })
    return [done, notDone]
  })

  const makeHandleDone = (id: string) => () => {
    pb.collection('chores').update(id, { done: true })
  }

  const makeHandleNotDone = (id: string) => () => {
    pb.collection('chores').update(id, { done: false })
  }

  // TODO: Figure out why most directives throw errors
  //let formRef: Ref<HTMLFormElement> = createRef()

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
      <ion-list>
        ${() =>
          notDone.get().map(
            (item) => html`
              <ion-item>
                <ion-checkbox
                  .checked=${false}
                  label-placement="end"
                  justify="start"
                  @ionChange=${makeHandleDone(item.id)}
                >
                  <ion-label>${item.name}</ion-label>
                  <ion-note>${item.description}</ion-note>
                </ion-checkbox>
              </ion-item>
            `
          )}
      </ion-list>
      <ion-accordion-group>
        <ion-accordion>
          <ion-item slot="header">
            <ion-label>Completed (${() => done.get().length})</ion-label>
          </ion-item>
          <ion-list slot="content">
            ${() =>
              done.get().map(
                (item) => html`
                  <ion-item>
                    <ion-checkbox
                      .checked=${true}
                      label-placement="end"
                      justify="start"
                      @ionChange=${makeHandleNotDone(item.id)}
                    >
                      <ion-label>${item.name}</ion-label>
                      <ion-note>${item.description}</ion-note>
                    </ion-checkbox>
                  </ion-item>
                `
              )}
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>
      <ion-modal
        .isOpen=${isAdding}
        @didDismiss=${handleDismiss}
        .breakpoints=${[0, 1]}
        initial-breakpoint="1"
        backdrop-dismiss="false"
        backdrop-breakpoint="0.5"
        style="--height: auto;"
      >
        <div class="ion-padding" style=${styleMap({})}>
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
