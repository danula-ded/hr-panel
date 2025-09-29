<script lang="ts">
  import type { Job } from "../../shared/types";
  import { Card } from "../../shared/ui";
  import { goto } from "$app/navigation";
  import { formatSalary } from "../../shared/lib/utils";

  interface Props {
    job: Job;
    class?: string;
  }

  let { job, class: className = "" }: Props = $props();

  const salaryText = $derived(
    formatSalary(job.salary.min, job.salary.max, job.salary.currency),
  );
  function handleOpen() {
    goto(`/jobs/${job.id}`);
  }
</script>

<Card class="job-card {className}" clickable onclick={handleOpen}>
  <div class="job-card__header">
    <h3 class="job-card__title">{job.title}</h3>
    <span class="job-card__grade">{job.grade}</span>
  </div>

  <div class="job-card__company">{job.company}</div>
  <div class="job-card__location">{job.location}</div>

  <div class="job-card__salary">{salaryText}</div>

  <div class="job-card__description">
    {job.description}
  </div>

  <div class="job-card__requirements">
    <h4>Требования:</h4>
    <ul>
      {#each job.requirements.slice(0, 3) as requirement (requirement)}
        <li>{requirement}</li>
      {/each}
      {#if job.requirements.length > 3}
        <li>И еще {job.requirements.length - 3} требований...</li>
      {/if}
    </ul>
  </div>

  <div class="job-card__status">
    <span class="job-card__status-badge job-card__status-badge--{job.status}">
      {job.status === "active"
        ? "Активна"
        : job.status === "paused"
          ? "Приостановлена"
          : "Закрыта"}
    </span>
  </div>
</Card>

<style>
  .job-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
  }

  .job-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .job-card__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
    flex: 1;
  }

  .job-card__grade {
    background-color: var(--color-primary);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .job-card__company {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .job-card__location {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .job-card__salary {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-success);
  }

  .job-card__description {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    line-height: 1.5;
    flex: 1;
  }

  .job-card__requirements {
    font-size: 0.875rem;
  }

  .job-card__requirements h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 0.5rem 0;
  }

  .job-card__requirements ul {
    margin: 0;
    padding-left: 1rem;
    color: var(--color-text-muted);
  }

  .job-card__requirements li {
    margin-bottom: 0.25rem;
  }

  .job-card__status {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
  }

  .job-card__status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
  }

  .job-card__status-badge--active {
    background-color: var(--color-success-light);
    color: var(--color-success-dark);
  }

  .job-card__status-badge--paused {
    background-color: var(--color-warning-light);
    color: var(--color-warning-dark);
  }

  .job-card__status-badge--closed {
    background-color: var(--color-danger-light);
    color: var(--color-danger-dark);
  }
</style>
