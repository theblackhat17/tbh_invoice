<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    interface Client {
      id: number;
      name: string;
      address: string;
      phone?: string;
      code_postal?: string;
      city?: string;
      country?: string;
      created_at: string;
    }
  
    let clients: Client[] = [];
  
    onMount(async () => {
      const res = await fetch('/api/clients');
      clients = await res.json();
    });
  
    function editClient(id: number) {
      goto(`/clients/edit/${id}`);
    }
  
    async function deleteClient(id: number) {
      if (!confirm("Supprimer ce client ?")) return;
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        clients = clients.filter(client => client.id !== id);
      } else {
        alert("Erreur lors de la suppression du client");
      }
    }
  </script>
  
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-4xl font-bold">Liste des Clients</h1>
      <a href="/clients/new" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full shadow-lg transition transform hover:scale-105">
        Ajouter un Client
      </a>
    </div>
  
    {#if clients.length === 0}
      <p class="text-center text-gray-500">Aucun client enregistré.</p>
    {:else}
      <ul class="space-y-4">
        {#each clients as client (client.id)}
          <li class="flex justify-between items-center p-4 bg-white rounded shadow">
            <div>
              <h2 class="text-xl font-bold">{client.name}</h2>
              <p class="text-gray-600">{client.address}</p>
              {#if client.phone}<p class="text-gray-600">Téléphone : {client.phone}</p>{/if}
              {#if client.city || client.country}
                <p class="text-gray-600">{client.city} {client.country}</p>
              {/if}
            </div>
            <div class="space-x-2">
              <button on:click={() => editClient(client.id)} class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Modifier</button>
              <button on:click={() => deleteClient(client.id)} class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Supprimer</button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  