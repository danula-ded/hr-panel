<script lang="ts">
  import { onMount } from "svelte";
  import { jobStore } from "../../entities/job/store";
  import JobFilter from "../../features/job-filter/JobFilter.svelte";
  import JobList from "../../widgets/job-list/JobList.svelte";
  import { Spinner } from "../../shared/ui";
  import type { FilterOptions, Job } from "../../shared/types";
  import type { JobState } from "../../entities/job/store";

  let filters: FilterOptions = $state({});
  let filteredJobs: Job[] = $state([]);
  let jobStoreState: JobState = $state({ jobs: [], loading: false, error: null, filters: {} });

  onMount(() => {
    jobStore.loadJobs();
    
    // Subscribe to job store changes
    const unsubscribe = jobStore.subscribe((state) => {
      jobStoreState = state;
      if (state.jobs.length > 0) {
        filteredJobs = jobStore.getFilteredJobs();
      }
    });
    
    return () => unsubscribe();
  });

	// Update filtered jobs when filters change
	$effect(() => {
		filteredJobs = jobStore.getFilteredJobs();
	});

  function handleFiltersChange(newFilters: FilterOptions) {
    filters = newFilters;
    jobStore.setFilters(newFilters);
  }
</script>

<div class="jobs-page">
  <div class="jobs-page__header">
    <h1>Вакансии</h1>
    <p>Управление вакансиями и поиск кандидатов</p>
  </div>

  <JobFilter {filters} onFiltersChange={handleFiltersChange} />

  {#if jobStoreState.loading}
    <div class="jobs-page__loading">
      <Spinner size="lg" />
      <p>Загрузка вакансий...</p>
    </div>
  {:else if jobStoreState.error}
    <div class="jobs-page__error">
      <p>Ошибка загрузки: {jobStoreState.error}</p>
    </div>
  {:else if filteredJobs.length === 0}
    <div class="jobs-page__empty">
      <p>Вакансии не найдены</p>
    </div>
  {:else}
    <JobList jobs={filteredJobs} />
  {/if}
</div>

<style>
  .jobs-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .jobs-page__header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .jobs-page__header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 0.5rem 0;
  }

  .jobs-page__header p {
    font-size: 1.125rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  .jobs-page__loading,
  .jobs-page__error,
  .jobs-page__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
  }

  .jobs-page__loading {
    gap: 1rem;
  }

  .jobs-page__error p {
    color: var(--color-danger);
    font-size: 1.125rem;
  }

  .jobs-page__empty p {
    color: var(--color-text-muted);
    font-size: 1.125rem;
  }
</style>
