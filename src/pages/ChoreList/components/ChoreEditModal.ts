import { Signal, bind, component, computed, effect, html, signal } from 'solit'
import { pb } from '../../../globals'
import { showToast } from '../../../components/Toast'
import { showConfirm } from '../../../components/ConfirmationModal'
import { ChoreWithLastCompletion } from '../../../types'
import { useBackHandler } from '../../../hooks/useBackHandler'
import { ChoreScheduleButton } from './ChoreScheduleButton'
import {
  ChoresRepeatSelectionsOptions,
  ChoresRepeatUnitOptions,
  ChoresRepeatWeekdaysOptions,
} from '../../../../pocketbase-types'

export const ChoreEditModal = component(
  (
    editingChore: Signal<ChoreWithLastCompletion | null>,
    onDelete: () => void
  ) => {
    const name = signal('')
    const description = signal('')
    const startOn = signal('')
    const repeatInterval = signal(0)
    const repeatUnit = signal<ChoresRepeatUnitOptions | ''>('')
    const repeatWeekdays = signal([] as ChoresRepeatWeekdaysOptions[])
    const repeatSelections = signal([] as ChoresRepeatSelectionsOptions[])
    effect(() => {
      name.set(editingChore.get()?.name ?? '')
      description.set(editingChore.get()?.description ?? '')
      startOn.set(
        editingChore.get()?.start_on.replace(' ', 'T') ||
          new Date().toISOString()
      )
      repeatInterval.set(editingChore.get()?.repeat_interval ?? 0)
      repeatUnit.set(editingChore.get()?.repeat_unit ?? '')
      repeatWeekdays.set(editingChore.get()?.repeat_weekdays ?? [])
      repeatSelections.set(editingChore.get()?.repeat_selections ?? [])
    })
    const hasChanged = computed(
      () =>
        name.get() !== editingChore.get()?.name ||
        description.get() !== editingChore.get()?.description ||
        startOn.get() !== editingChore.get()?.start_on.replace(' ', 'T') ||
        repeatInterval.get() !== editingChore.get()?.repeat_interval ||
        repeatUnit.get() !== editingChore.get()?.repeat_unit ||
        repeatWeekdays.get().length !==
          editingChore.get()?.repeat_weekdays?.length ||
        repeatWeekdays
          .get()
          .some(
            (weekday) => !editingChore.get()?.repeat_weekdays?.includes(weekday)
          ) ||
        repeatSelections.get().length !==
          editingChore.get()?.repeat_selections?.length ||
        repeatSelections
          .get()
          .some(
            (selection) =>
              !editingChore.get()?.repeat_selections?.includes(selection)
          )
    )

    const handleEdit = async (e: SubmitEvent) => {
      e.preventDefault()
      try {
        if (hasChanged.get()) {
          await pb.collection('chores').update(editingChore.get()?.id!, {
            name: name.get(),
            description: description.get(),
            start_on: startOn.get(),
            repeat_interval: repeatInterval.get(),
            repeat_unit: repeatUnit.get(),
            repeat_weekdays: repeatWeekdays.get(),
            repeat_selections: repeatSelections.get(),
          })
        }
        editingChore.reset()
      } catch (err) {
        console.error(err)
        showToast({ message: 'Failed to update item', color: 'danger' })
      }
    }

    const handleEditBack = () => {
      if (hasChanged.get()) {
        showConfirm({
          header: 'Discard changes?',
          message: 'Are you sure you want to discard your changes?',
          confirmText: 'Discard',
          onConfirm: editingChore.reset,
        })
      } else {
        editingChore.reset()
      }
    }

    useBackHandler(() => {
      if (editingChore.get()) {
        handleEditBack()
        return true
      }
    })

    const showOverflow = signal(false)

    return html`
      <ion-modal .isOpen=${() => !!editingChore.get()}>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click=${handleEditBack}>
                <ion-icon name="arrow-back" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button
                fill="clear"
                @click=${() => showOverflow.set(true)}
                id="overflow-button"
              >
                <ion-icon name="ellipsis-vertical" slot="icon-only"></ion-icon>
              </ion-button>
              <ion-popover
                trigger="overflow-button"
                .isOpen=${showOverflow}
                trigger-action="click"
              >
                <ion-content>
                  <ion-list lines="none">
                    <ion-item
                      button
                      @click=${() => {
                        showOverflow.set(false)
                        onDelete()
                      }}
                    >
                      <ion-icon
                        name="trash"
                        style="margin-right: 4px;"
                      ></ion-icon>
                      Delete
                    </ion-item>
                  </ion-list>
                </ion-content>
              </ion-popover>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form id="edit-form" @submit=${handleEdit}>
            <ion-list>
              <ion-item>
                <ion-input
                  placeholder="Chore name"
                  .value=${bind(name)}
                  style="font-size: 1.5em;"
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-icon name="reader-outline" slot="start"></ion-icon>
                <ion-textarea
                  placeholder="Add details"
                  auto-grow
                  .value=${bind(description)}
                >
                </ion-textarea>
              </ion-item>
              <ion-item>
                <ion-icon name="calendar" slot="start"></ion-icon>

                ${ChoreScheduleButton(
                  startOn,
                  repeatInterval,
                  repeatUnit,
                  repeatWeekdays,
                  repeatSelections
                )}
              </ion-item>
            </ion-list>
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
