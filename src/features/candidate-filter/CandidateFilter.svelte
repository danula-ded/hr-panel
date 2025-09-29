<script lang="ts">
  import { Input, Select } from "../../shared/ui";
  import { candidateStages } from "../../shared/config/data";
  import type { FilterOptions, CandidateStage } from "../../shared/types";
  import { debounce } from "../../shared/lib/utils";

  interface Props {
    filters: FilterOptions;
    onFiltersChange: (filters: FilterOptions) => void;
    class?: string;
  }

  let { filters, onFiltersChange, class: className = "" }: Props = $props();

  let searchValue = $state(filters.search || "");
  let stageValue = $state(filters.stage || "");
  let experienceMin = $state(filters.experience?.min?.toString() || "");
  let experienceMax = $state(filters.experience?.max?.toString() || "");
  let skillsText = $state((filters.skills || []).join(", "));

  // Debounced search to avoid too many updates
  const debouncedSearch = debounce((...args: unknown[]) => {
    const value = args[0] as string;
    onFiltersChange({ ...filters, search: value || undefined });
  }, 300);

  function handleSearchChange() {
    debouncedSearch(searchValue);
  }

  function handleStageChange() {
    onFiltersChange({
      ...filters,
      stage: (stageValue as CandidateStage) || undefined,
    });
  }

  function handleExperienceChange() {
    const experience = {
      min: experienceMin ? parseInt(experienceMin.toString()) : undefined,
      max: experienceMax ? parseInt(experienceMax.toString()) : undefined,
    };

    // Only set experience filter if both values are provided and valid
    if (
      experience.min !== undefined &&
      experience.max !== undefined &&
      experience.min <= experience.max
    ) {
      onFiltersChange({
        ...filters,
        experience: experience as { min: number; max: number },
      });
    } else if (!experienceMin && !experienceMax) {
      onFiltersChange({
        ...filters,
        experience: undefined,
      });
    }
  }

  function handleSkillsChange() {
    const list = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onFiltersChange({ ...filters, skills: list.length ? list : undefined });
  }

  function clearFilters() {
    searchValue = "";
    stageValue = "";
    experienceMin = "";
    experienceMax = "";
    onFiltersChange({});
  }
</script>

<div class="candidate-filter {className}">
  <div class="candidate-filter__search">
    <Input
      type="text"
      placeholder="Поиск по кандидатам..."
      bind:value={searchValue}
      oninput={handleSearchChange}
    />
  </div>

  <div class="candidate-filter__stage">
    <Select
      options={candidateStages}
      bind:value={stageValue}
      placeholder="Все стадии"
      onchange={handleStageChange}
    />
  </div>

  <div class="candidate-filter__experience">
    <div class="candidate-filter__row">
      <Input
        type="number"
        placeholder="Мин. опыт"
        bind:value={experienceMin}
        oninput={handleExperienceChange}
        class="candidate-filter__experience-input"
      />
      <span class="candidate-filter__experience-separator">-</span>
      <Input
        type="number"
        placeholder="Макс. опыт"
        bind:value={experienceMax}
        oninput={handleExperienceChange}
        class="candidate-filter__experience-input"
      />
    </div>
  </div>

  <div class="candidate-filter__skills">
    <Input
      type="text"
      placeholder="Навыки (через запятую)"
      bind:value={skillsText}
      oninput={handleSkillsChange}
    />
  </div>

  <div class="candidate-filter__actions">
    <button class="candidate-filter__clear" onclick={clearFilters}>
      Очистить
    </button>
  </div>
</div>

<style>
  .candidate-filter {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
    padding: 1rem;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 8px;
  }

  .candidate-filter__search {
    flex: 1;
    min-width: 200px;
  }

  .candidate-filter__stage {
    min-width: 150px;
  }

  .candidate-filter__experience {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 200px;
    width: 100%;
    box-sizing: border-box;
  }

  .candidate-filter__row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
  }

  .candidate-filter__experience-input {
    flex: 1 1 0;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
  }

  .candidate-filter__experience-separator {
    color: var(--color-text-muted);
    font-weight: 500;
    align-self: center;
    flex: 0 0 auto;
    padding: 0 0.25rem;
    user-select: none;
  }
  
  .candidate-filter__actions { display: flex; align-items: center; justify-content: center; }

  .candidate-filter__clear {
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  .candidate-filter__clear:hover {
    background-color: var(--color-secondary);
    color: var(--color-text);
  }

  @media (max-width: 1024px) {
    .candidate-filter__experience { min-width: 150px; }
  }

  @media (max-width: 768px) {
    .candidate-filter__search,
    .candidate-filter__stage,
    .candidate-filter__experience { min-width: auto; }
    .candidate-filter__row {
      flex-wrap: wrap;
    }
    .candidate-filter__experience-input {
      min-width: 0;
      flex-basis: 100px;
    }
  }
</style>
