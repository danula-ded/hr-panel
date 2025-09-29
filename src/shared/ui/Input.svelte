<script lang="ts">
  interface Props {
    type?: "text" | "email" | "tel" | "password" | "number";
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    error?: string;
    label?: string;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
    onfocus?: (event: FocusEvent) => void;
    onblur?: (event: FocusEvent) => void;
  }

  let {
    type = "text",
    placeholder = "",
    value = $bindable(""),
    disabled = false,
    required = false,
    class: className = "",
    error = "",
    label = "",
    min,
    max,
    step,
    oninput,
    onchange,
    onfocus,
    onblur,
    ...restProps
  }: Props = $props();

	const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
	const classes = $derived([
		"input",
		error ? "input--error" : "",
		disabled ? "input--disabled" : "",
		className,
	].filter(Boolean).join(" "));
</script>

<div class="input-group">
  {#if label}
    <label for={inputId} class="input-label">
      {label}
      {#if required}
        <span class="input-required">*</span>
      {/if}
    </label>
  {/if}

	<input
    id={inputId}
    {type}
    {placeholder}
    bind:value
    {disabled}
    {required}
    class={classes}
    {min}
    {max}
    {step}
    {oninput}
    {onchange}
    {onfocus}
    {onblur}
		{...restProps}
  />

  {#if error}
    <span class="input-error">{error}</span>
  {/if}
</div>

<style>
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
    box-sizing: border-box;
  }

  .input-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .input-required {
    color: var(--color-danger);
    margin-left: 0.25rem;
  }

  .input {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
    background-color: var(--color-background);
    color: var(--color-text);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }

  .input--error {
    border-color: var(--color-danger);
  }

  .input--error:focus {
    border-color: var(--color-danger);
    box-shadow: 0 0 0 3px var(--color-danger-light);
  }

  .input--disabled {
    background-color: var(--color-secondary);
    color: var(--color-text-muted);
    cursor: not-allowed;
  }

  .input-error {
    font-size: 0.75rem;
    color: var(--color-danger);
  }
</style>
