import { ChoresResponse } from './../../../pocketbase-types'
import { component, computedGroup, effect, html, signal } from 'solit'
import { pb } from '../../globals'
import { ref, createRef, type Ref } from 'lit-html/directives/ref.js'
import { repeat } from 'lit-html/directives/repeat.js'

// TODO: Confirmation when dismissing modal with unsaved changes
export const ChoreListPage = component(() => {
  const items = signal([] as ChoresResponse[])

  effect(() => {
    const getItems = () => {
      console.log('fetching chores')
      pb.collection('chores').getFullList().then(items.set)
    }
    getItems()
    // TODO: Not efficient, but works for now
    const unsub = pb.collection('chores').subscribe('*', getItems)
    return () => unsub.then((u) => u())
  })

  const [notDone, done] = computedGroup(() =>
    items.get().reduce<[ChoresResponse[], ChoresResponse[]]>(
      (results, item) => {
        results[+item.done].push(item)
        return results
      },
      [[], []]
    )
  )

  const isAdding = signal(false)

  // TODO: Refactor to just regenerate the form?
  let formRef: Ref<HTMLFormElement> = createRef()
  const resetForm = () => {
    isAdding.set(false)
    const form = formRef.value
    form?.reset()
    // Text areas don't reset, need to manually clear them
    form
      ?.querySelectorAll('ion-textarea')
      .forEach((el) => ((el as HTMLTextAreaElement).value = ''))
  }

  const handleAdd = (e: SubmitEvent) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
    pb.collection('chores').create(form)
    resetForm()
  }

  const editingItem = signal(null as ChoresResponse | null)
  const handleEdit = (e: SubmitEvent) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
    pb.collection('chores').update(editingItem.get()?.id!, form)
    editingItem.reset()
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
      <ion-list>
        ${() =>
          repeat(
            notDone.get(),
            (item) => `${item.id}_${item.updated}`,
            (item) => Item(item, () => editingItem.set(item))
          )}
      </ion-list>
      <ion-accordion-group>
        <ion-accordion>
          <ion-item slot="header">
            <ion-label>Completed (${() => done.get().length})</ion-label>
          </ion-item>
          <ion-list slot="content">
            ${() =>
              repeat(
                done.get(),
                (item) => `${item.id}_${item.updated}`,
                (item) => Item(item, () => editingItem.set(item))
              )}
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click=${() => isAdding.set(true)}>
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-modal
        .isOpen=${isAdding}
        @didDismiss=${resetForm}
        .breakpoints=${[0, 1]}
        initial-breakpoint="1"
        backdrop-dismiss="false"
        backdrop-breakpoint="0.5"
        style="--height: auto;"
      >
        <div class="ion-padding">
          <form
            ${ref(formRef)}
            @submit=${handleAdd}
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
      <ion-modal .isOpen=${() => !!editingItem.get()}>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click=${editingItem.reset} fill="clear">
                <ion-icon name="arrow-back-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form id="edit-form" @submit=${handleEdit}>
            <ion-input
              placeholder="Chore name"
              name="name"
              .value=${() => editingItem.get()?.name}
              style="font-size: 1.5em;"
            ></ion-input>
            <ion-textarea
              placeholder="Add details"
              auto-grow
              name="description"
              .value=${() => editingItem.get()?.description}
            >
              <ion-icon name="reader-outline" slot="start"></ion-icon>
            </ion-textarea>
          </form>
        </ion-content>
        <ion-footer>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button
                type="submit"
                form="edit-form"
                fill="clear"
                color="primary"
              >
                Save
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-footer>
      </ion-modal>
    </ion-content>
  `
})

const Item = component((item: ChoresResponse, onClick: () => void) => {
  const handleCheck = (e: Event) => {
    e.stopPropagation()
    pb.collection('chores').update(item.id, { done: !item.done })
  }
  return html`
    <ion-item button @click=${onClick}>
      <ion-button slot="start" fill="clear" size="large" @click=${handleCheck}>
        <ion-icon
          name=${item.done ? 'checkbox-outline' : 'square-outline'}
          slot="icon-only"
        ></ion-icon>
      </ion-button>
      <ion-label class="ion-text-nowrap">
        <span style=${item.done ? 'text-decoration: line-through;' : ''}>
          ${item.name}
        </span>
        <p>${item.description}</p>
      </ion-label>
    </ion-item>
  `
})
