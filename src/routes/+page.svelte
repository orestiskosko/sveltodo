<script lang="ts">
</script>

<svelte:head>
	<title>TODOs Login</title>
</svelte:head>

<div class="container mx-auto h-screen flex items-center justify-center">
	<form method="post" action="?/login" class="w-1/3 flex flex-col space-y-2 p-4 items-center">
		<input name="email" placeholder="Enter your email" class="w-full p-2 text-slate-700" />
		<button type="submit" class="border px-4 py-2 rounded-md">Get magic link</button>
	</form>
</div>
