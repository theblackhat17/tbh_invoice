<!-- src/routes/invoices/InvoicePreview.svelte -->
<script lang="ts">
  export let invoice;
  // Calcule le total des prestations
  let total = 0;
  $: {
    const items = JSON.parse(invoice.items);
    total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }
</script>

<div id="invoice-content" style="font-family: 'Poppins', sans-serif; color: #1F2937; background-color: #FFFFFF; padding: 24px;">
  <!-- En-tête -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
    <div>
      <!-- Logo agrandi en haut à gauche -->
      <img src="/logo.png" alt="Logo" style="width: 128px; height: auto;" />
    </div>
    <div style="text-align: right;">
      <!-- Numéro de facture en haut à droite -->
      <h2 style="font-size: 1.875rem; font-weight: bold;">Facture N°{invoice.invoice_number}</h2>
    </div>
  </div>
  
  <hr style="border-color: #D1D5DB; margin-bottom: 16px;" />
  
  <!-- Informations en deux colonnes -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <!-- Informations fixes de l'entreprise (gauche) -->
    <div>
      <p style="font-weight: 600;">VANDEWALLE CLEMENT</p>
      <p>39 Avenue émile Zola</p>
      <p>59800 Lille</p>
      <p>Siret : 91127899200019</p>
    </div>
    <!-- Informations du client (droite) -->
    <div style="text-align: right;">
      <p style="font-weight: bold;">Client : {invoice.client_name}</p>
      <p>Adresse : {invoice.client_address}</p>
      {#if invoice.phone}
        <p>Téléphone : {invoice.phone}</p>
      {/if}
      {#if invoice.code_postal || invoice.city || invoice.country}
        <p>
          {invoice.code_postal ? invoice.code_postal : ""} {invoice.city ? invoice.city : ""} {invoice.country ? invoice.country : ""}
        </p>
      {/if}
      <p style="color: #EF4444; font-weight: bold;">Date : {invoice.invoice_date}</p>
    </div>
  </div>
  
  <hr style="border-color: #D1D5DB; margin: 16px 0;" />
  
  <!-- Détails des prestations -->
  <div style="margin-bottom: 24px;">
    <h3 style="font-weight: bold; margin-bottom: 8px;">Prestations :</h3>
    <div style="display: flex; flex-direction: column; gap: 8px;">
      {#each JSON.parse(invoice.items) as item}
        <div style="padding: 8px; border: 1px solid #E5E7EB; background-color: #F3F4F6; border-radius: 4px;">
          <p style="font-weight: 600;">{item.description}</p>
          <p>Quantité : {item.quantity}</p>
          <p>Prix unitaire : {item.price} €</p>
        </div>
      {/each}
    </div>
  </div>
  
  <hr style="border-color: #D1D5DB; margin: 16px 0;" />
  
  <!-- Affichage du total des prestations -->
  <div style="margin-top: 16px;">
    <p style="font-size: 1.125rem; font-weight: bold;">Total HT : {total.toFixed(2)} €</p>
  </div>
  
  <!-- Pied de page avec informations fixes, positionnées en bas à gauche -->
  <div style="margin-top: 32px;">
    <p style="font-size: 0.875rem; font-weight: 600;">IBAN : FR76 2823 3000 0153 3547 5796 770 | REVOLUT</p>
    <p style="font-size: 0.875rem;">Nom/Prénom : VANDEWALLE CLEMENT</p>
  </div>
</div>
