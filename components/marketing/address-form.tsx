"use client";

import { useState } from "react";

import { WipeButton } from "@/components/marketing/wipe-button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

/**
 * The frosted "enter your address" pill.
 *
 * Built on `InputGroup` — the primitive for a control with a button inside it —
 * which supplies the group role, focus-within handling and click-to-focus. Its
 * default chrome is replaced to match the glass treatment; the behaviour is
 * what we're after.
 *
 * Inert by default: local state, no-op on submit, so the template runs with no
 * API key or billing account attached. Swap `onSubmit` to wire it up.
 */
export function AddressForm({
  placeholder,
  label,
  cta,
}: {
  placeholder: string;
  /** Accessible name for the input; it has no visible <label>. */
  label: string;
  /** One button, two label lengths — the long form doesn't fit on phones. */
  cta: { readonly short: string; readonly long: string };
}) {
  const [address, setAddress] = useState("");

  return (
    <form
      noValidate
      onSubmit={(event) => event.preventDefault()}
      className="flex w-full max-w-[560px] flex-col items-stretch"
    >
      <InputGroup className="isolate h-[56px] max-w-[340px] rounded-[12px] border-white/[0.22] bg-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.24)] backdrop-blur-[6px] backdrop-saturate-[1.1] [transform:translateZ(0)] focus-within:border-surface/40 has-[[data-slot=input-group-control]:focus-visible]:border-surface/40 has-[[data-slot=input-group-control]:focus-visible]:ring-0 md:h-[60px] md:max-w-[400px]">
        <InputGroupInput
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          aria-label={label}
          placeholder={placeholder}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          className="h-full pr-[12px] pl-[16px] font-sans text-[16px] tracking-[-0.02em] text-surface placeholder:text-surface/75 md:pr-[16px] md:pl-[20px]"
        />

        <InputGroupAddon align="inline-end" className="pr-0">
          <WipeButton
            tone="pill"
            size="pill"
            lift={false}
            hoverTextClass="group-hover/wipe:text-contrast"
            ariaLabel={cta.long}
            className="mr-[6px]"
          >
            <span className="md:hidden">{cta.short}</span>
            <span className="hidden md:inline">{cta.long}</span>
          </WipeButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
