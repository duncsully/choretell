import { Signal, component, html, signal, bind, computed, effect } from 'solit'
import { pb } from '../../../globals'
import { ref, createRef } from 'lit-html/directives/ref.js'
import { showConfirm } from '../../../components/ConfirmationModal'
import { showToast } from '../../../components/Toast'
import { useBackHandler } from '../../../hooks/useBackHandler'
import {
  ChoresRepeatSelectionsOptions,
  ChoresRepeatUnitOptions,
  ChoresRepeatWeekdaysOptions,
} from '../../../../pocketbase-types'
import { ChoreScheduleButton } from './ChoreScheduleButton'

export const ChoreAddForm = component((isAdding: Signal<boolean>) => {
  const name = signal('')
  const description = signal('')
  const startOn = signal(new Date().toISOString())
  const repeatInterval = signal(0)
  const repeatUnit = signal('' as ChoresRepeatUnitOptions | '')
  const repeatWeekdays = signal([] as ChoresRepeatWeekdaysOptions[])
  const repeatSelections = signal([] as ChoresRepeatSelectionsOptions[])
  const countFromCompletion = signal(false)
  const hasChanges = computed(
    () =>
      name.get() ||
      description.get() ||
      repeatInterval.get() ||
      repeatUnit.get(),
    { cacheSize: 0 }
  )
  const isInvalid = computed(() => !name.get().trim())

  const resetForm = () => {
    name.reset()
    description.reset()
    startOn.set(new Date(0).toISOString())
    repeatInterval.reset()
    repeatUnit.reset()
    repeatWeekdays.reset()
    repeatSelections.reset()
    countFromCompletion.reset()
  }

  effect(() => {
    if (isAdding.get() && startOn.get() === new Date(0).toISOString()) {
      startOn.set(new Date().toISOString())
    }
  })

  const handleAdd = async (e: SubmitEvent) => {
    e.preventDefault()
    try {
      await pb.collection('chores').create({
        name: name.get(),
        description: description.get(),
        start_on: startOn.get(),
        repeat_interval: repeatInterval.get(),
        repeat_unit: repeatUnit.get(),
        repeat_weekdays: repeatWeekdays.get(),
        repeat_selections: repeatSelections.get(),
        count_from_completion: countFromCompletion.get(),
      })
      isAdding.set(false)
      resetForm()
    } catch (err) {
      console.error(err)
      showToast({ message: 'Failed to add chore', color: 'danger' })
    }
  }

  const handleDismiss = () => {
    isAdding.set(false)
    if (hasChanges.get()) {
      showConfirm({
        header: 'Discard draft?',
        message: 'Are you sure you want to discard your draft?',
        confirmText: 'Discard',
        onCancel: () => isAdding.set(true),
        onConfirm: resetForm,
      })
    } else {
      resetForm()
    }
  }

  useBackHandler(() => {
    if (isAdding.get()) {
      handleDismiss()
      return true
    }
  })

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
          ${ChoreScheduleButton(
            startOn,
            repeatInterval,
            repeatUnit,
            repeatWeekdays,
            repeatSelections,
            countFromCompletion
          )}
          <ion-button
            type="submit"
            fill="clear"
            style="align-self: end;"
            .disabled=${isInvalid}
          >
            Add
          </ion-button>
        </form>
      </div>
    </ion-modal>
  `
})
