<script lang="ts">
  import AppProvider from "../app/providers/AppProvider.svelte";
  import "../app.css";
  import { goto } from "$app/navigation";
  import { storage } from "../shared/lib/storage";
  let { children }: { children: any } = $props();

  let currentPath = $state("/");
  let showMobileMenu = $state(false);

  function navigateTo(path: string) {
    goto(path);
    showMobileMenu = false;
  }

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }

  function clearCache() {
    storage.clear();
    location.reload();
  }
</script>

<AppProvider>
  <div class="app">
    <header class="app__header">
      <div class="app__header-content">
        <div class="app__logo">
          <a href="/" class="app__logo-link" onclick={(e) => { e.preventDefault(); navigateTo("/"); }}>
            <h1>HR Panel</h1>
          </a>
        </div>

        <nav class="app__nav">
          <a href="/jobs" class="app__nav-link" onclick={(e) => { e.preventDefault(); navigateTo("/jobs"); }}>
            Вакансии
          </a>
          <a href="/candidates" class="app__nav-link" onclick={(e) => { e.preventDefault(); navigateTo("/candidates"); }}>
            Кандидаты
          </a>
          <a href="/shortlist" class="app__nav-link" onclick={(e) => { e.preventDefault(); navigateTo("/shortlist"); }}>
            Шортлист
          </a>
        </nav>

        <button
          class="app__mobile-menu-toggle"
          onclick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <button class="app__clear-cache btn btn--secondary btn--sm" onclick={clearCache} aria-label="Clear cache">Очистить кэш</button>
      </div>

      {#if showMobileMenu}
        <nav class="app__mobile-nav">
          <a href="/jobs" class="app__mobile-nav-link" onclick={(e) => { e.preventDefault(); navigateTo("/jobs"); }}>
            Вакансии
          </a>
          <a href="/candidates" class="app__mobile-nav-link" onclick={(e) => { e.preventDefault(); navigateTo("/candidates"); }}>
            Кандидаты
          </a>
            <a href="/shortlist" class="app__mobile-nav-link" onclick={(e) => { e.preventDefault(); navigateTo("/shortlist"); }}>
              Шортлист
            </a>
        </nav>
      {/if}
    </header>

    <main class="app__main">
      {@render children()}
    </main>

    <footer class="app__footer">
      <p>&copy; 2024 HR Panel. Все права защищены.</p>
    </footer>
  </div>
</AppProvider>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
  }

  .app__header {
    background-color: var(--color-background);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .app__header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
  }

  .app__logo h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }

  .app__nav {
    display: flex;
    gap: 2rem;
  }

  .app__nav-link {
    text-decoration: none;
    color: var(--color-text-muted);
    font-weight: 500;
    padding: 0.5rem 0;
    transition: color 0.2s ease;
    border-bottom: 2px solid transparent;
  }

  .app__nav-link:hover {
    color: var(--color-text);
  }

  .app__mobile-menu-toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .app__mobile-menu-toggle span {
    width: 24px;
    height: 2px;
    background-color: var(--color-text);
    transition: all 0.3s ease;
  }

  .app__mobile-nav {
    display: none;
    flex-direction: column;
    background-color: var(--color-background);
    border-top: 1px solid var(--color-border);
    padding: 1rem;
  }

  .app__mobile-nav-link {
    text-decoration: none;
    color: var(--color-text-muted);
    font-weight: 500;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
    transition: color 0.2s ease;
  }

  .app__mobile-nav-link:last-child {
    border-bottom: none;
  }

  .app__mobile-nav-link:hover {
    color: var(--color-text);
  }

  .app__main {
    flex: 1;
    min-height: calc(100vh - 8rem);
  }

  .app__footer {
    background-color: var(--color-secondary);
    border-top: 1px solid var(--color-border);
    padding: 1rem;
    text-align: center;
  }

  .app__footer p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    .app__nav {
      display: none;
    }

    .app__mobile-menu-toggle {
      display: flex;
    }

    .app__mobile-nav {
      display: flex;
    }
  }
</style>

