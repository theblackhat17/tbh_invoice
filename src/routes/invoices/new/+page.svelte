<!-- src/routes/invoices/new/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { jsPDF } from 'jspdf';
  import { goto } from '$app/navigation';

  interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
  }

  // Champs de la facture
  let invoiceNumber: string = '';
  let invoiceDate: string = '';
  let clientName: string = '';
  let clientAddress: string = '';
  let items: InvoiceItem[] = [{ description: '', quantity: 1, price: 0 }];

  // Au montage, on récupère les en-têtes sauvegardés dans le localStorage
  onMount(() => {
    const stored = localStorage.getItem('defaultHeader');
    if (stored) {
      const header = JSON.parse(stored);
      clientName = header.clientName;
      clientAddress = header.clientAddress;
    }
  });

  // Sauvegarder les en-têtes pour les prochaines factures
  function saveHeaders() {
    localStorage.setItem('defaultHeader', JSON.stringify({
      clientName,
      clientAddress
    }));
    alert('En-têtes sauvegardés');
  }

  // Gestion dynamique des prestations
  function addItem() {
    items.push({ description: '', quantity: 1, price: 0 });
  }
  
  function removeItem(index: number) {
    if (items.length > 1) {
      items.splice(index, 1);
    }
  }

  // Sauvegarde de la facture via l'API
  async function saveInvoice() {
    const invoiceData = {
      invoice_number: invoiceNumber,
      invoice_date: invoiceDate,
      client_name: clientName,
      client_address: clientAddress,
      items
    };
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
    if (res.ok) {
      alert('Facture enregistrée !');
      goto('/invoices'); // Redirige par exemple vers la liste des factures
    } else {
      alert('Erreur lors de l\'enregistrement.');
    }
  }

  // Génération du PDF de la facture
  function generatePDF() {
    const doc = new jsPDF();
    let y = 20;
    doc.text(`Facture N°: ${invoiceNumber}`, 10, y);
    y += 10;
    doc.text(`Date: ${invoiceDate}`, 10, y);
    y += 10;
    doc.text(`Client: ${clientName}`, 10, y);
    y += 10;
    doc.text(`Adresse: ${clientAddress}`, 10, y);
    y += 20;
    
    doc.text("Prestations:", 10, y);
    y += 10;
    
    items.forEach((item, index: number) => {
      doc.text(
        `${index + 1}. ${item.description} - Quantité: ${item.quantity} - Prix: ${item.price} €`,
        10,
        y
      );
      y += 10;
    });
    
    let total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    y += 10;
    doc.text(`Total: ${total.toFixed(2)} €`, 10, y);
    
    doc.save(`facture-${invoiceNumber}.pdf`);
  }
</script>

<h1>Nouvelle Facture</h1>

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
  
  <!-- Bouton pour sauvegarder tes en-têtes dans le localStorage -->
  <button type="button" on:click={saveHeaders}>Enregistrer les en-têtes</button>
  
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
    <button type="button" on:click={generatePDF}>Générer PDF</button>
    <button type="submit">Enregistrer la facture</button>
  </div>
</form>
