<script lang="ts">
    import { goto } from '$app/navigation';
  </script>
  
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full">
      <h1 class="text-4xl font-bold text-center mb-8">Tableau de Bord</h1>
      <div class="grid grid-cols-2 gap-6">
        <!-- Accéder aux factures -->
        <button on:click={() => goto('/invoices')}
          class="flex flex-col items-center justify-center p-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition transform hover:scale-105">
          <!-- Icône factures (exemple SVG) -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v3a2 2 0 002 2m10 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
          </svg>
          <span class="mt-2 text-lg font-semibold">Factures</span>
        </button>
  
        <!-- Accéder aux clients -->
        <button on:click={() => goto('/clients')}
          class="flex flex-col items-center justify-center p-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition transform hover:scale-105">
          <!-- Icône clients (exemple SVG) -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.8.635 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="mt-2 text-lg font-semibold">Clients</span>
        </button>
  
        <!-- Créer une nouvelle facture -->
        <button on:click={() => goto('/invoices/new')}
          class="flex flex-col items-center justify-center p-6 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition transform hover:scale-105">
          <!-- Icône nouvelle facture (exemple SVG) -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="mt-2 text-lg font-semibold">Nouvelle facture</span>
        </button>
  
        <!-- Créer un nouveau client -->
        <button on:click={() => goto('/clients/new')}
          class="flex flex-col items-center justify-center p-6 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition transform hover:scale-105">
          <!-- Icône nouveau client (exemple SVG) -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="mt-2 text-lg font-semibold">Nouveau client</span>
        </button>
      </div>
    </div>
  </div>
  