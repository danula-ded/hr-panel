<script lang="ts">
  import { candidateStore } from "../../entities/candidate/store";
  import CandidateForm from "../../features/candidate-form/CandidateForm.svelte";
  import type { Candidate } from "../../shared/types";

  function handleSubmit(
    candidateData: Omit<Candidate, "id" | "createdAt" | "updatedAt">,
  ) {
    const newCandidate = candidateStore.addCandidate(candidateData);

    // Redirect to the new candidate's page
    window.location.href = `/candidate/${newCandidate.id}`;
  }

  function handleCancel() {
    window.history.back();
  }
</script>

<div class="create-candidate-page">
  <div class="create-candidate-page__header">
    <h1>Добавить кандидата</h1>
    <p>Заполните информацию о новом кандидате</p>
  </div>

  <CandidateForm onSubmit={handleSubmit} onCancel={handleCancel} />
</div>

<style>
  .create-candidate-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  .create-candidate-page__header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .create-candidate-page__header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 0.5rem 0;
  }

  .create-candidate-page__header p {
    font-size: 1rem;
    color: var(--color-text-muted);
    margin: 0;
  }
</style>
