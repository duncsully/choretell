import { Computed, component, computedGroup, effect, html, signal } from 'solit'
import { pb } from '../../globals'
import { repeat } from 'lit-html/directives/repeat.js'
// Adds type safety for component
import '@ionic/core/components/ion-textarea'
import { showToast } from '../../components/Toast'
import { ChoreEditModal } from './components/ChoreEditModal'
import { ChoreAddForm } from './components/ChoreAddForm'
import { when } from 'lit-html/directives/when.js'
import type { ChoreWithLastCompletion } from '../../types'

// TODO: Empty UI
// TODO: Error UI when fetching items fails (use until?)

const getLastCompletion = (chore: ChoreWithLastCompletion) =>
  chore.expand?.last_completions_via_chore[0]!

export const ChoreListPage = component(() => {
  const chores = signal([] as ChoreWithLastCompletion[])

  effect(() => {
    console.log('fetching chores')
    pb.collection('chores')
      .getFullList<ChoreWithLastCompletion>({
        expand: 'last_completions_via_chore',
      })
      .then(chores.set)
      .catch((err) => {
        console.log(err)
        showToast({ message: 'Failed to load chores', color: 'danger' })
      })

    const unsub = pb.collection('chores').subscribe(
      '*',
      ({ action, record }) => {
        const typedRecord = record as ChoreWithLastCompletion
        const updaters = {
          create: (prev: ChoreWithLastCompletion[]) => [...prev, typedRecord],
          update: (prev: ChoreWithLastCompletion[]) =>
            prev.map((item) =>
              item.id === typedRecord.id ? typedRecord : item
            ),
          delete: (prev: ChoreWithLastCompletion[]) =>
            prev.filter((item) => item.id !== typedRecord.id),
        } as const
        console.log('chore', action, record)
        chores.update(updaters[action as keyof typeof updaters])
      },
      { expand: 'last_completions_via_chore' }
    )
    return () => unsub.then((u) => u())
  })

  const [notDone, done] = computedGroup(() => {
    const result = chores
      .get()
      .reduce<[ChoreWithLastCompletion[], ChoreWithLastCompletion[]]>(
        (results, item) => {
          results[+item.done].push(item)
          return results
        },
        [[], []]
      )
    result[0].sort(
      (a, b) => new Date(a.created).valueOf() - new Date(b.created).valueOf()
    )

    result[1].sort(
      (a, b) =>
        new Date(getLastCompletion(b).last_completed as string).valueOf() -
        new Date(getLastCompletion(a).last_completed as string).valueOf()
    )
    return result
  })

  const isAdding = signal(false)

  const editingChore = signal(null as ChoreWithLastCompletion | null)

  const makeChoreList = (list: Computed<ChoreWithLastCompletion[]>) => () =>
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

const ChoreItem = component(
  (chore: ChoreWithLastCompletion, onClick: () => void) => {
    const handleCheck = async (e: Event) => {
      e.stopPropagation()
      try {
        // TODO: This should probably be handled on the BE
        if (!chore.done) {
          await pb
            .collection('completions')
            .create({ by: pb.authStore.model?.id, chore: chore.id })
        } else {
          await pb.collection('completions').delete(getLastCompletion(chore).id)
        }
        await pb.collection('chores').update(chore.id, { done: !chore.done })
      } catch (err) {
        console.error(err)
        showToast({ message: 'Failed to update item', color: 'danger' })
      }
    }
    return html`
      <ion-item button @click=${onClick}>
        <ion-button
          slot="start"
          fill="clear"
          size="large"
          @click=${handleCheck}
        >
          <ion-icon
            name=${chore.done ? 'checkbox-outline' : 'square-outline'}
            slot="icon-only"
          ></ion-icon>
        </ion-button>
        <ion-label class="ion-text-nowrap">
          <span style=${chore.done ? 'text-decoration: line-through;' : ''}>
            ${chore.name}
          </span>
          ${when(
            chore.done,
            () =>
              html`<p>
                ${new Date(
                  getLastCompletion(chore)?.last_completed as string
                ).toLocaleString()}
              </p>`
          )}
        </ion-label>
        ${when(
          chore.done,
          () =>
            html`
              <ion-avatar slot="end">
                <img
                  alt="Silhouette of a person's head"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </ion-avatar>
            `
        )}
      </ion-item>
    `
  }
)
