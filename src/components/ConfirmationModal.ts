import { TemplateResult, html, nothing } from 'lit-html'
import { component, signal } from 'solit'

type Props = {
  confirmText?: string
  cancelText?: string
  header?: string
  message?: string
  onConfirm?(): void
  onCancel?(): void
}
export const ConfirmationDialog = component(
  ({
    confirmText = 'OK',
    cancelText = 'Cancel',
    header,
    message,
    onCancel,
    onConfirm,
  }: Props) => {
    return html`
      <ion-alert
        .isOpen=${true}
        .buttons=${[
          { text: cancelText, role: 'cancel', handler: onCancel },
          { text: confirmText, role: 'confirm', handler: onConfirm },
        ]}
        header=${header}
        message=${message}
        @didDismiss=${() => setTimeout(currentConfirmationDialog.reset)}
      ></ion-alert>
    `
  }
)

export const currentConfirmationDialog = signal<
  TemplateResult | typeof nothing
>(nothing)

export const showConfirm = (props: Props) => {
  currentConfirmationDialog.set(ConfirmationDialog(props))
}
