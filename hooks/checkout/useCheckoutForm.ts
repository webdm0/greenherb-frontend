"use client"

import type { ChangeEvent, FocusEvent } from "react"
import { useState } from "react"
import {
  getCheckoutValidationErrors,
  sanitizeAddress,
  sanitizeLocation,
  sanitizeNotes,
  sanitizePersonName,
  sanitizePhone,
  sanitizePostalCode,
  validateCheckoutField,
} from "@/lib/checkout-validation"

export type CheckoutFormState = {
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

export type CheckoutFormField = keyof CheckoutFormState
export type CheckoutFormErrors = Partial<Record<CheckoutFormField, string>>
export type CheckoutFormTouched = Partial<Record<CheckoutFormField, boolean>>

const checkoutFieldOrder: CheckoutFormField[] = [
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

export const checkoutCountries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Poland",
  "Ukraine",
]

const initialFormState: CheckoutFormState = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  shippingCountry: "United States",
  shippingCity: "",
  shippingAddressLine1: "",
  shippingAddressLine2: "",
  shippingPostalCode: "",
  shippingRegion: "",
  notes: "",
}

export function useCheckoutForm() {
  const [formState, setFormState] = useState<CheckoutFormState>(initialFormState)
  const [fieldErrors, setFieldErrors] = useState<CheckoutFormErrors>({})
  const [touchedFields, setTouchedFields] = useState<CheckoutFormTouched>({})

  const handleFieldChange =
    (field: CheckoutFormField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const rawValue = event.target.value
      const nextValue =
        field === "customerName"
          ? sanitizePersonName(rawValue)
          : field === "customerPhone"
            ? sanitizePhone(rawValue)
            : field === "shippingCountry" || field === "shippingCity" || field === "shippingRegion"
              ? sanitizeLocation(rawValue)
              : field === "shippingAddressLine1" || field === "shippingAddressLine2"
                ? sanitizeAddress(rawValue)
                : field === "shippingPostalCode"
                  ? sanitizePostalCode(rawValue)
                  : field === "notes"
                    ? sanitizeNotes(rawValue)
                    : rawValue

      setFormState((current) => {
        const nextState = {
          ...current,
          [field]: nextValue,
        }

        if (touchedFields[field]) {
          setFieldErrors((currentErrors) => {
            const nextError = validateCheckoutField(field, nextState)

            if (!nextError) {
              const { [field]: _removed, ...rest } = currentErrors
              return rest
            }

            return {
              ...currentErrors,
              [field]: nextError,
            }
          })
        }

        return nextState
      })
    }

  const handleCountryChange = (value: string) => {
    setFormState((current) => {
      const nextState = {
        ...current,
        shippingCountry: value,
      }

      if (touchedFields.shippingCountry) {
        setFieldErrors((currentErrors) => {
          const nextError = validateCheckoutField("shippingCountry", nextState)

          if (!nextError) {
            const { shippingCountry: _removed, ...rest } = currentErrors
            return rest
          }

          return {
            ...currentErrors,
            shippingCountry: nextError,
          }
        })
      }

      return nextState
    })
  }

  const handleFieldBlur =
    (field: CheckoutFormField) =>
    (_event?: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTouchedFields((current) => ({
        ...current,
        [field]: true,
      }))

      setFieldErrors((current) => {
        const nextError = validateCheckoutField(field, formState)

        if (!nextError) {
          const { [field]: _removed, ...rest } = current
          return rest
        }

        return {
          ...current,
          [field]: nextError,
        }
      })
    }

  const validateAllFields = () => {
    const nextErrors = getCheckoutValidationErrors(formState)

    setTouchedFields({
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      shippingCountry: true,
      shippingCity: true,
      shippingAddressLine1: true,
      shippingAddressLine2: true,
      shippingPostalCode: true,
      shippingRegion: true,
      notes: true,
    })
    setFieldErrors(nextErrors)

    const firstInvalidField = checkoutFieldOrder.find((field) => nextErrors[field])

    return {
      firstInvalidField: firstInvalidField ?? null,
      isValid: Object.keys(nextErrors).length === 0,
    }
  }

  return {
    fieldErrors,
    formState,
    handleCountryChange,
    handleFieldBlur,
    handleFieldChange,
    touchedFields,
    validateAllFields,
  }
}
