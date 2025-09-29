<script lang="ts">
  import type { Candidate } from "../../shared/types";
  import CandidateCard from "../../entities/candidate/CandidateCard.svelte";

  interface Props {
    candidate: Candidate;
    class?: string;
    showActions?: boolean;
  }

  let {
    candidate,
    class: className = "",
    showActions = true,
  }: Props = $props();
</script>

<CandidateCard {candidate} {showActions} class={className} />
