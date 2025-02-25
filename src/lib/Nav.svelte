<script>
  let isOpen = false;
  function toggleMenu() {
    isOpen = !isOpen;
  }
</script>

<nav class="bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <!-- Logo, tu peux le remplacer par ton logo -->
          <a href="/">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4a2 2 0 00-2-2 2 2 0 00-2 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </a>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <a href="/invoices" class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700">Factures</a>
            <a href="/clients" class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700">Clients</a>
            <a href="/invoices/new" class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700">Nouvelle facture</a>
            <a href="/clients/new" class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700">Nouveau client</a>
          </div>
        </div>
      </div>
      <div class="-mr-2 flex md:hidden">
        <button on:click={toggleMenu} type="button" class="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none">
          <span class="sr-only">Ouvrir le menu</span>
          <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            {#if !isOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            {/if}
          </svg>
        </button>
      </div>
    </div>
  </div>

  {#if isOpen}
    <div class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a href="/invoices" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">Factures</a>
        <a href="/clients" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">Clients</a>
        <a href="/invoices/new" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">Nouvelle facture</a>
        <a href="/clients/new" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">Nouveau client</a>
      </div>
    </div>
  {/if}
</nav>
