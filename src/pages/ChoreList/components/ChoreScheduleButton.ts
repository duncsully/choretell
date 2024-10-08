import { bind, component, computed, html, signal, Signal } from 'solit'
import {
  ChoresRepeatSelectionsOptions,
  ChoresRepeatUnitOptions,
  ChoresRepeatWeekdaysOptions,
  IsoDateString,
} from '../../../../pocketbase-types'
import { useBackHandler } from '../../../hooks/useBackHandler'
import { when } from 'lit-html/directives/when.js'
import { type CheckboxCustomEvent } from '@ionic/core'
import { formatDate } from '../../../utils'
import { formatISO } from 'date-fns'
import { choose } from 'lit-html/directives/choose.js'

export const ChoreScheduleButton = component(
  (
    startOn: Signal<IsoDateString>,
    repeatInterval: Signal<number>,
    repeatUnit: Signal<ChoresRepeatUnitOptions | ''>,
    repeatWeekdays: Signal<ChoresRepeatWeekdaysOptions[]>,
    repeatSelections: Signal<ChoresRepeatSelectionsOptions[]>,
    countFromCompletion: Signal<boolean>
  ) => {
    const isModalOpen = signal(false)
    const handleBack = () => {
      isModalOpen.set(false)
    }
    useBackHandler(() => {
      if (isModalOpen.get()) {
        handleBack()
        return true
      }
    })

    const handleClear = (e: MouseEvent) => {
      e.stopPropagation()
      startOn.set(new Date().toISOString())
      repeatInterval.set(0)
      repeatUnit.set('')
      repeatSelections.set([])
      repeatWeekdays.set([])
      countFromCompletion.set(false)
    }

    const isScheduled = computed(() => {
      // Need to read each signal for this to work properly
      const isStartOnLater = new Date(startOn.get()).valueOf() > Date.now()
      const hasRepeatInterval = repeatInterval.get() > 0
      const hasRepeatUnit = !!repeatUnit.get()
      const hasRepeatWeekdays = repeatWeekdays.get().length > 0
      const hasRepeatSelections = repeatSelections.get().length > 0
      return (
        isStartOnLater ||
        hasRepeatInterval ||
        hasRepeatUnit ||
        hasRepeatWeekdays ||
        hasRepeatSelections
      )
    })

    const handleRepeatChange = (e: CheckboxCustomEvent) => {
      const { checked } = e.detail

      if (!checked) {
        repeatInterval.set(0)
        repeatUnit.set('')
        repeatSelections.set([])
        repeatWeekdays.set([])
        countFromCompletion.set(false)
      } else {
        repeatInterval.set(1)
        repeatUnit.set(ChoresRepeatUnitOptions.day)
      }
    }

    return html`
      <div>
        <ion-chip @click=${() => isModalOpen.set(true)}>
          ${() =>
            isScheduled.get()
              ? html`
                  <ion-label>Modify schedule</ion-label>
                  <ion-icon name="close" @click=${handleClear}></ion-icon>
                `
              : html`<ion-label>Add schedule</ion-label>`}
        </ion-chip>
      </div>
      <ion-modal .isOpen=${isModalOpen}>
        <ion-header>
          <ion-toolbar>
            <ion-buttons>
              <ion-button @click=${handleBack}>
                <ion-icon name="arrow-back" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button @click=${handleBack}>Done</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-datetime
            .value=${() => formatISO(startOn.get())}
            @ionChange=${(e: CustomEvent<{ value: string }>) => {
              const formattedDate = formatISO(e.detail.value.replace('Z', ''))
              startOn.set(formattedDate)
            }}
            style="min-width: 100%"
            class="ion-margin-bottom"
          ></ion-datetime>
          <ion-list>
            <ion-item>
              <ion-checkbox
                justify="start"
                .checked=${() => !!repeatUnit.get()}
                @ionChange=${handleRepeatChange}
              >
                Repeat
              </ion-checkbox>
            </ion-item>

            ${() =>
              when(
                repeatUnit.get(),
                () => html`
                  <ion-item>
                    <ion-input
                      label="Every"
                      type="number"
                      min="1"
                      .value=${bind(repeatInterval)}
                    ></ion-input>
                    <ion-select .value=${bind(repeatUnit, 'ionChange')}>
                      <ion-select-option value=${ChoresRepeatUnitOptions.day}>
                        Days
                      </ion-select-option>
                      <ion-select-option value=${ChoresRepeatUnitOptions.week}>
                        Weeks
                      </ion-select-option>
                      <ion-select-option value=${ChoresRepeatUnitOptions.month}>
                        Months
                      </ion-select-option>
                    </ion-select>
                  </ion-item>

                  <ion-item>
                    ${() =>
                      choose(repeatUnit.get(), [
                        [
                          ChoresRepeatUnitOptions.day,
                          () => html`
                            <ion-checkbox
                              .checked=${bind(countFromCompletion, 'ionChange')}
                              justify="start"
                            >
                              After last completion
                            </ion-checkbox>
                          `,
                        ],
                        [
                          ChoresRepeatUnitOptions.week,
                          () =>
                            html`${Object.values(
                              ChoresRepeatWeekdaysOptions
                            ).map((day) => {
                              const isSelected = computed(() =>
                                repeatWeekdays.get().includes(day)
                              )
                              return html`
                                <ion-chip
                                  style=${() =>
                                    'padding-inline: 6px; justify-content: center; min-width: 32px;' +
                                    (isSelected.get()
                                      ? ' --background: var(--ion-color-primary); --color: var(--ion-color-primary-contrast);'
                                      : '')}
                                  @click=${() => {
                                    repeatWeekdays.update((days) =>
                                      isSelected.get()
                                        ? days.filter((d) => d !== day)
                                        : [...days, day]
                                    )
                                  }}
                                >
                                  <ion-text style="font-size: small;">
                                    ${day}
                                  </ion-text>
                                </ion-chip>
                              `
                            })}`,
                        ],
                        [
                          ChoresRepeatUnitOptions.month,
                          () => html`<ion-select
                            label="Days of month"
                            multiple
                            .value=${bind(repeatSelections, 'ionChange')}
                          >
                            ${Object.values(ChoresRepeatSelectionsOptions).map(
                              (selection) => html`
                                <ion-select-option value=${selection}>
                                  ${formatDate(selection)}
                                </ion-select-option>
                              `
                            )}
                          </ion-select>`,
                        ],
                      ])}
                  </ion-item>
                `
              )}
          </ion-list>
        </ion-content>
      </ion-modal>
    `
  }
)
