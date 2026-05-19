const CUSTOMER_NAME_MIN_LENGTH = 2
const CUSTOMER_NAME_MAX_LENGTH = 120
const CUSTOMER_EMAIL_MAX_LENGTH = 255
const CUSTOMER_PHONE_MAX_LENGTH = 40
const SHIPPING_ADDRESS_MAX_LENGTH = 255
const SHIPPING_LOCATION_MAX_LENGTH = 120
const SHIPPING_POSTAL_CODE_MAX_LENGTH = 40
const NOTES_MAX_LENGTH = 1000

const PERSON_NAME_PATTERN = /^\s*[\p{L}\p{M}0-9][\p{L}\p{M}0-9 .'-]*\s*$/u
const PHONE_PATTERN = /^\s*\+?[0-9][0-9(). -]{6,19}\s*$/u
const ADDRESS_PATTERN = /^\s*[\p{L}\p{M}0-9][\p{L}\p{M}0-9\s,.'#/-]*\s*$/u
const POSTAL_CODE_PATTERN = /^\s*[A-Za-z0-9][A-Za-z0-9 -]{1,19}\s*$/u
const LOCATION_PATTERN = /^\s*[\p{L}\p{M}0-9][\p{L}\p{M}0-9 .'-]*\s*$/u
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function normalizeOptional(value: string) {
  const normalized = normalizeWhitespace(value)
  return normalized || undefined
}

export function sanitizePersonName(value: string) {
  return value
    .replace(/[^\p{L}\p{M}0-9 .'-]/gu, "")
    .replace(/\s+/g, " ")
    .replace(/-{2,}/g, "-")
    .replace(/'{2,}/g, "'")
    .replace(/\.{2,}/g, ".")
    .trimStart()
    .slice(0, CUSTOMER_NAME_MAX_LENGTH)
}

export function sanitizePhone(value: string) {
  return value
    .replace(/[^0-9()+.\- ]/g, "")
    .replace(/\s+/g, " ")
    .trimStart()
    .slice(0, CUSTOMER_PHONE_MAX_LENGTH)
}

export function sanitizeAddress(value: string) {
  return value
    .replace(/[^\p{L}\p{M}0-9\s,.'#/-]/gu, "")
    .replace(/\s+/g, " ")
    .trimStart()
    .slice(0, SHIPPING_ADDRESS_MAX_LENGTH)
}

export function sanitizeLocation(value: string) {
  return value
    .replace(/[^\p{L}\p{M}0-9 .'-]/gu, "")
    .replace(/\s+/g, " ")
    .replace(/-{2,}/g, "-")
    .replace(/'{2,}/g, "'")
    .replace(/\.{2,}/g, ".")
    .trimStart()
    .slice(0, SHIPPING_LOCATION_MAX_LENGTH)
}

export function sanitizePostalCode(value: string) {
  return value
    .replace(/[^A-Za-z0-9 -]/g, "")
    .replace(/\s+/g, " ")
    .trimStart()
    .slice(0, SHIPPING_POSTAL_CODE_MAX_LENGTH)
}

export function sanitizeNotes(value: string) {
  return value.slice(0, NOTES_MAX_LENGTH)
}

export function normalizeCustomerName(value: string) {
  return normalizeWhitespace(value)
}

export type CheckoutValidationInput = {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingCountry: string
  shippingCity: string
  shippingAddressLine1: string
  shippingAddressLine2: string
  shippingPostalCode: string
  shippingRegion: string
  notes: string
}

export type CheckoutValidationField = keyof CheckoutValidationInput

export function validateCheckoutField(
  field: CheckoutValidationField,
  input: CheckoutValidationInput,
) {
  const fullName = normalizeCustomerName(input.customerName)
  const email = normalizeWhitespace(input.customerEmail)
  const phone = normalizeWhitespace(input.customerPhone)
  const shippingCountry = normalizeWhitespace(input.shippingCountry)
  const shippingCity = normalizeWhitespace(input.shippingCity)
  const shippingAddressLine1 = normalizeWhitespace(input.shippingAddressLine1)
  const shippingAddressLine2 = normalizeOptional(input.shippingAddressLine2)
  const shippingPostalCode = normalizeWhitespace(input.shippingPostalCode)
  const shippingRegion = normalizeOptional(input.shippingRegion)
  const notes = normalizeOptional(input.notes)

  switch (field) {
    case "customerName":
      if (fullName.length < CUSTOMER_NAME_MIN_LENGTH) {
        return "Please enter your full name."
      }

      if (
        fullName.length > CUSTOMER_NAME_MAX_LENGTH ||
        !PERSON_NAME_PATTERN.test(fullName)
      ) {
        return "Please enter a valid name."
      }

      return null
    case "customerEmail":
      if (!email) {
        return "Please enter your email address."
      }

      if (email.length > CUSTOMER_EMAIL_MAX_LENGTH) {
        return "Please enter a shorter email address."
      }

      if (!EMAIL_PATTERN.test(email)) {
        return "Please enter a valid email address."
      }

      return null
    case "customerPhone":
      if (!phone) {
        return "Please enter your phone number."
      }

      if (phone.length > CUSTOMER_PHONE_MAX_LENGTH || !PHONE_PATTERN.test(phone)) {
        return "Please enter a valid phone number."
      }

      return null
    case "shippingCountry":
      if (!shippingCountry) {
        return "Please enter your country."
      }

      if (
        shippingCountry.length > SHIPPING_LOCATION_MAX_LENGTH ||
        !LOCATION_PATTERN.test(shippingCountry)
      ) {
        return "Please enter a valid country."
      }

      return null
    case "shippingCity":
      if (!shippingCity) {
        return "Please enter your city."
      }

      if (
        shippingCity.length > SHIPPING_LOCATION_MAX_LENGTH ||
        !LOCATION_PATTERN.test(shippingCity)
      ) {
        return "Please enter a valid city."
      }

      return null
    case "shippingAddressLine1":
      if (!shippingAddressLine1) {
        return "Please enter your street address."
      }

      if (
        shippingAddressLine1.length > SHIPPING_ADDRESS_MAX_LENGTH ||
        !ADDRESS_PATTERN.test(shippingAddressLine1)
      ) {
        return "Please enter a valid street address."
      }

      return null
    case "shippingAddressLine2":
      if (
        shippingAddressLine2 &&
        (shippingAddressLine2.length > SHIPPING_ADDRESS_MAX_LENGTH ||
          !ADDRESS_PATTERN.test(shippingAddressLine2))
      ) {
        return "Please check apartment, suite, or unit details."
      }

      return null
    case "shippingPostalCode":
      if (!shippingPostalCode) {
        return "Please enter your ZIP or postal code."
      }

      if (
        shippingPostalCode.length > SHIPPING_POSTAL_CODE_MAX_LENGTH ||
        !POSTAL_CODE_PATTERN.test(shippingPostalCode)
      ) {
        return "Please enter a valid ZIP or postal code."
      }

      return null
    case "shippingRegion":
      if (
        shippingRegion &&
        (shippingRegion.length > SHIPPING_LOCATION_MAX_LENGTH ||
          !LOCATION_PATTERN.test(shippingRegion))
      ) {
        return "Please enter a valid state, province, or region."
      }

      return null
    case "notes":
      if (notes && notes.length > NOTES_MAX_LENGTH) {
        return "Please keep your delivery notes a little shorter."
      }

      return null
    default:
      return null
  }
}

export function getCheckoutValidationErrors(input: CheckoutValidationInput) {
  const fields: CheckoutValidationField[] = [
    "customerName",
    "customerEmail",
    "customerPhone",
    "shippingCountry",
    "shippingCity",
    "shippingAddressLine1",
    "shippingAddressLine2",
    "shippingPostalCode",
    "shippingRegion",
    "notes",
  ]

  return fields.reduce<Partial<Record<CheckoutValidationField, string>>>(
    (errors, field) => {
      const error = validateCheckoutField(field, input)
      if (error) {
        errors[field] = error
      }

      return errors
    },
    {},
  )
}

export function validateCheckoutDetails(input: CheckoutValidationInput) {
  const errors = getCheckoutValidationErrors(input)

  const fieldOrder: CheckoutValidationField[] = [
    "customerName",
    "customerEmail",
    "customerPhone",
    "shippingCountry",
    "shippingCity",
    "shippingAddressLine1",
    "shippingAddressLine2",
    "shippingPostalCode",
    "shippingRegion",
    "notes",
  ]

  for (const field of fieldOrder) {
    if (errors[field]) {
      return errors[field]
    }
  }

  return null
}

export const checkoutFieldLimits = {
  customerEmailMaxLength: CUSTOMER_EMAIL_MAX_LENGTH,
  customerNameMaxLength: CUSTOMER_NAME_MAX_LENGTH,
  customerPhoneMaxLength: CUSTOMER_PHONE_MAX_LENGTH,
  notesMaxLength: NOTES_MAX_LENGTH,
  shippingAddressMaxLength: SHIPPING_ADDRESS_MAX_LENGTH,
  shippingLocationMaxLength: SHIPPING_LOCATION_MAX_LENGTH,
  shippingPostalCodeMaxLength: SHIPPING_POSTAL_CODE_MAX_LENGTH,
}
