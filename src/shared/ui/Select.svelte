<script lang="ts">
  interface Option {
    value: string;
    label: string;
  }

  interface Props {
    options: Option[];
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    error?: string;
    label?: string;
    onchange?: (event: Event) => void;
    onfocus?: (event: FocusEvent) => void;
    onblur?: (event: FocusEvent) => void;
  }

  let {
    options = [],
    value = $bindable(""),
    placeholder = "Выберите опцию",
    disabled = false,
    required = false,
    class: className = "",
    error = "",
    label = "",
    onchange,
    onfocus,
    onblur,
    ...restProps
  }: Props = $props();

  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;
  const classes = $derived([
    "select",
    error ? "select--error" : "",
    disabled ? "select--disabled" : "",
    className,
  ].filter(Boolean).join(" "));
</script>

<div class="select-group">
  {#if label}
    <label for={selectId} class="select-label">
      {label}
      {#if required}
        <span class="select-required">*</span>
      {/if}
    </label>
  {/if}

  <select
    id={selectId}
    bind:value
    {disabled}
    {required}
    class={classes}
    {onchange}
    {onfocus}
    {onblur}
    {...restProps}
  >
    <option value="" disabled>{placeholder}</option>
    {#each options as option (option.value)}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>

  {#if error}
    <span class="select-error">{error}</span>
  {/if}
</div>

<style>
  .select-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .select-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .select-required {
    color: var(--color-danger);
    margin-left: 0.25rem;
  }

  .select {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
    background-color: var(--color-background);
    color: var(--color-text);
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }

  .select--error {
    border-color: var(--color-danger);
  }

  .select--error:focus {
    border-color: var(--color-danger);
    box-shadow: 0 0 0 3px var(--color-danger-light);
  }

  .select--disabled {
    background-color: var(--color-secondary);
    color: var(--color-text-muted);
    cursor: not-allowed;
  }

  .select-error {
    font-size: 0.75rem;
    color: var(--color-danger);
  }
</style>
