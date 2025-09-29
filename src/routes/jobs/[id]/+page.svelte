<script lang="ts">
  import { onMount } from "svelte";
  import { jobStore } from "../../../entities/job/store";
  import { candidateStore } from "../../../entities/candidate/store";
  import CandidateList from "../../../widgets/candidate-list/CandidateList.svelte";
  import CandidateFilter from "../../../features/candidate-filter/CandidateFilter.svelte";
  import { Spinner, Card, Button } from "../../../shared/ui";
  import type { Job, Candidate, FilterOptions } from "../../../shared/types";

  let { params }: { params: { id: string } } = $props();

  let job: Job | undefined = $state(undefined);
  let loading = $state(true);
  let error: string | null = $state(null);
  let filters: FilterOptions = $state({ jobId: params.id });
  let filteredCandidates: Candidate[] = $state([]);

  onMount(async () => {
    try {
      const jobs = jobStore.getFilteredJobs();
      if (jobs.length === 0) await jobStore.loadJobs();
      job = jobStore.getJobById(params.id);
      if (!job) throw new Error("Вакансия не найдена");

      const cands = candidateStore.getFilteredCandidates();
      if (cands.length === 0) await candidateStore.loadCandidates();
      candidateStore.setFilters({ ...(filters || {}), jobId: params.id });
      filteredCandidates = candidateStore.getFilteredCandidates();
    } catch (e) {
      error = e instanceof Error ? e.message : "Ошибка загрузки";
    } finally {
      loading = false;
    }
  });

  function handleFiltersChange(newFilters: FilterOptions) {
    filters = { ...newFilters, jobId: params.id };
    candidateStore.setFilters(filters);
    filteredCandidates = candidateStore.getFilteredCandidates();
  }
</script>

<div class="job-detail-page">
  {#if loading}
    <div class="job-detail-page__loading">
      <Spinner size="lg" />
      <p>Загрузка вакансии...</p>
    </div>
  {:else if error}
    <div class="job-detail-page__error">
      <h2>Ошибка</h2>
      <p>{error}</p>
    </div>
  {:else if job}
    <div class="job-detail-page__layout">
      <aside class="job-detail-page__filters">
        <Card>
          <h3>Фильтры кандидатов</h3>
          <CandidateFilter filters={filters} onFiltersChange={handleFiltersChange} />
        </Card>
      </aside>

      <section class="job-detail-page__content">
        <Card class="job-detail-page__job">
          <h2>{job.title}</h2>
          <p>{job.company} — {job.location}</p>
        </Card>

        {#if filteredCandidates.length === 0}
          <div class="job-detail-page__empty">
            <p>Кандидаты не найдены</p>
          </div>
        {:else}
          <CandidateList candidates={filteredCandidates} />
        {/if}
      </section>
    </div>
  {/if}
</div>

<style>
  .job-detail-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  .job-detail-page__layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 1rem;
  }
  .job-detail-page__filters { position: sticky; top: 5rem; height: fit-content; }
  .job-detail-page__job { margin-bottom: 1rem; }
  .job-detail-page__loading, .job-detail-page__error, .job-detail-page__empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem; }

  @media (max-width: 900px) {
    .job-detail-page__layout { grid-template-columns: 1fr; }
  }
</style>


