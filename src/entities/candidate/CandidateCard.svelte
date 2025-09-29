<script lang="ts">
  import type { Candidate } from "../../shared/types";
  import { Card, Button } from "../../shared/ui";
  import { formatPhone, truncateText } from "../../shared/lib/utils";
  import { candidateStore } from "./store";

  interface Props {
    candidate: Candidate;
    class?: string;
    showActions?: boolean;
  }

  let {
    candidate,
    class: className = "",
    showActions = true,
  }: Props = $props();

	const isInShortlist = $derived(candidateStore.isInShortlist(candidate.id));
	const phoneFormatted = $derived(formatPhone(candidate.phone));
	const shortDescription = $derived(truncateText(candidate.notes, 100));

  function handleToggleShortlist() {
    candidateStore.toggleShortlist(candidate.id);
  }

  function handleEdit() {
    // This will be handled by the parent component
    window.location.href = `/edit-candidate/${candidate.id}`;
  }

  function handleView() {
    window.location.href = `/candidate/${candidate.id}`;
  }
</script>

<Card class="candidate-card {className}" clickable onclick={handleView}>
  <div class="candidate-card__header">
    <div class="candidate-card__name">
      {candidate.firstName}
      {candidate.lastName}
    </div>
    <div class="candidate-card__rating">
      ⭐ {candidate.rating.toFixed(1)}
    </div>
  </div>

  <div class="candidate-card__position">{candidate.position}</div>
  <div class="candidate-card__experience">{candidate.experience} лет опыта</div>

  <div class="candidate-card__contact">
    <div class="candidate-card__email">{candidate.email}</div>
    <div class="candidate-card__phone">{phoneFormatted}</div>
  </div>

  <div class="candidate-card__skills">
    {#each candidate.skills.slice(0, 4) as skill (skill)}
      <span class="candidate-card__skill">{skill}</span>
    {/each}
    {#if candidate.skills.length > 4}
      <span class="candidate-card__skill candidate-card__skill--more">
        +{candidate.skills.length - 4}
      </span>
    {/if}
  </div>

  <div class="candidate-card__stage">
    <span
      class="candidate-card__stage-badge candidate-card__stage-badge--{candidate.stage}"
    >
      {candidate.stage === "applied"
        ? "Подал заявку"
        : candidate.stage === "screening"
          ? "Скрининг"
          : candidate.stage === "interview"
            ? "Собеседование"
            : candidate.stage === "technical"
              ? "Техническое"
              : candidate.stage === "final"
                ? "Финальное"
                : candidate.stage === "offered"
                  ? "Предложение"
                  : candidate.stage === "hired"
                    ? "Принят"
                    : "Отклонен"}
    </span>
  </div>

  {#if candidate.notes}
    <div class="candidate-card__notes">
      {shortDescription}
    </div>
  {/if}

  {#if showActions}
    <div class="candidate-card__actions" role="group">
      <Button
        variant={isInShortlist ? "secondary" : "primary"}
        size="sm"
        onclick={handleToggleShortlist}
      >
        {isInShortlist ? "Убрать из шортлиста" : "В шортлист"}
      </Button>
      <Button variant="ghost" size="sm" onclick={handleEdit}>
        Редактировать
      </Button>
    </div>
  {/if}
</Card>

<style>
  .candidate-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
  }

  .candidate-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .candidate-card__name {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .candidate-card__rating {
    font-size: 0.875rem;
    color: var(--color-warning);
    font-weight: 500;
  }

  .candidate-card__position {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .candidate-card__experience {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .candidate-card__contact {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .candidate-card__email {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .candidate-card__phone {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .candidate-card__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .candidate-card__skill {
    background-color: var(--color-secondary);
    color: var(--color-text);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .candidate-card__skill--more {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
  }

  .candidate-card__stage {
    display: flex;
    justify-content: flex-start;
  }

  .candidate-card__stage-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
  }

  .candidate-card__stage-badge--applied {
    background-color: var(--color-secondary);
    color: var(--color-text);
  }

  .candidate-card__stage-badge--screening {
    background-color: var(--color-warning-light);
    color: var(--color-warning-dark);
  }

  .candidate-card__stage-badge--interview {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
  }

  .candidate-card__stage-badge--technical {
    background-color: var(--color-info-light);
    color: var(--color-info-dark);
  }

  .candidate-card__stage-badge--final {
    background-color: var(--color-success-light);
    color: var(--color-success-dark);
  }

  .candidate-card__stage-badge--offered {
    background-color: var(--color-success);
    color: white;
  }

  .candidate-card__stage-badge--hired {
    background-color: var(--color-success-dark);
    color: white;
  }

  .candidate-card__stage-badge--rejected {
    background-color: var(--color-danger-light);
    color: var(--color-danger-dark);
  }

  .candidate-card__notes {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    line-height: 1.4;
    flex: 1;
  }

  .candidate-card__actions {
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
  }
</style>
