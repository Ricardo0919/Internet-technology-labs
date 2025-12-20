<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

/**
 * Config
 * - Pon tu API key en .env: VITE_JOBBOERSE_API_KEY="..."
 * - Base URL: si usas proxy de Vite, puedes poner "/api/..." aquí.
 */
const BASE_URL =
    import.meta.env.VITE_JOBBOERSE_BASE_URL ?? "https://rest.arbeitsagentur.de";
const API_KEY = import.meta.env.VITE_JOBBOERSE_API_KEY as string | undefined;

type JobItem = {
  hashId: string;
  beruf: string;
  arbeitgeber?: string;
  arbeitsort?: {
    ort?: string;
    plz?: string;
  };
  eintrittsdatum?: string;
  veroeffentlichungsdatum?: string;
  refnr?: string;
};

type JobSearchResponse = {
  stellenangebote?: JobItem[];
  maxErgebnisse?: number;
  page?: number;
  size?: number;
  woOutput?: any;
  facetten?: any;
};

type JobDetails = {
  beruf?: string;
  arbeitgeber?: string;
  arbeitsort?: { ort?: string; plz?: string };
  taetigkeitsbeschreibung?: string;
  arbeitgeberAdresse?: string;
  veroeffentlichungsdatum?: string;
};

const keyword = ref("werkstudent"); // default que casi siempre devuelve resultados
const location = ref("Stuttgart");
const radius = ref(50);
const size = ref(8);

// ✅ Pagination state
const page = ref(1);
const total = ref<number>(0);

const totalPages = computed(() => {
  return Math.max(1, Math.ceil((total.value || 0) / size.value));
});

const loading = ref(false);
const error = ref<string | null>(null);
const jobs = ref<JobItem[]>([]);

const selectedHashId = ref<string | null>(null);
const detailsLoading = ref(false);
const detailsError = ref<string | null>(null);
const details = ref<JobDetails | null>(null);

const canSearch = computed(() => location.value.trim().length > 0);

function buildSearchUrl() {
  const params = new URLSearchParams();

  if (keyword.value.trim()) params.set("was", keyword.value.trim());
  params.set("wo", location.value.trim());
  params.set("umkreis", String(radius.value));
  params.set("size", String(size.value));
  params.set("page", String(page.value));

  return `${BASE_URL}/pc/v4/jobs?${params.toString()}`;
}

async function searchJobs() {
  if (!canSearch.value) return;

  loading.value = true;
  error.value = null;

  try {
    const res = await fetch(buildSearchUrl(), {
      headers: {
        Accept: "application/json",
        ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
      },
    });

    if (!res.ok) throw new Error(`Search failed (${res.status})`);

    const data = (await res.json()) as JobSearchResponse;

    // ✅ Map correcto del response real
    jobs.value = data.stellenangebote ?? [];

    // ✅ Para UI + paginación
    total.value = data.maxErgebnisse ?? 0;

    // La API a veces regresa el page actual
    if (typeof data.page === "number") page.value = data.page;
  } catch (e: any) {
    error.value =
        e?.message ??
        "Something went wrong while fetching jobs. (Possible causes: missing API key or CORS.)";
    jobs.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

// ✅ Botón Search: siempre reinicia a página 1
function runSearch() {
  page.value = 1;
  searchJobs();
}

// ✅ Prev/Next
function nextPage() {
  if (page.value < totalPages.value) {
    page.value += 1;
    searchJobs();
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value -= 1;
    searchJobs();
  }
}

// ✅ Si cambias filtros, resetea paginación (para no quedarte en page 5 sin sentido)
watch([keyword, location, radius, size], () => {
  page.value = 1;
});

function openExternal(j: JobItem) {
  // 1) Si hay refnr, es la opción más estable
  if (j.refnr) {
    window.open(`https://www.arbeitsagentur.de/jobsuche/suche?angebotsart=1&refnr=${encodeURIComponent(j.refnr)}`, "_blank");
    return;
  }

  // 2) fallback: al menos abre una búsqueda con título+ciudad
  const q = `${j.beruf ?? ""} ${j.arbeitsort?.ort ?? ""}`.trim();
  window.open(`https://www.arbeitsagentur.de/jobsuche/suche?angebotsart=1&wo=${encodeURIComponent(location.value)}&was=${encodeURIComponent(q)}`, "_blank");
}

function closeDetails() {
  selectedHashId.value = null;
  details.value = null;
  detailsError.value = null;
}

onMounted(() => {
  // auto-search al entrar
  searchJobs();
});
</script>

<template>
  <section class="mx-10 mt-16 md:mx-20 lg:mx-40 lg:my-28">
    <div class="flex items-end justify-between gap-6 flex-wrap">
      <div>
        <h1 class="text-2xl md:text-3xl font-semibold text-white">Job Explorer</h1>
        <p class="mt-2 text-sm md:text-base text-white/70 max-w-2xl">
          Live job offers using Germany’s Jobsuche API. Filter by keyword, city and radius.
        </p>
      </div>

      <button
          type="button"
          @click="runSearch"
          :disabled="!canSearch || loading"
          class="inline-flex items-center justify-center rounded-full border border-white px-6 py-3
               text-white text-sm md:text-base font-medium shadow-sm
               hover:opacity-90 active:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Searching…</span>
        <span v-else>Search</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="mt-8 rounded-2xl border border-neutral-700 bg-neutral-900/40 p-6 md:p-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label class="flex flex-col gap-2">
          <span class="text-xs md:text-sm text-white/70">Keyword</span>
          <input
              v-model="keyword"
              type="text"
              placeholder="werkstudent, praktikum, java…"
              class="rounded-xl border border-neutral-700 bg-black/40 px-4 py-3 text-white
                   outline-none focus:border-white/60 transition"
          />
        </label>

        <label class="flex flex-col gap-2">
          <span class="text-xs md:text-sm text-white/70">City</span>
          <input
              v-model="location"
              type="text"
              placeholder="Stuttgart"
              class="rounded-xl border border-neutral-700 bg-black/40 px-4 py-3 text-white
                   outline-none focus:border-white/60 transition"
          />
        </label>

        <label class="flex flex-col gap-2">
          <span class="text-xs md:text-sm text-white/70">Radius (km)</span>
          <select
              v-model.number="radius"
              class="rounded-xl border border-neutral-700 bg-black/40 px-4 py-3 text-white
                   outline-none focus:border-white/60 transition"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </label>
      </div>

      <div class="mt-4 text-xs text-white/50">
        Tip: try “werkstudent”, “praktikum”, “java”, “python”, “robotik”.
      </div>
    </div>

    <!-- Error -->
    <div
        v-if="error"
        class="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm text-white/80"
    >
      <p class="font-semibold text-white">Couldn’t load jobs</p>
      <p class="mt-1">{{ error }}</p>
    </div>

    <!-- Results -->
    <div class="mt-8">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <h2 class="text-lg md:text-xl font-semibold text-white">Results</h2>

        <p class="text-xs md:text-sm text-white/60">
          {{ jobs.length }} jobs • total: {{ total }} • page {{ page }} / {{ totalPages }}
        </p>
      </div>

      <!-- Pagination controls -->
      <div class="mt-3 flex items-center justify-end gap-3">
        <button
            type="button"
            @click="prevPage"
            :disabled="loading || page <= 1"
            class="rounded-full border border-white px-4 py-2 text-xs md:text-sm text-white
                 hover:opacity-90 active:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        <button
            type="button"
            @click="nextPage"
            :disabled="loading || page >= totalPages"
            class="rounded-full border border-white px-4 py-2 text-xs md:text-sm text-white
                 hover:opacity-90 active:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
            v-for="j in jobs"
            :key="j.hashId"
            class="rounded-2xl border border-neutral-700 bg-neutral-900/40 px-6 py-5
                 transition-all duration-200 hover:-translate-y-1 hover:bg-neutral-900/70"
        >
          <p class="text-sm md:text-base font-semibold text-white">
            {{ j.beruf }}
          </p>

          <p class="mt-1 text-xs md:text-sm text-white/70">
            <span v-if="j.arbeitgeber">{{ j.arbeitgeber }}</span>
            <span v-if="j.arbeitgeber && (j.arbeitsort?.ort || j.arbeitsort?.plz)"> • </span>
            <span v-if="j.arbeitsort?.ort || j.arbeitsort?.plz">
              {{ j.arbeitsort?.plz }} {{ j.arbeitsort?.ort }}
            </span>
          </p>

          <p class="mt-2 text-xs text-white/50">
            <template v-if="j.veroeffentlichungsdatum">Published: {{ j.veroeffentlichungsdatum }}</template>
            <template v-else-if="j.eintrittsdatum">Start: {{ j.eintrittsdatum }}</template>
            <template v-else>Published: —</template>
          </p>

          <div class="mt-4 flex gap-3">
            <button
                type="button"
                class="rounded-full border border-white px-4 py-2 text-xs md:text-sm text-white
         hover:opacity-90 active:opacity-80 transition"
                @click="openExternal(j)"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      <div v-if="!loading && !error && jobs.length === 0" class="mt-8 text-white/60">
        No results. Try a different keyword or city.
      </div>
    </div>

    <!-- Details Modal -->
    <Teleport to="body">
      <div v-if="selectedHashId" class="fixed inset-0 z-[80]">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeDetails" />

        <div class="relative mx-auto mt-20 w-[92%] max-w-2xl">
          <div class="rounded-2xl border border-neutral-700 bg-neutral-950 p-6 md:p-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg md:text-xl font-semibold text-white">Job Details</h3>
                <p class="mt-1 text-xs text-white/50 break-all">{{ selectedHashId }}</p>
              </div>

              <button
                  type="button"
                  class="rounded-full border border-neutral-700 px-3 py-1 text-white/80 hover:text-white hover:border-white/60 transition"
                  @click="closeDetails"
              >
                ✕
              </button>
            </div>

            <div class="mt-6">
              <div v-if="detailsLoading" class="text-white/70">Loading details…</div>

              <div
                  v-else-if="detailsError"
                  class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-white/80"
              >
                {{ detailsError }}
              </div>

              <div v-else-if="details" class="space-y-3">
                <p class="text-white">
                  <span class="font-semibold">Title:</span> {{ details.beruf ?? "—" }}
                </p>
                <p class="text-white/80">
                  <span class="font-semibold text-white">Company:</span> {{ details.arbeitgeber ?? "—" }}
                </p>
                <p class="text-white/80">
                  <span class="font-semibold text-white">Location:</span>
                  {{ details.arbeitsort?.plz }} {{ details.arbeitsort?.ort }}
                </p>

                <div class="mt-4 rounded-2xl border border-neutral-700 bg-black/30 p-4">
                  <p class="text-sm text-white/70">
                    {{ details.taetigkeitsbeschreibung ?? "No description provided." }}
                  </p>
                </div>
              </div>

              <div v-else class="text-white/70">No details available.</div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
