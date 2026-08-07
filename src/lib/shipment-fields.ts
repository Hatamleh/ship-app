/**
 * Fields the assistant is allowed to propose values for.
 *
 * Plain module on purpose: this is shared by server-side tool definitions and
 * client-side form state, so it must not live in a .svelte.ts runes file.
 * Sender fields are absent — they come from the signed-in account.
 */
export const AGENT_WRITABLE_FIELDS = [
  'receiverName',
  'receiverPhone',
  'receiverCountry',
  'receiverCity',
  'receiverStreet',
  'receiverPostalCode',
  'weight',
  'length',
  'width',
  'height',
  'itemDescription',
  'pickupMethod',
  'signatureRequired',
  'containsLiquid',
  'insurance',
  'packaging',
] as const
