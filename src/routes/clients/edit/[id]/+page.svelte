<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
  
    let name = '';
    let address = '';
    let phone = '';
    let code_postal = '';
    let city = '';
    let country = '';
  
    const { id } = $page.params;
  
    onMount(async () => {
      const res = await fetch(`/api/clients/${id}`);
      const client = await res.json();
      if (client) {
        name = client.name;
        address = client.address;
        phone = client.phone;
        code_postal = client.code_postal;
        city = client.city;
        country = client.country;
      }
    });
  
    async function saveClient() {
      const clientData = { name, address, phone, code_postal, city, country };
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      if (res.ok) {
        alert('Client mis à jour !');
        goto('/clients');
      } else {
        alert('Erreur lors de la mise à jour du client.');
      }
    }
  </script>
  
  <div class="max-w-2xl mx-auto p-6 bg-white rounded shadow-lg">
    <h1 class="text-3xl font-bold mb-6 text-center">Modifier le Client</h1>
    <form on:submit|preventDefault={saveClient} class="space-y-6">
      <div>
        <label class="block text-gray-700 font-semibold">Nom</label>
        <input type="text" bind:value={name} required class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label class="block text-gray-700 font-semibold">Adresse</label>
        <input type="text" bind:value={address} required class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label class="block text-gray-700 font-semibold">Téléphone (optionnel)</label>
        <input type="text" bind:value={phone} class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-gray-700 font-semibold">Code postal (optionnel)</label>
          <input type="text" bind:value={code_postal} class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold">Ville (optionnel)</label>
          <input type="text" bind:value={city} class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold">Pays (optionnel)</label>
          <input type="text" bind:value={country} class="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>
      <div class="text-center">
        <button type="submit" class="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-md">
          Enregistrer les modifications
        </button>
      </div>
    </form>
  </div>
  