import {
  type ToastButton,
  type Color,
  type IonToastCustomEvent,
} from '@ionic/core'
import { TemplateResult, nothing } from 'lit-html'
import { component, html, signal } from 'solit'

export const currentToast = signal<TemplateResult | typeof nothing>(nothing)

type Props = {
  message: string
  color?: Color
  button?: ToastButton
  /** Defaults to 2 seconds or 100ms per character, whichever is longer */
  duration?: number
  onDidDismiss?(e: IonToastCustomEvent<any>): void
}
export const Toast = component(
  ({ message, color, button, duration, onDidDismiss }: Props) => {
    return html`
      <ion-toast
        .isOpen=${true}
        message=${message}
        duration=${duration ?? Math.max(message.length * 100, 2_000)}
        color=${color}
        swipe-gesture="vertical"
        .buttons=${[button]}
        @didDismiss=${(e: IonToastCustomEvent<any>) => {
          onDidDismiss?.(e)
          setTimeout(currentToast.reset)
        }}
      ></ion-toast>
    `
  }
)

export const showToast = (props: Props) => {
  currentToast.set(Toast(props))
}
