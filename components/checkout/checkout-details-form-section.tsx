"use client"

import Link from "next/link"
import type { ChangeEvent, FocusEvent } from "react"
import {
  IconLeaf,
  IconMapPin,
  IconTruckDelivery,
} from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import {
  checkoutCountries,
  type CheckoutFormErrors,
  type CheckoutFormField,
  type CheckoutFormState,
} from "@/hooks/checkout/useCheckoutForm"
import { SectionIntro } from "@/components/layout/section-intro"
import { DropdownSelect } from "@/components/ui/dropdown-select"
import { FormMessage } from "@/components/ui/form-message"
import { checkoutFieldLimits } from "@/lib/checkout-validation"
import { cn } from "@/lib/utils"
import styles from "./checkout-details-form-section.module.css"

type RegisterFieldRef = (
  field: CheckoutFormField,
) => (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | null,
) => void

function FieldError({ message }: { message?: string }) {
  return message ? (
    <FormMessage className="mt-2 rounded-none border-0 bg-transparent px-0 py-0 text-destructive" variant="error">
      {message}
    </FormMessage>
  ) : null
}

interface CheckoutInputFieldProps {
  error?: string
  fieldId: string
  hintId?: string
  inputClassName?: string
  label: string
  wrapperClassName?: string
  inputProps: React.ComponentProps<typeof Input>
}

function CheckoutInputField({
  error,
  fieldId,
  hintId,
  inputClassName = styles.checkoutInput,
  label,
  wrapperClassName = "block",
  inputProps,
}: CheckoutInputFieldProps) {
  const errorId = error ? `${fieldId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className={wrapperClassName}>
      <label className="field-label" htmlFor={fieldId}>
        {label}
      </label>
      <Input
        {...inputProps}
        id={fieldId}
        className={inputClassName}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
      />
      {error ? (
        <div id={errorId}>
          <FieldError message={error} />
        </div>
      ) : null}
    </div>
  )
}

type TextInputConfig = {
  autoComplete?: string
  inputMode?: React.ComponentProps<typeof Input>["inputMode"]
  label: string
  maxLength: number
  placeholder: string
  required?: boolean
  type?: React.ComponentProps<typeof Input>["type"]
  wrapperClassName?: string
}

const checkoutFieldConfig: Record<
  | "customerName"
  | "customerEmail"
  | "customerPhone"
  | "shippingCity"
  | "shippingAddressLine1"
  | "shippingAddressLine2"
  | "shippingPostalCode"
  | "shippingRegion",
  TextInputConfig
> = {
  customerName: {
    label: "Full name",
    wrapperClassName: "block md:col-span-2",
    placeholder: "Jane Cooper",
    autoComplete: "name",
    inputMode: "text",
    maxLength: checkoutFieldLimits.customerNameMaxLength,
    required: true,
  },
  customerEmail: {
    label: "Email address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
    maxLength: checkoutFieldLimits.customerEmailMaxLength,
    required: true,
  },
  customerPhone: {
    label: "Mobile phone",
    type: "tel",
    placeholder: "+1 (555) 123-4567",
    autoComplete: "tel",
    inputMode: "tel",
    maxLength: checkoutFieldLimits.customerPhoneMaxLength,
    required: true,
  },
  shippingCity: {
    label: "City",
    placeholder: "San Diego",
    autoComplete: "address-level2",
    maxLength: checkoutFieldLimits.shippingLocationMaxLength,
    required: true,
  },
  shippingAddressLine1: {
    label: "Address line 1",
    wrapperClassName: "block md:col-span-2",
    placeholder: "123 Market Street, Apt 5B",
    autoComplete: "address-line1",
    maxLength: checkoutFieldLimits.shippingAddressMaxLength,
    required: true,
  },
  shippingAddressLine2: {
    label: "Address line 2",
    wrapperClassName: "block md:col-span-2",
    placeholder: "Building, suite, floor, or delivery note",
    autoComplete: "address-line2",
    maxLength: checkoutFieldLimits.shippingAddressMaxLength,
  },
  shippingPostalCode: {
    label: "Postal code",
    placeholder: "92101",
    autoComplete: "postal-code",
    maxLength: checkoutFieldLimits.shippingPostalCodeMaxLength,
    required: true,
  },
  shippingRegion: {
    label: "State / region",
    placeholder: "California",
    autoComplete: "address-level1",
    maxLength: checkoutFieldLimits.shippingLocationMaxLength,
  },
}

function getCheckoutInputProps(
  field: keyof typeof checkoutFieldConfig,
  formState: CheckoutFormState,
  handleFieldBlur: (
    field: CheckoutFormField,
  ) => (_event?: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  handleFieldChange: (
    field: CheckoutFormField,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  registerFieldRef: RegisterFieldRef,
  userEmail?: string,
) {
  const config = checkoutFieldConfig[field]

  return {
    fieldId: field,
    label: config.label,
    wrapperClassName: config.wrapperClassName,
    inputProps: {
      ref: registerFieldRef(field),
      type: config.type,
      value: formState[field],
      onChange: handleFieldChange(field),
      onBlur: handleFieldBlur(field),
      placeholder:
        field === "customerEmail" && userEmail ? userEmail : config.placeholder,
      autoComplete: config.autoComplete,
      inputMode: config.inputMode,
      maxLength: config.maxLength,
      required: config.required,
    },
  }
}

export function CheckoutDetailsFormSection({
  fieldErrors,
  formState,
  handleCountryChange,
  handleFieldBlur,
  handleFieldChange,
  isAuthenticated,
  registerFieldRef,
  userEmail,
}: {
  fieldErrors: CheckoutFormErrors
  formState: CheckoutFormState
  handleCountryChange: (value: string) => void
  handleFieldBlur: (
    field: CheckoutFormField,
  ) => (_event?: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleFieldChange: (
    field: CheckoutFormField,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  isAuthenticated: boolean
  registerFieldRef: RegisterFieldRef
  userEmail?: string
}) {
  const countryErrorId = fieldErrors.shippingCountry ? "shippingCountry-error" : undefined
  const notesErrorId = fieldErrors.notes ? "notes-error" : undefined

  return (
    <div className="space-y-6">
      <section className="surface-section">
        <SectionIntro
          eyebrow="Contact info"
          title="Contact details"
          description="We will use these details for order updates and delivery coordination."
          icon={<IconLeaf className="h-5 w-5" stroke={1.9} />}
        />

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <CheckoutInputField
            error={fieldErrors.customerName}
            {...getCheckoutInputProps(
              "customerName",
              formState,
              handleFieldBlur,
              handleFieldChange,
              registerFieldRef,
              userEmail,
            )}
          />

          <CheckoutInputField
            error={fieldErrors.customerEmail}
            {...getCheckoutInputProps(
              "customerEmail",
              formState,
              handleFieldBlur,
              handleFieldChange,
              registerFieldRef,
              userEmail,
            )}
          />

          <CheckoutInputField
            error={fieldErrors.customerPhone}
            {...getCheckoutInputProps(
              "customerPhone",
              formState,
              handleFieldBlur,
              handleFieldChange,
              registerFieldRef,
              userEmail,
            )}
          />
        </div>
      </section>

      <section className="surface-section">
        <SectionIntro
          eyebrow="Shipping address"
          title="Delivery details"
          description="Enter the address exactly as the courier should see it."
          icon={<IconMapPin className="h-5 w-5" stroke={1.9} />}
        />

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="block">
            <label className="field-label" id="shippingCountry-label" htmlFor="shippingCountry">
              Country
            </label>
            <DropdownSelect
              ref={registerFieldRef("shippingCountry")}
              id="shippingCountry"
              ariaDescribedBy={countryErrorId}
              ariaLabel="Select country"
              ariaLabelledBy="shippingCountry-label"
              className={styles.checkoutSelect}
              invalid={Boolean(fieldErrors.shippingCountry)}
              onValueChange={(country) => {
                handleCountryChange(country)
                handleFieldBlur("shippingCountry")()
              }}
              options={checkoutCountries.map((country) => ({
                label: country,
                value: country,
              }))}
              placeholder="Select country"
              value={formState.shippingCountry}
            />
            {fieldErrors.shippingCountry ? (
              <div id={countryErrorId}>
                <FieldError message={fieldErrors.shippingCountry} />
              </div>
            ) : null}
          </div>

          <CheckoutInputField
            error={fieldErrors.shippingCity}
            {...getCheckoutInputProps(
              "shippingCity",
              formState,
              handleFieldBlur,
              handleFieldChange,
              registerFieldRef,
            )}
          />

          <CheckoutInputField
            error={fieldErrors.shippingAddressLine1}
            {...getCheckoutInputProps(
              "shippingAddressLine1",
              formState,
              handleFieldBlur,
              handleFieldChange,
              registerFieldRef,
            )}
          />

          <CheckoutInputField
            error={fieldErrors.shippingAddressLine2}
            {...getCheckoutInputProps(
              "shippingAddressLine2",
              formState,
              handleFieldBlur,
              handleFieldChange,
              registerFieldRef,
            )}
          />

          <CheckoutInputField
            error={fieldErrors.shippingPostalCode}
            {...getCheckoutInputProps(
              "shippingPostalCode",
              formState,
              handleFieldBlur,
              handleFieldChange,
              registerFieldRef,
            )}
          />

          <CheckoutInputField
            error={fieldErrors.shippingRegion}
            {...getCheckoutInputProps(
              "shippingRegion",
              formState,
              handleFieldBlur,
              handleFieldChange,
              registerFieldRef,
            )}
          />
        </div>
      </section>

      <section className="surface-section">
        <SectionIntro
          eyebrow="Additional details"
          title="Delivery notes"
          icon={<IconTruckDelivery className="h-5 w-5" stroke={1.9} />}
        />

        <div className="mt-6 block">
          <label className="field-label" htmlFor="notes">
            Delivery notes
          </label>
          <textarea
            id="notes"
            ref={registerFieldRef("notes")}
            className={cn(
              "surface-textarea",
              fieldErrors.notes && "border-destructive focus-visible:ring-destructive/20",
            )}
            value={formState.notes}
            onChange={handleFieldChange("notes")}
            onBlur={handleFieldBlur("notes")}
            placeholder="Delivery time window, intercom code, gift note, or any special instructions."
            maxLength={checkoutFieldLimits.notesMaxLength}
            aria-describedby={notesErrorId}
            aria-invalid={fieldErrors.notes ? true : undefined}
          />
          {fieldErrors.notes ? (
            <div id={notesErrorId}>
              <FieldError message={fieldErrors.notes} />
            </div>
          ) : null}
        </div>
      </section>

      {!isAuthenticated ? (
        <FormMessage>
          Please{" "}
          <Link
            href="/login"
            prefetch={false}
            className="font-semibold text-foreground inline-muted-link"
          >
            sign in
          </Link>{" "}
          to continue with payment and keep this order linked to your account.
        </FormMessage>
      ) : null}
    </div>
  )
}
