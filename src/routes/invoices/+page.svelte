<!-- src/routes/invoices/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
  
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
  
    onMount(async () => {
      const res = await fetch('/api/invoices');
      invoices = await res.json();
    });
  </script>
  
  <h1>Liste des Factures</h1>
  
  {#if invoices.length === 0}
    <p>Aucune facture enregistrée.</p>
  {:else}
    <ul>
      {#each invoices as invoice}
        <li>
          <strong>{invoice.invoice_number}</strong> – {invoice.invoice_date} – {invoice.client_name}
        </li>
      {/each}
    </ul>
  {/if}
  