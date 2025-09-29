<script lang="ts">
  interface Props {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    class?: string;
    onclick?: (event: MouseEvent) => void;
    children?: any;
  }

  let {
    variant = "primary",
    size = "md",
    disabled = false,
    type = "button",
    class: className = "",
    onclick,
    children,
    ...restProps
  }: Props = $props();

  const classes = $derived([
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    disabled ? "btn--disabled" : "",
    className,
  ].filter(Boolean).join(" "));
</script>

<button {type} {disabled} class={classes} {onclick} {...restProps}>
  {@render children?.()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .btn:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .btn--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Variants */
  .btn--primary {
    background-color: var(--color-primary);
    color: white;
  }

  .btn--primary:hover:not(.btn--disabled) {
    background-color: var(--color-primary-dark);
  }

  .btn--secondary {
    background-color: var(--color-secondary);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .btn--secondary:hover:not(.btn--disabled) {
    background-color: var(--color-secondary-hover);
  }

  .btn--danger {
    background-color: var(--color-danger);
    color: white;
  }

  .btn--danger:hover:not(.btn--disabled) {
    background-color: var(--color-danger-dark);
  }

  .btn--ghost {
    background-color: transparent;
    color: var(--color-text);
  }

  .btn--ghost:hover:not(.btn--disabled) {
    background-color: var(--color-secondary);
  }

  /* Sizes */
  .btn--sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .btn--md {
    padding: 0.625rem 1rem;
    font-size: 1rem;
  }

  .btn--lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }
</style>
