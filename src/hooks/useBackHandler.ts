import { effect, Signal } from 'solit'

let stack = [] as (() => boolean | void)[]
window.addEventListener('popstate', (e: PopStateEvent) => {
  let preventNavigation = false
  let nextIndex = stack.length - 1
  while (!preventNavigation && nextIndex >= 0) {
    preventNavigation = !!stack[nextIndex]()
    nextIndex--
  }

  if (preventNavigation) {
    e.preventDefault()
    history.go(1)
  }
})

/**
 * Adds a handler to a stack. When the browser back action is triggered,
 * the handlers are called until one of them returns true, which prevents
 * the navigation.
 */
export const useBackHandler = (handler: () => boolean | void) => {
  effect(() => {
    stack.push(handler)

    return () => {
      stack = stack.filter((h) => h !== handler)
    }
  })
}

export const useResetOnBack = (sig: Signal<any>) => {
  useBackHandler(() => {
    if (sig.get()) {
      sig.reset()
      return true
    }
  })
}
