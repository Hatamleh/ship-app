/**
 * Connects the shipment form to the assistant panel.
 *
 * The form registers two callbacks when it mounts; the chat drawer uses them to
 * read what the customer has typed and to apply values the agent proposes. They
 * are separate on purpose: reading happens automatically with every message,
 * writing only happens when the user presses "Apply".
 */
export interface FormBridge {
  /** Current form values, or null when no shipment form is on screen. */
  read: (() => Record<string, any>) | null
  /** Writes values into the form. Only ever called from an explicit user action. */
  apply: ((values: Record<string, any>) => void) | null
}

export const formBridge = $state<FormBridge>({ read: null, apply: null })

export function registerForm(read: FormBridge['read'], apply: FormBridge['apply']) {
  formBridge.read = read
  formBridge.apply = apply
}

export function unregisterForm() {
  formBridge.read = null
  formBridge.apply = null
}

export { AGENT_WRITABLE_FIELDS } from '$lib/shipment-fields'
