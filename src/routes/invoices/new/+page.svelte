<script lang="ts">
  import { onMount } from 'svelte';
  import { jsPDF } from 'jspdf';
  import { goto } from '$app/navigation';

  interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
  }

  let invoiceDate: string = '';
  let clientName: string = '';
  let clientAddress: string = '';
  let items: InvoiceItem[] = [{ description: '', quantity: 1, price: 0 }];

  onMount(() => {
    // Par exemple, on peut pré-remplir des données depuis un profil stocké localement
    const stored = localStorage.getItem('defaultHeader');
    if (stored) {
      const header = JSON.parse(stored);
      clientName = header.clientName;
      clientAddress = header.clientAddress;
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
      invoice_date: invoiceDate,
      client_name: clientName,
      client_address: clientAddress,
      items
      // userId ou d'autres données peuvent être ajoutés ici
    };
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
    if (res.ok) {
      alert('Facture enregistrée !');
      goto('/invoices');
    } else {
      alert("Erreur lors de l'enregistrement de la facture.");
    }
  }

  function generatePDF() {
    const doc = new jsPDF();
    let y = 20;
    doc.text(`Date: ${invoiceDate}`, 10, y);
    y += 10;
    doc.text(`Client: ${clientName}`, 10, y);
    y += 10;
    doc.text(`Adresse: ${clientAddress}`, 10, y);
    y += 20;
    doc.text("Prestations:", 10, y);
    y += 10;
    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.description} - Quantité: ${item.quantity} - Prix: ${item.price} €`, 10, y);
      y += 10;
    });
    doc.save('facture.pdf');
  }
</script>

<div class="max-w-3xl mx-auto p-6 bg-gray-50 rounded shadow">
  <h1 class="text-3xl font-bold mb-6 text-center">Créer une Nouvelle Facture</h1>
  <form on:submit|preventDefault={saveInvoice} class="space-y-6">
    <div>
      <label class="block text-gray-700">Date:</label>
      <input type="date" bind:value={invoiceDate} required class="mt-1 w-full p-2 border rounded" />
    </div>
    <div>
      <label class="block text-gray-700">Nom du client:</label>
      <input type="text" bind:value={clientName} required class="mt-1 w-full p-2 border rounded" />
    </div>
    <div>
      <label class="block text-gray-700">Adresse du client:</label>
      <input type="text" bind:value={clientAddress} required class="mt-1 w-full p-2 border rounded" />
    </div>
    <div>
      <h2 class="text-xl font-semibold mb-2">Prestations</h2>
      {#each items as item, index}
        <div class="mb-4 p-4 border rounded bg-white">
          <div class="mb-2">
            <label class="block text-gray-700">Description:</label>
            <input type="text" bind:value={item.description} required class="mt-1 w-full p-2 border rounded" />
          </div>
          <div class="flex space-x-4">
            <div class="flex-1">
              <label class="block text-gray-700">Quantité:</label>
              <input type="number" bind:value={item.quantity} min="1" required class="mt-1 w-full p-2 border rounded" />
            </div>
            <div class="flex-1">
              <label class="block text-gray-700">Prix unitaire:</label>
              <input type="number" bind:value={item.price} min="0" step="0.01" required class="mt-1 w-full p-2 border rounded" />
            </div>
          </div>
          {#if items.length > 1}
            <button type="button" class="mt-2 text-red-500 hover:underline" on:click={() => removeItem(index)}>Supprimer cette prestation</button>
          {/if}
        </div>
      {/each}
      <button type="button" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" on:click={addItem}>Ajouter une prestation</button>
    </div>
    <div class="flex justify-between">
      <button type="button" on:click={generatePDF} class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition">Générer PDF</button>
      <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Enregistrer la facture</button>
    </div>
  </form>
</div>