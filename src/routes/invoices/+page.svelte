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
      items: string; // stocké en JSON
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
  
  <h1>Liste des Factures</h1>
  
  {#if invoices.length === 0}
    <p>Aucune facture enregistrée.</p>
  {:else}
    <ul>
      {#each invoices as invoice}
        <li style="margin-bottom: 10px;">
          <strong>{invoice.invoice_number}</strong> – {invoice.client_name} – {invoice.invoice_date}
          <button on:click={() => showInvoice(invoice)}>Voir</button>
          <button on:click={() => editInvoice(invoice.id)}>Modifier</button>
          <button on:click={() => deleteInvoice(invoice.id)}>Supprimer</button>
        </li>
      {/each}
    </ul>
  {/if}
  
  {#if currentInvoice}
    <!-- Modale d'affichage de la facture -->
    <div class="modal">
      <div class="modal-content">
        <h2>Facture N°: {currentInvoice.invoice_number}</h2>
        <p>Date: {currentInvoice.invoice_date}</p>
        <p>Client: {currentInvoice.client_name}</p>
        <p>Adresse: {currentInvoice.client_address}</p>
        <h3>Prestations :</h3>
        <ul>
          {#each JSON.parse(currentInvoice.items) as item}
            <li>{item.description} - Quantité: {item.quantity} - Prix: {item.price} €</li>
          {/each}
        </ul>
        <button on:click={closeModal}>Fermer</button>
      </div>
    </div>
  {/if}
  
  <style>
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      max-width: 500px;
      width: 90%;
    }
    button {
      margin-left: 10px;
    }
  </style>
  