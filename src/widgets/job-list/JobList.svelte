<script lang="ts">
  import type { Job } from "../../shared/types";
  import JobCard from "../../entities/job/JobCard.svelte";

  interface Props {
    jobs: Job[];
    class?: string;
  }

  let { jobs, class: className = "" }: Props = $props();
</script>

<div class="job-list {className}">
  {#each jobs as job (job.id)}
    <JobCard {job} />
  {/each}
</div>

<style>
  .job-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .job-list {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
