<script lang="ts">
  import { Input, Select, Button } from "../../shared/ui";
  import { candidateStages } from "../../shared/config/data";
  import type { Candidate } from "../../shared/types";
  import {
    validateEmail,
    validatePhone,
    generateId,
  } from "../../shared/lib/utils";

  interface Props {
    candidate?: Partial<Candidate>;
    onSubmit: (
      candidate: Omit<Candidate, "id" | "createdAt" | "updatedAt">,
    ) => void;
    onCancel: () => void;
    class?: string;
  }

  let {
    candidate = {},
    onSubmit,
    onCancel,
    class: className = "",
  }: Props = $props();

  // Form state
  let firstName = $state(candidate.firstName || "");
  let lastName = $state(candidate.lastName || "");
  let email = $state(candidate.email || "");
  let phone = $state(candidate.phone || "");
  let position = $state(candidate.position || "");
  let experience = $state(candidate.experience?.toString() || "0");
  let skills = $state(candidate.skills?.join(", ") || "");
  let stage = $state(candidate.stage || "applied");
  let rating = $state(candidate.rating?.toString() || "0");
  let notes = $state(candidate.notes || "");

  // Validation errors
  let errors = $state<Record<string, string>>({});
  let isSubmitting = $state(false);

  function validateForm(): boolean {
    errors = {};

    if (!firstName.trim()) {
      errors.firstName = "Имя обязательно";
    }

    if (!lastName.trim()) {
      errors.lastName = "Фамилия обязательна";
    }

    if (!email.trim()) {
      errors.email = "Email обязателен";
    } else if (!validateEmail(email)) {
      errors.email = "Некорректный email";
    }

    if (!phone.trim()) {
      errors.phone = "Телефон обязателен";
    } else if (!validatePhone(phone)) {
      errors.phone = "Некорректный формат телефона (+7 (999) 123-45-67)";
    }

    if (!position.trim()) {
      errors.position = "Позиция обязательна";
    }

    if (parseInt(experience) < 0) {
      errors.experience = "Опыт не может быть отрицательным";
    }

    if (parseInt(rating) < 0 || parseInt(rating) > 5) {
      errors.rating = "Рейтинг должен быть от 0 до 5";
    }

    return Object.keys(errors).length === 0;
  }

function handleSubmit(event: Event) {
  event.preventDefault();
    if (!validateForm()) {
      return;
    }

    isSubmitting = true;

    const skillsArray = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    const candidateData: Omit<Candidate, "id" | "createdAt" | "updatedAt"> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      position: position.trim(),
      experience: parseInt(experience),
      skills: skillsArray,
      stage: stage as Candidate["stage"],
      rating: parseInt(rating),
      notes: notes.trim(),
      jobId: candidate.jobId,
    };

    onSubmit(candidateData);
  }

  function handlePhoneInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const digits = target.value.replace(/\D/g, "");
    // Build masked string progressively to allow typing
    let value = digits;
    if (value.startsWith("8")) value = "7" + value.slice(1);
    if (!value.startsWith("7")) value = "7" + value; // ensure country
    // +7 (XXX) XXX-XX-XX
    let out = "+7";
    if (value.length > 1) out += " (" + value.slice(1, Math.min(4, value.length)) ;
    if (value.length >= 4) out += ") ";
    if (value.length >= 4) out += value.slice(4, Math.min(7, value.length));
    if (value.length >= 7) out += "-" + value.slice(7, Math.min(9, value.length));
    if (value.length >= 9) out += "-" + value.slice(9, Math.min(11, value.length));
    phone = out;
  }
</script>

<form class="candidate-form {className}" onsubmit={handleSubmit}>
  <div class="candidate-form__grid">
    <div class="candidate-form__field">
      <Input
        label="Имя"
        placeholder="Введите имя"
        bind:value={firstName}
        error={errors.firstName}
        required
      />
    </div>

    <div class="candidate-form__field">
      <Input
        label="Фамилия"
        placeholder="Введите фамилию"
        bind:value={lastName}
        error={errors.lastName}
        required
      />
    </div>

    <div class="candidate-form__field">
      <Input
        type="email"
        label="Email"
        placeholder="example@email.com"
        bind:value={email}
        error={errors.email}
        required
      />
    </div>

    <div class="candidate-form__field">
      <Input
        type="tel"
        label="Телефон"
        placeholder="+7 (999) 123-45-67"
				bind:value={phone}
				oninput={handlePhoneInput}
        error={errors.phone}
        required
      />
    </div>

    <div class="candidate-form__field">
      <Input
        label="Позиция"
        placeholder="Frontend Developer"
        bind:value={position}
        error={errors.position}
        required
      />
    </div>

    <div class="candidate-form__field">
      <Input
        type="number"
        label="Опыт работы (лет)"
        placeholder="0"
        bind:value={experience}
        error={errors.experience}
        min="0"
      />
    </div>

    <div class="candidate-form__field">
      <Input
        label="Навыки"
        placeholder="React, TypeScript, CSS (через запятую)"
        bind:value={skills}
      />
    </div>

    <div class="candidate-form__field">
      <Select label="Стадия" options={candidateStages} bind:value={stage} />
    </div>

    <div class="candidate-form__field">
      <Input
        type="number"
        label="Рейтинг (0-5)"
        placeholder="0"
        bind:value={rating}
        error={errors.rating}
        min="0"
        max="5"
        step="0.1"
      />
    </div>
  </div>

  <div class="candidate-form__field candidate-form__field--full">
    <label class="candidate-form__label" for="notes-textarea"> Заметки </label>
    <textarea
      id="notes-textarea"
      class="candidate-form__textarea"
      placeholder="Дополнительная информация о кандидате..."
      bind:value={notes}
    ></textarea>
  </div>

  <div class="candidate-form__actions">
    <Button
      type="button"
      variant="secondary"
      onclick={onCancel}
      disabled={isSubmitting}
    >
      Отмена
    </Button>

    <Button type="submit" variant="primary" disabled={isSubmitting}>
      {isSubmitting ? "Сохранение..." : "Сохранить"}
    </Button>
  </div>
</form>

<style>
  .candidate-form {
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem;
    background-color: var(--color-background);
    border-radius: 8px;
  }

  .candidate-form__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .candidate-form__field {
    display: flex;
    flex-direction: column;
  }

  .candidate-form__field--full {
    grid-column: 1 / -1;
  }

  .candidate-form__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: 0.25rem;
  }

  .candidate-form__textarea {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
    background-color: var(--color-background);
    color: var(--color-text);
    resize: vertical;
    min-height: 100px;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .candidate-form__textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }

  .candidate-form__actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
  }

  @media (max-width: 768px) {
    .candidate-form {
      padding: 1rem;
    }

    .candidate-form__grid {
      grid-template-columns: 1fr;
    }

    .candidate-form__actions {
      flex-direction: column;
    }
  }
</style>
