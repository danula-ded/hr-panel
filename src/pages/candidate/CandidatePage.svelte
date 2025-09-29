<script lang="ts">
  import { onMount } from "svelte";
  import { candidateStore } from "../../entities/candidate/store";
  import CandidateDetail from "../../entities/candidate/CandidateDetail.svelte";
  import { Spinner } from "../../shared/ui";
  import type { Candidate } from "../../shared/types";

  interface RouteParams {
    id?: string;
  }

  let { params }: { params?: RouteParams } = $props();

  let candidateId = $state<string | undefined>(params?.id);
  let candidate = $state<Candidate | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(() => {
    loadCandidate();
  });

  async function loadCandidate() {
    loading = true;
    error = null;

    try {
      // Load candidates if not already loaded
      const currentState = candidateStore.getFilteredCandidates();
      if (currentState.length === 0) {
        await candidateStore.loadCandidates();
      }

      if (!candidateId) {
        error = "Некорректный параметр маршрута";
      } else {
        const foundCandidate = candidateStore.getCandidateById(candidateId);
        if (foundCandidate) {
          candidate = foundCandidate;
        } else {
          error = "Кандидат не найден";
        }
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Ошибка загрузки кандидата";
    } finally {
      loading = false;
    }
  }
</script>

<div class="candidate-page">
  {#if loading}
    <div class="candidate-page__loading">
      <Spinner size="lg" />
      <p>Загрузка кандидата...</p>
    </div>
  {:else if error}
    <div class="candidate-page__error">
      <h2>Ошибка</h2>
      <p>{error}</p>
    </div>
  {:else if candidate}
    <CandidateDetail {candidate} />
  {:else}
    <div class="candidate-page__not-found">
      <h2>Кандидат не найден</h2>
      <p>Кандидат с указанным ID не существует</p>
    </div>
  {/if}
</div>

<style>
  .candidate-page {
    min-height: 100vh;
    background-color: var(--color-background);
  }

  .candidate-page__loading,
  .candidate-page__error,
  .candidate-page__not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
    padding: 2rem;
  }

  .candidate-page__loading {
    gap: 1rem;
  }

  .candidate-page__error h2,
  .candidate-page__not-found h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 0.5rem 0;
  }

  .candidate-page__error p,
  .candidate-page__not-found p {
    font-size: 1rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  .candidate-page__error p {
    color: var(--color-danger);
  }
</style>
