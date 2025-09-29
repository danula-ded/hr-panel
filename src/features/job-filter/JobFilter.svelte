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

  <div class="job-filter__actions">
    <button class="job-filter__clear" onclick={clearFilters}> Очистить </button>
  </div>
</div>

<style>
  .job-filter {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
    padding: 1rem;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .job-filter__search {
    flex: 1;
    min-width: 200px;
  }

  .job-filter__grade {
    min-width: 150px;
  }

  .job-filter__actions {
    display: flex;
    align-items: center;
  }

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
    .job-filter {
      flex-direction: column;
      align-items: stretch;
    }

    .job-filter__search,
    .job-filter__grade {
      min-width: auto;
    }
  }
</style>
