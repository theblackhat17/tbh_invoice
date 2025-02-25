<!-- src/routes/invoices/edit/[id]/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let invoiceNumber: string = '';
  let invoiceDate: string = '';
  let clientName: string = '';
  let clientAddress: string = '';
  let items: { description: string; quantity: number; price: number }[] = [{ description: '', quantity: 1, price: 0 }];

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

<h1 class="text-3xl font-bold mb-4">Modifier la Facture</h1>
<form on:submit|preventDefault={saveInvoice} class="space-y-4">
  <div>
    <label class="block">
      Numéro de facture:
      <input type="text" bind:value={invoiceNumber} required class="w-full p-2 border rounded" />
    </label>
  </div>
  <div>
    <label class="block">
      Date:
      <input type="date" bind:value={invoiceDate} required class="w-full p-2 border rounded" />
    </label>
  </div>
  <div>
    <label class="block">
      Nom du client:
      <input type="text" bind:value={clientName} required class="w-full p-2 border rounded" />
    </label>
  </div>
  <div>
    <label class="block">
      Adresse du client:
      <input type="text" bind:value={clientAddress} required class="w-full p-2 border rounded" />
    </label>
  </div>
  
  <h2 class="text-xl font-semibold mt-4">Prestations</h2>
  {#each items as item, index}
    <div class="border p-4 rounded mb-4">
      <label class="block">
        Description:
        <input type="text" bind:value={item.description} required class="w-full p-2 border rounded" />
      </label>
      <label class="block mt-2">
        Quantité:
        <input type="number" bind:value={item.quantity} min="1" required class="w-full p-2 border rounded" />
      </label>
      <label class="block mt-2">
        Prix unitaire:
        <input type="number" bind:value={item.price} min="0" step="0.01" required class="w-full p-2 border rounded" />
      </label>
      {#if items.length > 1}
        <button type="button" class="mt-2 px-3 py-1 bg-red-500 text-white rounded" on:click={() => removeItem(index)}>Supprimer</button>
      {/if}
    </div>
  {/each}
  <button type="button" class="px-4 py-2 bg-blue-500 text-white rounded" on:click={addItem}>Ajouter prestation</button>
  <div class="mt-6">
    <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded">Enregistrer la modification</button>
  </div>
</form>
