<script lang="ts">
  import { Input, Select, Button, Card } from "../../shared/ui";
  import type { Job, JobGrade } from "../../shared/types";
  import { jobGrades } from "../../shared/config/data";
  import { jobStore } from "../../entities/job/store";
  import { goto } from "$app/navigation";

  let title = $state("Создать вакансию");

  let form = $state({
    title: "",
    company: "",
    location: "",
    grade: "junior" as JobGrade,
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
  });
  let errors = $state<Record<string, string>>({});
  let submitting = $state(false);

  function validate() {
    errors = {};
    if (!form.title.trim()) errors.title = "Название обязательно";
    if (!form.company.trim()) errors.company = "Компания обязательна";
    if (!form.location.trim()) errors.location = "Локация обязательна";
    const min = parseInt(form.salaryMin || "0");
    const max = parseInt(form.salaryMax || "0");
    if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0 || min > max) {
      errors.salary = "Укажите корректный диапазон зарплаты";
    }
    return Object.keys(errors).length === 0;
  }

  function onSubmit(event: Event) {
    event.preventDefault();
    if (!validate()) return;
    submitting = true;

    const min = parseInt(form.salaryMin);
    const max = parseInt(form.salaryMax);

    const jobData: Omit<Job, "id" | "createdAt" | "updatedAt"> = {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      grade: form.grade,
      salary: { min, max, currency: "RUB" },
      description: form.description.trim(),
      requirements: form.requirements
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: [],
      status: "active",
    } as unknown as Omit<Job, "id" | "createdAt" | "updatedAt">;

    const newJob = jobStore.addJob(jobData);
    goto(`/jobs/${newJob.id}`);
  }
</script>

<div class="create-job">
  <div class="create-job__header">
    <h1>{title}</h1>
    <p>Заполните информацию о вакансии</p>
  </div>

  <Card>
    <form class="create-job__form" onsubmit={onSubmit}>
      <div class="create-job__grid">
        <Input label="Название" bind:value={form.title} error={errors.title} required />
        <Input label="Компания" bind:value={form.company} error={errors.company} required />
        <Input label="Локация" bind:value={form.location} error={errors.location} required />
        <Select label="Грейд" options={jobGrades} bind:value={form.grade} />
        <Input type="number" label="Зарплата мин" bind:value={form.salaryMin} />
        <Input type="number" label="Зарплата макс" bind:value={form.salaryMax} />
        <Input label="Требования (через запятую)" bind:value={form.requirements} />
        <Input label="Описание" bind:value={form.description} />
      </div>

      {#if errors.salary}
        <div class="create-job__error">{errors.salary}</div>
      {/if}

      <div class="create-job__actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Создание..." : "Создать"}
        </Button>
      </div>
    </form>
  </Card>
  </div>

<style>
  .create-job { max-width: 800px; margin: 0 auto; padding: 1rem; }
  .create-job__header { text-align: center; margin-bottom: 1rem; }
  .create-job__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }
  .create-job__actions { display: flex; justify-content: flex-end; margin-top: 1rem; }
  .create-job__error { color: var(--color-danger); margin-top: 0.5rem; }
</style>


