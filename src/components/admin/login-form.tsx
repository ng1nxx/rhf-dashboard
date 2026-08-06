"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, type LoginState } from "@/lib/auth/actions";

/**
 * Admin login form — PRD §12.1.
 *
 * A client component only because it needs `useActionState` for the pending
 * state and the error message. The credentials never touch client code: the
 * form posts straight to the `login` server action.
 */
export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="flex flex-col gap-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-semibold text-rhf-charcoal"
        >
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="h-11"
          placeholder="admin@rhfcatering.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-rhf-charcoal"
        >
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            // Room on the right so the typed password never runs under the eye.
            className="h-11 pr-11"
          />

          {/*
            `type="button"` matters: the default inside a <form> is "submit",
            so without it every peek would fire a login attempt — and each
            failure counts against the rate limit.
          */}
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            // The label states the action, not the state, which is what a
            // screen reader user needs to decide whether to press it.
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            aria-pressed={showPassword}
            aria-controls="password"
            className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-rhf-deep-orange focus-visible:ring-3 focus-visible:ring-rhf-orange/40 focus-visible:outline-none"
          >
            {showPassword ? (
              <EyeOff aria-hidden className="size-4.5" />
            ) : (
              <Eye aria-hidden className="size-4.5" />
            )}
          </button>
        </div>
      </div>

      {state?.error ? (
        // `role="alert"` so a screen reader announces the failure without the
        // user having to go hunting for it — PRD §20.2.
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="rhf"
        size="rhfLg"
        disabled={pending}
        className="mt-1 w-full"
      >
        {pending ? "Memeriksa…" : "Masuk"}
      </Button>
    </form>
  );
}
