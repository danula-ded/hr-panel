<script lang="ts">
  import { Input, Select } from "../../shared/ui";
  import { jobGrades } from "../../shared/config/data";
  import type { FilterOptions, JobGrade } from "../../shared/types";
  import { debounce } from "../../shared/lib/utils";

  interface Props {
    filters: FilterOptions;
    onFiltersChange: (filters: FilterOptions) => void;
    class?: string;
  }

  let { filters, onFiltersChange, class: className = "" }: Props = $props();

  let searchValue = $state(filters.search || "");
  let gradeValue = $state(filters.grade || "");
  let salaryMin = $state(filters.salary?.min?.toString() || "");
  let salaryMax = $state(filters.salary?.max?.toString() || "");
  let skillsText = $state((filters.skills || []).join(", "));

  // Debounced search to avoid too many updates
  const debouncedSearch = debounce((...args: unknown[]) => {
    const value = args[0] as string;
    onFiltersChange({ ...filters, search: value || undefined });
  }, 300);

  function handleSearchChange() {
    debouncedSearch(searchValue);
  }

  function handleGradeChange() {
    onFiltersChange({
      ...filters,
      grade: (gradeValue as JobGrade) || undefined,
    });
  }

  function handleSalaryChange() {
    const s = {
      min: salaryMin ? parseInt(salaryMin.toString()) : undefined,
      max: salaryMax ? parseInt(salaryMax.toString()) : undefined,
    };
    if (s.min === undefined && s.max === undefined) {
      onFiltersChange({ ...filters, salary: undefined });
      return;
    }
    onFiltersChange({ ...filters, salary: s as { min: number; max: number } });
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
    gradeValue = "";
    onFiltersChange({});
  }
</script>

<div class="job-filter {className}">
  <div class="job-filter__search">
    <Input
      type="text"
      placeholder="Поиск по вакансиям..."
      bind:value={searchValue}
      oninput={handleSearchChange}
    />
  </div>

  <div class="job-filter__grade">
    <Select
      options={jobGrades}
      bind:value={gradeValue}
      placeholder="Все грейды"
      onchange={handleGradeChange}
    />
  </div>

  <div class="job-filter__salary">
    <div class="job-filter__row">
      <Input
        type="number"
        placeholder="Мин. зп"
        bind:value={salaryMin}
        oninput={handleSalaryChange}
      />
      <span class="job-filter__sep">-</span>
      <Input
        type="number"
        placeholder="Макс. зп"
        bind:value={salaryMax}
        oninput={handleSalaryChange}
      />
    </div>
  </div>

  <div class="job-filter__skills">
    <Input
      type="text"
      placeholder="Навыки (через запятую)"
      bind:value={skillsText}
      oninput={handleSkillsChange}
    />
  </div>

  <div class="job-filter__actions">
    <button class="job-filter__clear" onclick={clearFilters}> Очистить </button>
  </div>
</div>

<style>
  .job-filter {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
    padding: 1rem;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 8px;
  }

  .job-filter__search { min-width: 200px; }

  .job-filter__grade {
    min-width: 150px;
  }

  .job-filter__row { display: flex; align-items: center; gap: 0.5rem; }
  .job-filter__actions { display: flex; align-items: center; justify-content: center; }

  .job-filter__clear {
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  .job-filter__clear:hover {
    background-color: var(--color-secondary);
    color: var(--color-text);
  }

  @media (max-width: 768px) {
    .job-filter__search,
    .job-filter__grade { min-width: auto; }
  }
</style>
