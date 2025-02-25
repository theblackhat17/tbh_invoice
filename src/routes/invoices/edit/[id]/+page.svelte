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

  // Récupère l'id depuis les paramètres de la page
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

<h1>Modifier la Facture</h1>
<form on:submit|preventDefault={saveInvoice}>
  <div>
    <label>
      Numéro de facture:
      <input type="text" bind:value={invoiceNumber} required />
    </label>
  </div>
  <div>
    <label>
      Date:
      <input type="date" bind:value={invoiceDate} required />
    </label>
  </div>
  <div>
    <label>
      Nom du client:
      <input type="text" bind:value={clientName} required />
    </label>
  </div>
  <div>
    <label>
      Adresse du client:
      <input type="text" bind:value={clientAddress} required />
    </label>
  </div>
  
  <h2>Prestations</h2>
  {#each items as item, index}
    <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
      <label>
        Description:
        <input type="text" bind:value={item.description} required />
      </label>
      <label>
        Quantité:
        <input type="number" bind:value={item.quantity} min="1" required />
      </label>
      <label>
        Prix unitaire:
        <input type="number" bind:value={item.price} min="0" step="0.01" required />
      </label>
      {#if items.length > 1}
        <button type="button" on:click={() => removeItem(index)}>Supprimer</button>
      {/if}
    </div>
  {/each}
  <button type="button" on:click={addItem}>Ajouter prestation</button>
  <div style="margin-top: 20px;">
    <button type="submit">Enregistrer la modification</button>
  </div>
</form>
