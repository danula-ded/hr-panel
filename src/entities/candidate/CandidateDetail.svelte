<script lang="ts">
  import type { Candidate } from "../../shared/types";
  import { Card, Button } from "../../shared/ui";
  import { formatPhone, formatDateTime } from "../../shared/lib/utils";
  import { candidateStore } from "./store";

  interface Props {
    candidate: Candidate;
    class?: string;
  }

  let { candidate, class: className = "" }: Props = $props();

	const isInShortlist = $derived(candidateStore.isInShortlist(candidate.id));
	const phoneFormatted = $derived(formatPhone(candidate.phone));

  function handleToggleShortlist() {
    candidateStore.toggleShortlist(candidate.id);
  }

  function handleEdit() {
    window.location.href = `/edit-candidate/${candidate.id}`;
  }

  function handleBack() {
    window.history.back();
  }
</script>

<div class="candidate-detail {className}">
  <div class="candidate-detail__header">
    <Button variant="ghost" size="sm" onclick={handleBack}>← Назад</Button>

    <div class="candidate-detail__actions">
      <Button
        variant={isInShortlist ? "secondary" : "primary"}
        onclick={handleToggleShortlist}
      >
        {isInShortlist ? "Убрать из шортлиста" : "В шортлист"}
      </Button>
      <Button variant="primary" onclick={handleEdit}>Редактировать</Button>
    </div>
  </div>

  <Card class="candidate-detail__main">
    <div class="candidate-detail__info">
      <div class="candidate-detail__name">
        {candidate.firstName}
        {candidate.lastName}
      </div>
      <div class="candidate-detail__position">{candidate.position}</div>
      <div class="candidate-detail__rating">
        ⭐ Рейтинг: {candidate.rating.toFixed(1)}/5
      </div>
    </div>

    <div class="candidate-detail__contact">
      <h3>Контактная информация</h3>
      <div class="candidate-detail__contact-item">
        <strong>Email:</strong>
        {candidate.email}
      </div>
      <div class="candidate-detail__contact-item">
        <strong>Телефон:</strong>
        {phoneFormatted}
      </div>
    </div>

    <div class="candidate-detail__experience">
      <h3>Опыт работы</h3>
      <div class="candidate-detail__experience-item">
        {candidate.experience} лет опыта
      </div>
    </div>

    <div class="candidate-detail__skills">
      <h3>Навыки</h3>
      <div class="candidate-detail__skills-list">
        {#each candidate.skills as skill (skill)}
          <span class="candidate-detail__skill">{skill}</span>
        {/each}
      </div>
    </div>

    <div class="candidate-detail__stage">
      <h3>Стадия</h3>
      <span
        class="candidate-detail__stage-badge candidate-detail__stage-badge--{candidate.stage}"
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
      <div class="candidate-detail__notes">
        <h3>Заметки</h3>
        <div class="candidate-detail__notes-content">
          {candidate.notes}
        </div>
      </div>
    {/if}

    <div class="candidate-detail__meta">
      <div class="candidate-detail__meta-item">
        <strong>Создано:</strong>
        {formatDateTime(candidate.createdAt)}
      </div>
      <div class="candidate-detail__meta-item">
        <strong>Обновлено:</strong>
        {formatDateTime(candidate.updatedAt)}
      </div>
    </div>
  </Card>
</div>

<style>
  .candidate-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  .candidate-detail__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .candidate-detail__actions {
    display: flex;
    gap: 0.75rem;
  }

  .candidate-detail__main {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .candidate-detail__info {
    text-align: center;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  .candidate-detail__name {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 0.5rem;
  }

  .candidate-detail__position {
    font-size: 1.25rem;
    color: var(--color-text-muted);
    margin-bottom: 0.5rem;
  }

  .candidate-detail__rating {
    font-size: 1rem;
    color: var(--color-warning);
    font-weight: 500;
  }

  .candidate-detail__contact h3,
  .candidate-detail__experience h3,
  .candidate-detail__skills h3,
  .candidate-detail__stage h3,
  .candidate-detail__notes h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 0.75rem 0;
  }

  .candidate-detail__contact-item,
  .candidate-detail__experience-item {
    font-size: 1rem;
    color: var(--color-text);
    margin-bottom: 0.5rem;
  }

  .candidate-detail__skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .candidate-detail__skill {
    background-color: var(--color-primary);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .candidate-detail__stage-badge {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    display: inline-block;
  }

  .candidate-detail__stage-badge--applied {
    background-color: var(--color-secondary);
    color: var(--color-text);
  }

  .candidate-detail__stage-badge--screening {
    background-color: var(--color-warning-light);
    color: var(--color-warning-dark);
  }

  .candidate-detail__stage-badge--interview {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
  }

  .candidate-detail__stage-badge--technical {
    background-color: var(--color-info-light);
    color: var(--color-info-dark);
  }

  .candidate-detail__stage-badge--final {
    background-color: var(--color-success-light);
    color: var(--color-success-dark);
  }

  .candidate-detail__stage-badge--offered {
    background-color: var(--color-success);
    color: white;
  }

  .candidate-detail__stage-badge--hired {
    background-color: var(--color-success-dark);
    color: white;
  }

  .candidate-detail__stage-badge--rejected {
    background-color: var(--color-danger-light);
    color: var(--color-danger-dark);
  }

  .candidate-detail__notes-content {
    background-color: var(--color-secondary);
    padding: 1rem;
    border-radius: 6px;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--color-text);
  }

  .candidate-detail__meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
  }

  .candidate-detail__meta-item {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
</style>
