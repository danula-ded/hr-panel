import * as Router from "svelte-spa-router";
import JobsPage from "../../pages/jobs/JobsPage.svelte";
import CandidatesPage from "../../pages/candidates/CandidatesPage.svelte";
import CandidatePage from "../../pages/candidate/CandidatePage.svelte";
import CreateCandidatePage from "../../pages/create-candidate/CreateCandidatePage.svelte";
import EditCandidatePage from "../../pages/edit-candidate/EditCandidatePage.svelte";

// Define routes
export const routes: Record<string, unknown> = {
  "/": JobsPage,
  "/jobs": JobsPage,
  "/candidates": CandidatesPage,
  "/candidate/:id": CandidatePage,
  "/create-candidate": CreateCandidatePage,
  "/edit-candidate/:id": EditCandidatePage,
};

// Route parameters
export const routeParams = {
  id: "",
};

// Router configuration
export const routerConfig = {
  // Default route
  defaultRoute: "/",

  // Route parameters
  params: routeParams,

  // Custom route handler for 404
  onRouteChange: (detail: unknown) => {
    console.log("Route changed:", detail);
  },
};

export { Router };
