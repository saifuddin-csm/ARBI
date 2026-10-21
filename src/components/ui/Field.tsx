import { type ComponentProps, type ReactNode, useId } from "react";

import { cn } from "@/lib/utils/cn";

type FieldShellProps = {
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
  className?: string;
};

/** Label + control + hint/error wiring shared by all form fields. */
function FieldShell({ label, error, hint, optional, children, className }: FieldShellProps) {
  const id = useId();
  const describedBy =
    [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") ||
    undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-sale">
          {error}
        </p>
      )}
    </div>
  );
}

const control = (invalid: boolean) =>
  cn(
    "w-full border bg-bg px-3 text-sm outline-none focus:border-text",
    invalid ? "border-sale" : "border-line",
  );

type Common = {
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  wrapperClassName?: string;
};

export function TextField({
  label,
  error,
  hint,
  optional,
  wrapperClassName,
  className,
  ...props
}: Common & ComponentProps<"input">) {
  return (
    <FieldShell
      label={label}
      error={error}
      hint={hint}
      optional={optional}
      className={wrapperClassName}
    >
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(control(invalid), "h-12", className)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  optional,
  wrapperClassName,
  className,
  ...props
}: Common & ComponentProps<"textarea">) {
  return (
    <FieldShell
      label={label}
      error={error}
      hint={hint}
      optional={optional}
      className={wrapperClassName}
    >
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(control(invalid), "py-3", className)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function SelectField({
  label,
  error,
  hint,
  optional,
  wrapperClassName,
  className,
  children,
  ...props
}: Common & ComponentProps<"select">) {
  return (
    <FieldShell
      label={label}
      error={error}
      hint={hint}
      optional={optional}
      className={wrapperClassName}
    >
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(control(invalid), "h-12", className)}
          {...props}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
}
