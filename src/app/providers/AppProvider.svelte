<script lang="ts">
  import { onMount } from "svelte";
  import { jobStore } from "../../entities/job/store";
  import { candidateStore } from "../../entities/candidate/store";

  interface Props {
    children: any;
  }

  let { children }: Props = $props();

  onMount(() => {
    // Initialize stores
    jobStore.loadJobs();
    candidateStore.loadCandidates();
  });
</script>

{@render children()}
