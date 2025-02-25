<script lang="ts">
    import { goto } from '$app/navigation';
    
    let email = '';
    let password = '';
    let error = '';
  
    async function login() {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        goto('/profile'); // Redirige vers l'espace membre ou la page d'accueil
      } else {
        error = data.message || 'Erreur lors de la connexion.';
      }
    }
  </script>
  
  <h1 class="text-3xl font-bold mb-4">Connexion</h1>
  {#if error}
    <p class="text-red-500">{error}</p>
  {/if}
  <form on:submit|preventDefault={login} class="space-y-4">
    <div>
      <label class="block">Email:
        <input type="email" bind:value={email} required class="w-full p-2 border rounded"/>
      </label>
    </div>
    <div>
      <label class="block">Mot de passe:
        <input type="password" bind:value={password} required class="w-full p-2 border rounded"/>
      </label>
    </div>
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Se connecter</button>
  </form>
  <p>Vous n'avez pas de compte ? <a href="/auth/register" class="text-blue-500 underline">S'inscrire</a></p>
  