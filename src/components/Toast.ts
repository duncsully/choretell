import { type Color } from '@ionic/core'
import { TemplateResult, nothing } from 'lit-html'
import { component, html, signal } from 'solit'

export const currentToast = signal<TemplateResult | typeof nothing>(nothing)

export const Toast = component(
  ({ message, color }: { message: string; color?: Color }) => {
    return html`
      <ion-toast
        .isOpen=${true}
        message=${message}
        duration=${Math.max(message.length * 100, 2_000)}
        color=${color}
        swipe-gesture="vertical"
      ></ion-toast>
    `
  }
)

export const showToast = (message: string, color?: Color) => {
  currentToast.set(Toast({ message, color }))
}
