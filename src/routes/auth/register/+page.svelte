<script lang="ts">
    import { goto } from '$app/navigation';
    
    let email = '';
    let password = '';
    let confirmPassword = '';
    let error = '';
  
    async function register() {
      if (password !== confirmPassword) {
        error = "Les mots de passe ne correspondent pas.";
        return;
      }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        goto('/profile'); // Redirige vers l'espace membre ou une page de confirmation
      } else {
        error = data.message || 'Erreur lors de l’inscription.';
      }
    }
  </script>
  
  <h1 class="text-3xl font-bold mb-4">Inscription</h1>
  {#if error}
    <p class="text-red-500">{error}</p>
  {/if}
  <form on:submit|preventDefault={register} class="space-y-4">
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
    <div>
      <label class="block">Confirmer le mot de passe:
        <input type="password" bind:value={confirmPassword} required class="w-full p-2 border rounded"/>
      </label>
    </div>
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">S'inscrire</button>
  </form>
  <p>Vous avez déjà un compte ? <a href="/auth/login" class="text-blue-500 underline">Connectez-vous</a></p>
  