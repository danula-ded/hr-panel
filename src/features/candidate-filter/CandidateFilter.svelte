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
    <Input
      type="number"
      placeholder="Мин. опыт"
      bind:value={experienceMin}
      oninput={handleExperienceChange}
    />
    <span class="candidate-filter__experience-separator">-</span>
    <Input
      type="number"
      placeholder="Макс. опыт"
      bind:value={experienceMax}
      oninput={handleExperienceChange}
    />
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
    gap: 1rem;
    align-items: flex-end;
    padding: 1rem;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    margin-bottom: 1.5rem;
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
  }

  /* width of number inputs is defined inside the input itself; keep CSS minimal */

  .candidate-filter__experience-separator {
    color: var(--color-text-muted);
    font-weight: 500;
  }

  .candidate-filter__actions {
    display: flex;
    align-items: center;
  }

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
    .candidate-filter {
      flex-wrap: wrap;
    }

    .candidate-filter__experience {
      min-width: 150px;
    }
  }

  @media (max-width: 768px) {
    .candidate-filter {
      flex-direction: column;
      align-items: stretch;
    }

    .candidate-filter__search,
    .candidate-filter__stage,
    .candidate-filter__experience {
      min-width: auto;
    }
  }
</style>
