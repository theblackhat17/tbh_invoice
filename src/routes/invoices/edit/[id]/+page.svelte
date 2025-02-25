<!-- src/routes/invoices/edit/[id]/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let invoiceNumber: string = '';
  let invoiceDate: string = '';
  let clientName: string = '';
  let clientAddress: string = '';
  let items: { description: string; quantity: number; price: number }[] = [
    { description: '', quantity: 1, price: 0 }
  ];

  // Récupération de l'id de l'URL via le store $page
  const { id } = $page.params;

  onMount(async () => {
    const res = await fetch(`/api/invoices/${id}`);
    const invoice = await res.json();
    if (invoice) {
      invoiceNumber = invoice.invoice_number;
      invoiceDate = invoice.invoice_date;
      clientName = invoice.client_name;
      clientAddress = invoice.client_address;
      items = JSON.parse(invoice.items);
    }
  });

  function addItem() {
    items.push({ description: '', quantity: 1, price: 0 });
  }

  function removeItem(index: number) {
    if (items.length > 1) {
      items.splice(index, 1);
    }
  }

  async function saveInvoice() {
    const invoiceData = {
      invoice_number: invoiceNumber,
      invoice_date: invoiceDate,
      client_name: clientName,
      client_address: clientAddress,
      items
    };
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
    if (res.ok) {
      alert('Facture mise à jour !');
      goto('/invoices');
    } else {
      alert('Erreur lors de la mise à jour de la facture.');
    }
  }
</script>

<div class="max-w-4xl mx-auto p-8 bg-white rounded shadow">
  <h1 class="text-3xl font-bold mb-6 text-center">Modifier la Facture</h1>
  
  <!-- Section Informations Générales -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label class="block font-semibold mb-1">Numéro de facture</label>
      <input
        type="text"
        bind:value={invoiceNumber}
        required
        class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <div>
      <label class="block font-semibold mb-1">Date de facture</label>
      <input
        type="date"
        bind:value={invoiceDate}
        required
        class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  </div>
  
  <!-- Section Informations Client -->
  <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label class="block font-semibold mb-1">Nom du client</label>
      <input
        type="text"
        bind:value={clientName}
        required
        class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <div>
      <label class="block font-semibold mb-1">Adresse du client</label>
      <input
        type="text"
        bind:value={clientAddress}
        required
        class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  </div>
  
  <!-- Section Prestations -->
  <div class="mt-8">
    <h2 class="text-xl font-bold mb-4">Prestations</h2>
    {#each items as item, index}
      <div class="mb-4 p-4 border rounded bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block font-semibold mb-1">Description</label>
            <input
              type="text"
              bind:value={item.description}
              required
              class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label class="block font-semibold mb-1">Quantité</label>
            <input
              type="number"
              bind:value={item.quantity}
              min="1"
              required
              class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label class="block font-semibold mb-1">Prix unitaire</label>
            <input
              type="number"
              bind:value={item.price}
              min="0"
              step="0.01"
              required
              class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        {#if items.length > 1}
          <button
            type="button"
            class="mt-2 inline-block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            on:click={() => removeItem(index)}
          >
            Supprimer cette prestation
          </button>
        {/if}
      </div>
    {/each}
    <button
      type="button"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      on:click={addItem}
    >
      Ajouter une prestation
    </button>
  </div>
  
  <!-- Bouton de sauvegarde -->
  <div class="mt-8 text-center">
    <button
      type="button"
      on:click={saveInvoice}
      class="px-8 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Enregistrer la modification
    </button>
  </div>
</div>
