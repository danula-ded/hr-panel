<script lang="ts">
  import { onMount } from "svelte";
  import { candidateStore } from "../../entities/candidate/store";
  import CandidateList from "../../widgets/candidate-list/CandidateList.svelte";
  import { Card, Spinner, Button } from "../../shared/ui";
  import type { Candidate } from "../../shared/types";

  let loading = $state(true);
  let candidates: Candidate[] = $state([]);

  onMount(async () => {
    const list = candidateStore.getFilteredCandidates();
    if (list.length === 0) {
      await candidateStore.loadCandidates();
    }
    candidates = candidateStore.getShortlistedCandidates();
    loading = false;
  });

  function clearShortlist() {
    // toggle off all currently shortlisted
    candidates.forEach((c) => candidateStore.toggleShortlist(c.id));
    candidates = candidateStore.getShortlistedCandidates();
  }
</script>

<div class="shortlist-page">
  <div class="shortlist-page__header">
    <h1>Шортлист</h1>
    <p>Все избранные кандидаты и по вакансиям</p>
  </div>

  <section>
    <Card>
      <div class="shortlist-page__actions">
        <Button variant="secondary" size="sm" onclick={clearShortlist}>Очистить шортлист</Button>
      </div>
      {#if loading}
        <div class="shortlist-page__loading">
          <Spinner size="lg" />
          <p>Загрузка...</p>
        </div>
      {:else if candidates.length === 0}
        <div class="shortlist-page__empty">Пока никого нет в шортлисте</div>
      {:else}
        <CandidateList {candidates} />
      {/if}
    </Card>
  </section>
</div>

<style>
  .shortlist-page { max-width: 1200px; margin: 0 auto; padding: 1rem; }
  .shortlist-page__header { margin-bottom: 1rem; }
  .shortlist-page__actions { display:flex; justify-content:flex-end; margin-bottom: 1rem; }
  .shortlist-page__loading { display:flex; gap: 0.5rem; align-items:center; }
  .shortlist-page__empty { color: var(--color-text-muted); }
</style>


