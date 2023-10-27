<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	let response: Response | null = null;
</script>

<h1>SvelteKit Auth Example</h1>
<p>
	{#if $page.data.session}
		{#if $page.data.session.user?.image}
			<span style="background-image: url('{$page.data.session.user.image}')" class="avatar" />
		{/if}
		<span class="signedInText">
			<small>Signed in as</small><br />
			<strong>{$page.data.session.user?.name ?? 'User'}</strong>
		</span>
		<button on:click={() => signOut()} class="button">Sign out</button>
	{:else}
		<span class="notSignedInText">You are not signed in</span>
		<button on:click={() => signIn()}>Sign In with GitHub</button>
	{/if}
</p>

<button
	on:click={async () => {
		response = await fetch('/api/valorant/newgame', {
			method: 'POST',
			body: JSON.stringify({ bracket_id: '651232ec179a4431b3c7466b' }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}}>Test Submit</button
>

{#if response}
	<p>{JSON.stringify(response)}</p>
{/if}
