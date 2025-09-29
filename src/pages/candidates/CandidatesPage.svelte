<script lang="ts">
  import { onMount } from "svelte";
  import { candidateStore } from "../../entities/candidate/store";
  import CandidateFilter from "../../features/candidate-filter/CandidateFilter.svelte";
  import CandidateList from "../../widgets/candidate-list/CandidateList.svelte";
  import { Button, Spinner } from "../../shared/ui";
  import type { FilterOptions, Candidate } from "../../shared/types";
  import type { CandidateState } from "../../entities/candidate/store";

  let filters: FilterOptions = $state({});
  let filteredCandidates: Candidate[] = $state([]);
  let candidateStoreState: CandidateState = $state({ candidates: [], loading: false, error: null, filters: {}, shortlist: [] });

  onMount(() => {
    candidateStore.loadCandidates();
    
    // Subscribe to candidate store changes
    const unsubscribe = candidateStore.subscribe((state) => {
      candidateStoreState = state;
      if (state.candidates.length > 0) {
        filteredCandidates = candidateStore.getFilteredCandidates();
      }
    });
    
    return () => unsubscribe();
  });

	// Update filtered candidates when filters change
	$effect(() => {
		filteredCandidates = candidateStore.getFilteredCandidates();
	});

  function handleFiltersChange(newFilters: FilterOptions) {
    filters = newFilters;
    candidateStore.setFilters(newFilters);
  }

  function handleCreateCandidate() {
    window.location.href = "/create-candidate";
  }
</script>

<div class="candidates-page">
  <div class="candidates-page__header">
    <div class="candidates-page__title">
      <h1>Кандидаты</h1>
      <p>Управление кандидатами и их стадиями</p>
    </div>

    <div class="candidates-page__actions">
      <Button variant="primary" onclick={handleCreateCandidate}>
        Добавить кандидата
      </Button>
    </div>
  </div>

  <CandidateFilter {filters} onFiltersChange={handleFiltersChange} />

  {#if candidateStoreState.loading}
    <div class="candidates-page__loading">
      <Spinner size="lg" />
      <p>Загрузка кандидатов...</p>
    </div>
  {:else if candidateStoreState.error}
    <div class="candidates-page__error">
      <p>Ошибка загрузки: {candidateStoreState.error}</p>
    </div>
  {:else if filteredCandidates.length === 0}
    <div class="candidates-page__empty">
      <p>Кандидаты не найдены</p>
    </div>
  {:else}
    <CandidateList candidates={filteredCandidates} />
  {/if}
</div>

<style>
  .candidates-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .candidates-page__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    gap: 1rem;
  }

  .candidates-page__title h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 0.5rem 0;
  }

  .candidates-page__title p {
    font-size: 1.125rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  .candidates-page__actions {
    display: flex;
    align-items: center;
  }

  .candidates-page__loading,
  .candidates-page__error,
  .candidates-page__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
  }

  .candidates-page__loading {
    gap: 1rem;
  }

  .candidates-page__error p {
    color: var(--color-danger);
    font-size: 1.125rem;
  }

  .candidates-page__empty p {
    color: var(--color-text-muted);
    font-size: 1.125rem;
  }

  @media (max-width: 768px) {
    .candidates-page__header {
      flex-direction: column;
      align-items: stretch;
    }

    .candidates-page__actions {
      justify-content: center;
    }
  }
</style>
