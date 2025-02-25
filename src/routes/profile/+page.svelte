<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    let user = {
      email: '',
      avatar: '',
      billing: {
        rib: '',
        nomPrenom: '',
        siret: '',
        adresse: ''
      }
    };
  
    onMount(async () => {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        user = await res.json();
      }
    });
  
    async function saveProfile() {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (res.ok) {
        alert('Profil mis à jour');
        goto('/profile');
      } else {
        alert('Erreur lors de la mise à jour');
      }
    }
  </script>
  
  <h1 class="text-3xl font-bold mb-4">Mon Profil</h1>
  <form on:submit|preventDefault={saveProfile} class="space-y-4">
    <div>
      <label class="block">Email: {user.email}</label>
    </div>
    <div>
      <label class="block">
        Avatar (URL):
        <input type="text" bind:value={user.avatar} placeholder="URL de l'avatar" class="w-full p-2 border rounded" />
      </label>
    </div>
    <fieldset class="border p-4 rounded">
      <legend class="font-semibold">Données de facturation</legend>
      <label class="block mt-2">
        RIB:
        <input type="text" bind:value={user.billing.rib} class="w-full p-2 border rounded" />
      </label>
      <label class="block mt-2">
        Nom/Prénom:
        <input type="text" bind:value={user.billing.nomPrenom} class="w-full p-2 border rounded" />
      </label>
      <label class="block mt-2">
        Numéro SIRET:
        <input type="text" bind:value={user.billing.siret} class="w-full p-2 border rounded" />
      </label>
      <label class="block mt-2">
        Adresse postale:
        <input type="text" bind:value={user.billing.adresse} class="w-full p-2 border rounded" />
      </label>
    </fieldset>
    <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Enregistrer</button>
  </form>
  