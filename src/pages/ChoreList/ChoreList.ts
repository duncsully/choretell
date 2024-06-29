import { ChoresResponse } from './../../../pocketbase-types'
import { Computed, component, computedGroup, effect, html, signal } from 'solit'
import { pb } from '../../globals'
import { repeat } from 'lit-html/directives/repeat.js'
// Adds type safety for component
import '@ionic/core/components/ion-textarea'
import { showToast } from '../../components/Toast'
import { ChoreEditModal } from './components/ChoreEditModal'
import { ChoreAddForm } from './components/ChoreAddForm'

// TODO: Modal component that dismounts children when closed so state gets reset
// TODO: Error UI when fetching items fails (use until?)
// TODO: Improve refetching: don't need to refetch on delete, can modify locally on edit

export const ChoreListPage = component(() => {
  const chores = signal([] as ChoresResponse[])

  effect(() => {
    const getItems = () => {
      console.log('fetching chores')
      pb.collection('chores')
        .getFullList()
        .then(chores.set)
        .catch((err) => {
          console.log(err)
          showToast({ message: 'Failed to load chores', color: 'danger' })
        })
    }
    getItems()
    // TODO: Not efficient, but works for now
    const unsub = pb.collection('chores').subscribe('*', getItems)
    return () => unsub.then((u) => u())
  })

  const [notDone, done] = computedGroup(() => {
    const result = chores.get().reduce<[ChoresResponse[], ChoresResponse[]]>(
      (results, item) => {
        results[+item.done].push(item)
        return results
      },
      [[], []]
    )
    result[0].sort(
      (a, b) => new Date(a.created).valueOf() - new Date(b.created).valueOf()
    )
    // TODO: Set completions and sort by that
    // Last update was likely being checked off, reverse sort
    result[1].sort(
      (a, b) => new Date(b.updated).valueOf() - new Date(a.updated).valueOf()
    )
    return result
  })

  const isAdding = signal(false)

  const editingChore = signal(null as ChoresResponse | null)

  const makeChoreList = (list: Computed<ChoresResponse[]>) => () =>
    repeat(
      list.get(),
      (chore) => `${chore.id}_${chore.updated}`,
      (chore) => ChoreItem(chore, () => editingChore.set(chore))
    )

  // Optimistically update and allow undoing delete
  const handleDelete = async () => {
    const choreToDelete = editingChore.get()
    if (!choreToDelete) {
      return
    }
    editingChore.reset()
    chores.update((prev) =>
      prev.filter((chore) => chore.id !== choreToDelete.id)
    )

    const undoLocalDelete = () => {
      chores.update((prev) => {
        return [...prev, choreToDelete]
      })
    }

    showToast({
      message: 'Chore deleted',
      duration: 5_000,
      button: {
        text: 'Undo',
        role: 'cancel',
        handler: undoLocalDelete,
      },
      onDidDismiss: (e) => {
        if (e.detail.role !== 'cancel') {
          pb.collection('chores')
            .delete(choreToDelete.id)
            .catch((err) => {
              console.error(err)
              showToast({ message: 'Failed to delete item', color: 'danger' })
              undoLocalDelete()
            })
        }
      },
    })
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
    ${ChoreAddForm(isAdding)} ${ChoreEditModal(editingChore, handleDelete)}
  `
})

const ChoreItem = component((chore: ChoresResponse, onClick: () => void) => {
  const handleCheck = async (e: Event) => {
    e.stopPropagation()
    try {
      await pb.collection('chores').update(chore.id, { done: !chore.done })
    } catch (err) {
      console.error(err)
      showToast({ message: 'Failed to update item', color: 'danger' })
    }
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
