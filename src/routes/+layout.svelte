<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import Nav from '$lib/Nav.svelte';
</script>

<Nav />
{@render children()}
