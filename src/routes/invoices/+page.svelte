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
  
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">Liste des Factures</h1>
  
    {#if invoices.length === 0}
      <p class="text-center text-gray-600">Aucune facture enregistrée.</p>
    {:else}
      <ul>
        {#each invoices as invoice}
          <li class="mb-4 p-4 border rounded shadow flex items-center justify-between bg-white">
            <div>
              <p class="text-xl font-semibold text-gray-800">{invoice.invoice_number}</p>
              <p class="text-gray-600">{invoice.client_name} – {invoice.invoice_date}</p>
            </div>
            <div class="space-x-2">
              <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      on:click={() => showInvoice(invoice)}>
                Voir
              </button>
              <button class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      on:click={() => editInvoice(invoice.id)}>
                Modifier
              </button>
              <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      on:click={() => deleteInvoice(invoice.id)}>
                Supprimer
              </button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  
    {#if currentInvoice}
      <!-- Modale d'affichage de la facture -->
      <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
          <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  on:click={closeModal}>
            &times;
          </button>
          <h2 class="text-2xl font-bold mb-2">Facture N°: {currentInvoice.invoice_number}</h2>
          <p class="mb-1"><span class="font-semibold">Date:</span> {currentInvoice.invoice_date}</p>
          <p class="mb-1"><span class="font-semibold">Client:</span> {currentInvoice.client_name}</p>
          <p class="mb-4"><span class="font-semibold">Adresse:</span> {currentInvoice.client_address}</p>
          <h3 class="text-xl font-semibold mb-2">Prestations :</h3>
          <ul class="list-disc pl-6 text-gray-700">
            {#each JSON.parse(currentInvoice.items) as item}
              <li>{item.description} - Quantité: {item.quantity} - Prix: {item.price} €</li>
            {/each}
          </ul>
        </div>
      </div>
    {/if}
  </div>
  