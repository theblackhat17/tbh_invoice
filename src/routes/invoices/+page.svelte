<!-- src/routes/invoices/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    interface Invoice {
      id: number;
      invoice_number: string;
      invoice_date: string;
      client_name: string;
      client_address: string;
      items: string;
      created_at: string;
    }
  
    let invoices: Invoice[] = [];
    let currentInvoice: Invoice | null = null;
  
    onMount(async () => {
      const res = await fetch('/api/invoices');
      invoices = await res.json();
    });
  
    async function deleteInvoice(id: number) {
      const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        invoices = invoices.filter(invoice => invoice.id !== id);
      } else {
        alert('Erreur lors de la suppression de la facture');
      }
    }
  
    function editInvoice(id: number) {
      goto(`/invoices/edit/${id}`);
    }
  
    function showInvoice(invoice: Invoice) {
      currentInvoice = invoice;
    }
  
    function closeModal() {
      currentInvoice = null;
    }
  </script>
  
  <h1 class="text-3xl font-bold mb-4">Liste des Factures</h1>
  
  {#if invoices.length === 0}
    <p>Aucune facture enregistrée.</p>
  {:else}
    <ul>
      {#each invoices as invoice}
        <li class="mb-4 p-4 border rounded shadow-sm flex items-center justify-between">
          <div>
            <strong class="text-xl">{invoice.invoice_number}</strong>
            <span class="ml-2 text-gray-600">{invoice.client_name} – {invoice.invoice_date}</span>
          </div>
          <div>
            <button class="px-2 py-1 bg-blue-500 text-white rounded" on:click={() => showInvoice(invoice)}>Voir</button>
            <button class="px-2 py-1 bg-green-500 text-white rounded" on:click={() => editInvoice(invoice.id)}>Modifier</button>
            <button class="px-2 py-1 bg-red-500 text-white rounded" on:click={() => deleteInvoice(invoice.id)}>Supprimer</button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
  
  {#if currentInvoice}
    <div class="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="modal-content bg-white p-6 rounded shadow-md max-w-lg w-full">
        <h2 class="text-2xl font-bold mb-2">Facture N°: {currentInvoice.invoice_number}</h2>
        <p>Date: {currentInvoice.invoice_date}</p>
        <p>Client: {currentInvoice.client_name}</p>
        <p>Adresse: {currentInvoice.client_address}</p>
        <h3 class="mt-4 font-semibold">Prestations :</h3>
        <ul class="list-disc pl-6">
          {#each JSON.parse(currentInvoice.items) as item}
            <li>{item.description} - Quantité: {item.quantity} - Prix: {item.price} €</li>
          {/each}
        </ul>
        <button class="mt-4 px-4 py-2 bg-gray-700 text-white rounded" on:click={closeModal}>Fermer</button>
      </div>
    </div>
  {/if}
  