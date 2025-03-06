<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { jsPDF } from 'jspdf';

  interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
  }

  interface Client {
    id: number;
    name: string;
    address: string;
    phone?: string;
    code_postal?: string;
    city?: string;
    country?: string;
  }

  // Champs de la facture
  let invoiceNumber = '';  // Nouveau champ pour saisir le numéro de facture manuellement
  let invoiceDate = '';
  let clientName = '';
  let clientAddress = '';
  let selectedClientId: number | null = null;
  let items: InvoiceItem[] = [{ description: '', quantity: 1, price: 0 }];

  // Liste des clients à récupérer via l'API
  let clients: Client[] = [];

  onMount(async () => {
    // Récupère la liste des clients existants
    const res = await fetch('/api/clients');
    clients = await res.json();

    // Préremplissage si des infos par défaut sont stockées
    const stored = localStorage.getItem('defaultHeader');
    if (stored) {
      const header = JSON.parse(stored);
      clientName = header.clientName;
      clientAddress = header.clientAddress;
    }
  });

  // Lorsqu'un client est sélectionné, remplir automatiquement les champs
  function selectClient(event: Event) {
    const select = event.target as HTMLSelectElement;
    const id = Number(select.value);
    selectedClientId = id;
    const client = clients.find(c => c.id === id);
    if (client) {
      clientName = client.name;
      clientAddress = client.address;
    }
  }

  function addItem() {
    items.push({ description: '', quantity: 1, price: 0 });
  }

  function removeItem(index: number) {
    if (items.length > 1) items.splice(index, 1);
  }

  async function saveInvoice() {
    // Inclure le numéro de facture dans les données envoyées
    const invoiceData = {
      invoice_number: invoiceNumber,
      invoice_date: invoiceDate,
      client_name: clientName,
      client_address: clientAddress,
      items
    };

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });
      if (!res.ok) {
        throw new Error("Erreur lors de l'enregistrement de la facture.");
      }
      alert('Facture enregistrée !');
      goto('/invoices');
    } catch (err: any) {
      alert(err.message);
    }
  }

  // Fonction pour générer le PDF (version de base ici)
  function generatePDF() {
    const doc = new jsPDF();
    let y = 20;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Facture N°${invoiceNumber}`, 105, y, { align: "center" });
    y += 12;
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text(`Date: ${invoiceDate}`, 10, y);
    y += 10;
    doc.text(`Client: ${clientName}`, 10, y);
    y += 10;
    doc.text(`Adresse: ${clientAddress}`, 10, y);
    y += 20;
    doc.text('Prestations :', 10, y);
    y += 10;
    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.description} - Qté: ${item.quantity} - Prix: ${item.price} €`, 10, y);
      y += 10;
    });
    doc.save('facture.pdf');
  }
</script>

<div class="max-w-3xl mx-auto p-8 bg-gray-50 rounded shadow">
  <h1 class="text-3xl font-bold mb-6 text-center">Créer une Nouvelle Facture</h1>
  
  <!-- Champ pour saisir le numéro de facture -->
  <div class="mb-4">
    <label class="block text-gray-700 font-semibold">Numéro de facture :</label>
    <input type="text" bind:value={invoiceNumber} required class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
  </div>
  
  <!-- Sélection d'un client existant -->
  {#if clients.length > 0}
    <div class="mb-4">
      <label class="block text-gray-700 font-semibold mb-1">Sélectionnez un client existant :</label>
      <select on:change={selectClient} class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="">-- Choisir un client --</option>
        {#each clients as client}
          <option value={client.id}>{client.name} ({client.address})</option>
        {/each}
      </select>
    </div>
  {/if}
  
  <!-- Champs du formulaire -->
  <div class="mb-4">
    <label class="block text-gray-700 font-semibold">Date :</label>
    <input type="date" bind:value={invoiceDate} required class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
  </div>
  <div class="mb-4">
    <label class="block text-gray-700 font-semibold">Nom du client :</label>
    <input type="text" bind:value={clientName} required class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
  </div>
  <div class="mb-4">
    <label class="block text-gray-700 font-semibold">Adresse du client :</label>
    <input type="text" bind:value={clientAddress} required class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
  </div>
  
  <!-- Section Prestations -->
  <div class="mb-6">
    <h2 class="text-xl font-semibold mb-2">Prestations</h2>
    {#each items as item, index}
      <div class="mb-4 p-4 border rounded bg-white">
        <div class="mb-2">
          <label class="block text-gray-700 font-semibold">Description :</label>
          <input type="text" bind:value={item.description} required class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        </div>
        <div class="flex space-x-4">
          <div class="flex-1">
            <label class="block text-gray-700 font-semibold">Quantité :</label>
            <input type="number" bind:value={item.quantity} min="1" required class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          </div>
          <div class="flex-1">
            <label class="block text-gray-700 font-semibold">Prix unitaire :</label>
            <input type="number" bind:value={item.price} min="0" step="0.01" required class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          </div>
        </div>
        {#if items.length > 1}
          <button type="button" class="mt-2 text-red-600 hover:underline" on:click={() => removeItem(index)}>
            Supprimer cette prestation
          </button>
        {/if}
      </div>
    {/each}
    <button type="button" class="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-lg" on:click={addItem}>
      Ajouter une prestation
    </button>
  </div>
  
  <!-- Bouton d'enregistrement de la facture -->
  <div class="flex justify-between">
    <button type="submit" on:click|preventDefault={saveInvoice} class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
      Enregistrer la facture
    </button>
  </div>
</div>
