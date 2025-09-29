<script lang="ts">
  interface Props {
    class?: string;
    clickable?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: any;
  }

  let {
    class: className = "",
    clickable = false,
    onclick,
    children,
    ...restProps
  }: Props = $props();

  const classes = $derived(["card", clickable ? "card--clickable" : "", className]
    .filter(Boolean)
    .join(" "));
</script>

<div class={classes} {onclick} {...restProps}>
  {@render children?.()}
</div>

<style>
  .card {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition:
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }

  .card--clickable {
    cursor: pointer;
  }

  .card--clickable:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .card--clickable:active {
    transform: translateY(0);
  }
</style>
