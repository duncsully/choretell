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
    return html`<ion-alert
      .isOpen=${true}
      .buttons=${[
        { text: cancelText, role: 'cancel', handler: onCancel },
        { text: confirmText, role: 'confirm', handler: onConfirm },
      ]}
      header=${header}
      message=${message}
    ></ion-alert>`
  }
)

export const currentConfirmationDialog = signal<
  TemplateResult | typeof nothing
>(nothing)

export const showConfirm = (props: Props) => {
  return new Promise<boolean>((resolve) => {
    const onConfirm = () => {
      resolve(true)
      currentConfirmationDialog.reset()
      props?.onConfirm?.()
    }
    const onCancel = () => {
      resolve(false)
      currentConfirmationDialog.reset()
      props?.onCancel?.()
    }
    currentConfirmationDialog.set(
      ConfirmationDialog({ ...props, onConfirm, onCancel })
    )
  })
}
