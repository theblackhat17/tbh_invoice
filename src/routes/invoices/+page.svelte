<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import InvoicePreview from './InvoicePreview.svelte'; // Assure-toi que ce composant existe

  interface Invoice {
    id: number;
    invoice_number: string;
    invoice_date: string;
    client_name: string;
    client_address: string;
    items: string; // JSON stringifié
    created_at: string;
  }

  let invoices: Invoice[] = [];
  let currentInvoice: Invoice | null = null;

  onMount(async () => {
    const res = await fetch('/api/invoices');
    invoices = await res.json();
  });

  async function deleteInvoice(id: number) {
    if (!confirm("Voulez-vous vraiment supprimer cette facture ?")) return;
    const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    if (res.ok) {
      invoices = invoices.filter(invoice => invoice.id !== id);
    } else {
      alert("Erreur lors de la suppression de la facture");
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

  // Fonction pour générer le PDF (utilise un import dynamique de html2pdf.js côté client)
  async function downloadPDF() {
    if (!currentInvoice) return;
    if (typeof window === 'undefined') return;
    
    const { default: html2pdf } = await import("html2pdf.js");
    const element = document.getElementById("invoice-content");
    if (!element) {
      alert("Impossible de trouver l'aperçu de la facture.");
      return;
    }
    const opt = {
      margin: 10,
      filename: `facture-${currentInvoice.invoice_number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    await html2pdf().set(opt).from(element).save();
  }
</script>

<!-- Bouton pour créer une nouvelle facture -->
<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-4xl font-bold">Liste des Factures</h1>
    <a href="/invoices/new" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full shadow-lg transition transform hover:scale-105">
      Créer une Nouvelle Facture
    </a>
  </div>
  

  {#if invoices.length === 0}
    <p class="text-center text-gray-500">Aucune facture enregistrée.</p>
  {:else}
    <ul class="space-y-4">
      {#each invoices as invoice}
        <li class="card bg-base-100 shadow-xl p-4 flex items-center justify-between">
          <div>
            <h2 class="card-title text-xl font-bold">{invoice.invoice_number}</h2>
            <p class="text-gray-600">{invoice.client_name} – {invoice.invoice_date}</p>
          </div>
          <div class="space-x-2">
            <button class="btn btn-primary" on:click={() => showInvoice(invoice)}>Voir</button>
            <button class="btn btn-secondary" on:click={() => editInvoice(invoice.id)}>Modifier</button>
            <button class="btn btn-error" on:click={() => deleteInvoice(invoice.id)}>Supprimer</button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

{#if currentInvoice}
  <!-- Modale d'affichage de la facture avec l'aperçu HTML -->
  <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" transition:fade>
    <div class="relative bg-white text-gray-800 p-6 rounded shadow-lg max-w-lg w-full">
      <button class="absolute top-2 right-2 text-gray-600 hover:text-gray-800" on:click={closeModal}>&times;</button>
      
      <!-- Composant d'aperçu de facture -->
      <div id="invoice-content">
        <InvoicePreview invoice={currentInvoice} />
      </div>
      
      <div class="mt-4 flex space-x-4">
        <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition" on:click={downloadPDF}>
          Télécharger PDF
        </button>
        <button class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition" on:click={closeModal}>
          Fermer
        </button>
      </div>
    </div>
  </div>
{/if}
