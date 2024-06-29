import { ChoresResponse } from './../../../pocketbase-types'
import {
  Computed,
  Signal,
  component,
  computedGroup,
  effect,
  html,
  signal,
  bind,
  computed,
} from 'solit'
import { pb } from '../../globals'
import { ref, createRef } from 'lit-html/directives/ref.js'
import { repeat } from 'lit-html/directives/repeat.js'
// Adds type safety for component
import '@ionic/core/components/ion-textarea'
import { showConfirm } from '../../components/Confirmation'

// TODO: Getting console error when dismissing add sheet discard confirmation modal
// TODO: Validate add and edit
// TODO: Turn window alerts into toasts?
// TODO: Convert to controlled inputs. Binding directive?
export const ChoreListPage = component(() => {
  const chores = signal([] as ChoresResponse[])

  effect(() => {
    const getItems = () => {
      console.log('fetching chores')
      pb.collection('chores').getFullList().then(chores.set)
    }
    getItems()
    // TODO: Not efficient, but works for now
    const unsub = pb.collection('chores').subscribe('*', getItems)
    return () => unsub.then((u) => u())
  })

  const [notDone, done] = computedGroup(() =>
    chores.get().reduce<[ChoresResponse[], ChoresResponse[]]>(
      (results, item) => {
        results[+item.done].push(item)
        return results
      },
      [[], []]
    )
  )

  const isAdding = signal(false)

  const editingChore = signal(null as ChoresResponse | null)

  const makeChoreList = (list: Computed<ChoresResponse[]>) => () =>
    repeat(
      list.get(),
      (chore) => `${chore.id}_${chore.updated}`,
      (chore) => ChoreItem(chore, () => editingChore.set(chore))
    )

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
      <ion-list> ${makeChoreList(notDone)} </ion-list>
      <ion-accordion-group>
        <ion-accordion>
          <ion-item slot="header">
            <ion-label>Completed (${() => done.get().length})</ion-label>
          </ion-item>
          <ion-list slot="content"> ${makeChoreList(done)} </ion-list>
        </ion-accordion>
      </ion-accordion-group>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click=${() => isAdding.set(true)}>
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
    ${ChoreAddForm(isAdding)} ${ChoreEditModal(editingChore)}
  `
})

const ChoreItem = component((chore: ChoresResponse, onClick: () => void) => {
  const handleCheck = (e: Event) => {
    e.stopPropagation()
    pb.collection('chores').update(chore.id, { done: !chore.done })
  }
  return html`
    <ion-item button @click=${onClick}>
      <ion-button slot="start" fill="clear" size="large" @click=${handleCheck}>
        <ion-icon
          name=${chore.done ? 'checkbox-outline' : 'square-outline'}
          slot="icon-only"
        ></ion-icon>
      </ion-button>
      <ion-label class="ion-text-nowrap">
        <span style=${chore.done ? 'text-decoration: line-through;' : ''}>
          ${chore.name}
        </span>
        <p>${chore.description}</p>
      </ion-label>
    </ion-item>
  `
})

const ChoreAddForm = component((isAdding: Signal<boolean>) => {
  const name = signal('')
  const description = signal('')
  const hasChanges = computed(() => name.get() || description.get())

  const resetForm = () => {
    name.reset()
    description.reset()
  }

  const handleAdd = async (e: SubmitEvent) => {
    e.preventDefault()
    try {
      await pb.collection('chores').create({
        name: name.get(),
        description: description.get(),
      })
      isAdding.set(false)
      resetForm()
    } catch (err) {
      console.error(err)
      window.alert('Failed to add item')
    }
  }

  const handleDismiss = async () => {
    isAdding.set(false)
    let discard = true
    if (hasChanges.get()) {
      discard = await showConfirm({
        header: 'Discard draft?',
        message: 'Are you sure you want to discard your draft?',
        confirmText: 'Discard',
      })
    }
    if (discard) {
      resetForm()
    } else {
      isAdding.set(true)
    }
  }

  const firstInputRef = createRef<HTMLIonInputElement>()
  const focusFirstInput = () => {
    firstInputRef.value?.setFocus()
  }

  return html`
    <ion-modal
      .isOpen=${isAdding}
      @didDismiss=${handleDismiss}
      .breakpoints=${[0, 1]}
      initial-breakpoint="1"
      backdrop-breakpoint="0.5"
      style="--height: auto;"
      @didPresent=${focusFirstInput}
    >
      <div class="ion-padding">
        <form
          @submit=${handleAdd}
          style="display: flex; flex-direction: column;"
        >
          <ion-input
            ${ref(firstInputRef)}
            placeholder="Chore name"
            .value=${bind(name)}
          ></ion-input>
          <ion-textarea
            placeholder="Description"
            auto-grow
            .value=${bind(description)}
          ></ion-textarea>
          <ion-button type="submit" fill="clear" style="align-self: end;">
            Add
          </ion-button>
        </form>
      </div>
    </ion-modal>
  `
})

// TODO: Modal component that dismounts children when closed so state gets reset
const ChoreEditModal = component(
  (editingChore: Signal<ChoresResponse | null>) => {
    const name = signal('')
    const description = signal('')
    effect(() => {
      name.set(editingChore.get()?.name ?? '')
      description.set(editingChore.get()?.description ?? '')
    })
    const hasChanged = computed(
      () =>
        name.get() !== editingChore.get()?.name ||
        description.get() !== editingChore.get()?.description
    )

    const handleEdit = async (e: SubmitEvent) => {
      e.preventDefault()
      try {
        await pb.collection('chores').update(editingChore.get()?.id!, {
          name: name.get(),
          description: description.get(),
        })
        editingChore.reset()
      } catch (err) {
        console.error(err)
        window.alert('Failed to update item')
      }
    }

    const handleEditBack = async () => {
      let discard = true
      if (hasChanged.get()) {
        discard = await showConfirm({
          header: 'Discard changes?',
          message: 'Are you sure you want to discard your changes?',
          confirmText: 'Discard',
        })
      }
      if (discard) {
        editingChore.reset()
      }
    }

    return html`
      <ion-modal .isOpen=${() => !!editingChore.get()}>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click=${handleEditBack} fill="clear">
                <ion-icon name="arrow-back-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form id="edit-form" @submit=${handleEdit}>
            <ion-input
              placeholder="Chore name"
              .value=${bind(name)}
              style="font-size: 1.5em;"
            ></ion-input>
            <ion-textarea
              placeholder="Add details"
              auto-grow
              .value=${bind(description)}
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
    `
  }
)
