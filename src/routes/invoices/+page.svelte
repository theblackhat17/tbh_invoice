<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import InvoicePreview from './InvoicePreview.svelte';

  interface Invoice {
    id: number;
    invoice_number: string;
    invoice_date: string; // Format "YYYY-MM-DD"
    client_name: string;
    client_address: string;
    items: string; // JSON stringifié
    created_at: string;
  }

  let invoices: Invoice[] = [];
  let groupedInvoices: Record<string, Invoice[]> = {};
  let expandedGroups: Record<string, boolean> = {};
  let currentInvoice: Invoice | null = null;

  onMount(async () => {
    const res = await fetch('/api/invoices');
    invoices = await res.json();
    groupInvoices();
  });

  function groupInvoices() {
    groupedInvoices = {};
    invoices.forEach((invoice) => {
      // Extrait "YYYY-MM" depuis invoice_date
      const month = invoice.invoice_date.substring(0, 7);
      if (!groupedInvoices[month]) {
        groupedInvoices[month] = [];
        expandedGroups[month] = false;
      }
      groupedInvoices[month].push(invoice);
    });
  }

  function toggleGroup(month: string) {
    expandedGroups[month] = !expandedGroups[month];
  }

  async function deleteInvoice(id: number) {
    if (!confirm("Voulez-vous vraiment supprimer cette facture ?")) return;
    const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    if (res.ok) {
      invoices = invoices.filter(invoice => invoice.id !== id);
      groupInvoices();
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

  // Génère le PDF avec html2pdf.js
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

<div class="container mx-auto p-6">
  <!-- En-tête avec bouton de création -->
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-4xl font-bold">Liste des Factures</h1>
    <a href="/invoices/new" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full shadow-lg transition transform hover:scale-105">
      Créer une Nouvelle Facture
    </a>
  </div>
  
  {#if invoices.length === 0}
    <p class="text-center text-gray-500">Aucune facture enregistrée.</p>
  {:else}
    {#each Object.keys(groupedInvoices).sort((a, b) => b.localeCompare(a)) as month}
      <div class="mb-8">
        <!-- Carte de groupe pour le mois -->
        <div class="flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-t-lg cursor-pointer" on:click={() => toggleGroup(month)}>
          <h2 class="text-xl font-bold">{month}</h2>
          <span class="text-2xl">{expandedGroups[month] ? '−' : '+'}</span>
        </div>
        {#if expandedGroups[month]}
          <div class="border border-t-0 rounded-b-lg shadow-lg p-4 bg-white">
            {#each groupedInvoices[month] as invoice (invoice.id)}
              <div class="flex justify-between items-center border-b py-2">
                <div>
                  <p class="font-semibold">{invoice.invoice_number}</p>
                  <p class="text-sm text-gray-500">{invoice.client_name} - {invoice.invoice_date}</p>
                </div>
                <div class="space-x-2">
                  <button on:click={() => showInvoice(invoice)} class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition">Voir</button>
                  <button on:click={() => editInvoice(invoice.id)} class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition">Modifier</button>
                  <button on:click={() => deleteInvoice(invoice.id)} class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition">Supprimer</button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div>

{#if currentInvoice}
  <!-- Modal d'affichage de la facture -->
  <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" transition:fade>
    <div class="relative bg-white text-gray-800 p-6 rounded shadow-lg max-w-lg w-full">
      <button class="absolute top-2 right-2 text-gray-600 hover:text-gray-800" on:click={closeModal}>&times;</button>
      
      <!-- Contenu de la facture dans la modal -->
      <div id="invoice-content">
        <InvoicePreview invoice={currentInvoice} />
      </div>
      
      <div class="mt-4 flex justify-center space-x-4">
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
