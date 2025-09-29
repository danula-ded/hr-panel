<script lang="ts">
  import type { Candidate } from "../../shared/types";
  import CandidateCard from "../../entities/candidate/CandidateCard.svelte";

  interface Props {
    candidates: Candidate[];
    class?: string;
  }

  let { candidates, class: className = "" }: Props = $props();
</script>

<div class="candidate-list {className}">
  {#each candidates as candidate (candidate.id)}
    <CandidateCard {candidate} />
  {/each}
</div>

<style>
  .candidate-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .candidate-list {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
