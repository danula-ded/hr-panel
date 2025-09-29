<script lang="ts">
  import { Button } from "../../shared/ui";
  import { candidateStore } from "../../entities/candidate/store";

  interface Props {
    candidateId: string;
    class?: string;
  }

  let { candidateId, class: className = "" }: Props = $props();

	const isInShortlist = $derived(candidateStore.isInShortlist(candidateId));

  function handleToggle() {
    candidateStore.toggleShortlist(candidateId);
  }

  function handleClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    handleToggle();
  }
</script>

<Button
  variant={isInShortlist ? "secondary" : "primary"}
  size="sm"
  onclick={handleClick}
  class={className}
>
  {isInShortlist ? "Убрать из шортлиста" : "В шортлист"}
</Button>
