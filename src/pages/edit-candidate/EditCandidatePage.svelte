<script lang="ts">
  import { onMount } from "svelte";
  import { candidateStore } from "../../entities/candidate/store";
  import CandidateForm from "../../features/candidate-form/CandidateForm.svelte";
  import { Spinner } from "../../shared/ui";
  import type { Candidate } from "../../shared/types";

  let { params }: { params: { id: string } } = $props();
  let candidateId = $state<string | undefined>(params.id);
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

  function handleSubmit(
    candidateData: Omit<Candidate, "id" | "createdAt" | "updatedAt">,
  ) {
    if (candidate) {
      candidateStore.updateCandidate(candidate.id, candidateData);

      import("$app/navigation").then(({ goto }) => goto(`/candidate/${candidate.id}`));
    }
  }

  function handleCancel() {
    if (candidate) {
      import("$app/navigation").then(({ goto }) => goto(`/candidate/${candidate.id}`));
    } else {
      window.history.back();
    }
  }
</script>

<div class="edit-candidate-page">
  {#if loading}
    <div class="edit-candidate-page__loading">
      <Spinner size="lg" />
      <p>Загрузка кандидата...</p>
    </div>
  {:else if error}
    <div class="edit-candidate-page__error">
      <h2>Ошибка</h2>
      <p>{error}</p>
    </div>
  {:else if candidate}
    <div class="edit-candidate-page__header">
      <h1>Редактировать кандидата</h1>
      <p>Измените информацию о кандидате</p>
    </div>

    <CandidateForm
      {candidate}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  {:else}
    <div class="edit-candidate-page__not-found">
      <h2>Кандидат не найден</h2>
      <p>Кандидат с указанным ID не существует</p>
    </div>
  {/if}
</div>

<style>
  .edit-candidate-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  .edit-candidate-page__header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .edit-candidate-page__header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 0.5rem 0;
  }

  .edit-candidate-page__header p {
    font-size: 1rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  .edit-candidate-page__loading,
  .edit-candidate-page__error,
  .edit-candidate-page__not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
    padding: 2rem;
  }

  .edit-candidate-page__loading {
    gap: 1rem;
  }

  .edit-candidate-page__error h2,
  .edit-candidate-page__not-found h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 0.5rem 0;
  }

  .edit-candidate-page__error p,
  .edit-candidate-page__not-found p {
    font-size: 1rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  .edit-candidate-page__error p {
    color: var(--color-danger);
  }
</style>
