"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import styles from "./project-disclaimer-modal.module.css"

type ProjectDisclaimerModalProps = {
  title?: string
  descriptionClassName?: string
  triggerLabel: React.ReactNode
  triggerClassName?: string
}

export function ProjectDisclaimerModal({
  title = "Project Disclaimer",
  descriptionClassName,
  triggerLabel,
  triggerClassName,
}: ProjectDisclaimerModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className={triggerClassName}>
          {triggerLabel}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="surface-dialog-overlay" />
        <Dialog.Content
          className={cn(
            "surface-dialog-card",
            descriptionClassName,
          )}
        >
          <Dialog.Title className="surface-dialog-title">
            {title}
          </Dialog.Title>

          <div className={styles.copyCompact}>
            <p>
              GreenHerb is a non-commercial e-commerce concept built for portfolio demonstration.
            </p>
            <p>
              <span className="font-semibold text-foreground">
                Content &amp; Brands:
              </span>{" "}
              All products, descriptions, and logos are fictional. Any resemblance to real brands is purely coincidental.
            </p>
            <p>
              <span className="font-semibold text-foreground">
                Payments:
              </span>{" "}
              The checkout runs strictly in Stripe Test Mode. No real payment data is processed, and no actual charges are made. Feel free to test it with fake card details.
            </p>
          </div>

          <Dialog.Close asChild>
            <Button className="mt-6 w-full sm:w-auto">Close</Button>
          </Dialog.Close>

          <Dialog.Close
            className="surface-dialog-close"
            aria-label="Close project disclaimer"
          >
            <IconX className="h-4 w-4" stroke={1.9} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
