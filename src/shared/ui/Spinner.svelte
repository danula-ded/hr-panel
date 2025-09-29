<script lang="ts">
  interface Props {
    size?: "sm" | "md" | "lg";
    class?: string;
  }

  let { size = "md", class: className = "", ...restProps }: Props = $props();

  const classes = $derived(["spinner", `spinner--${size}`, className]
    .filter(Boolean)
    .join(" "));
</script>

<div class={classes} {...restProps}>
  <div class="spinner__circle"></div>
</div>

<style>
  .spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .spinner__circle {
    border: 2px solid var(--color-border);
    border-top: 2px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .spinner--sm .spinner__circle {
    width: 1rem;
    height: 1rem;
  }

  .spinner--md .spinner__circle {
    width: 1.5rem;
    height: 1.5rem;
  }

  .spinner--lg .spinner__circle {
    width: 2rem;
    height: 2rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
