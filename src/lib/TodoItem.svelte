<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Todo } from './todo';
	import type { SubmitFunction } from '@sveltejs/kit';
	const dispatch = createEventDispatcher();

	export let todo: Todo;

	const onClose = () => {
		dispatch('close');
	};
</script>

<div class="flex flex-col items-start p-2 bg-slate-100 rounded-xl min-h-full">
	<p class="text-xl font-semibold">{todo.content}</p>
	<div class="flex-1" />

	<div class="flex justify-between w-full">
		<button on:click={onClose} class="p-2">Close</button>

		<form method="post" action="?/deleteToDo">
			<input type="text" name="id" value={todo.id} hidden />
			<button
				class="hover:bg-red-800/5 border border-red-800 text-red-800 transition-colors rounded-md px-2 py-1"
			>
				Delete
			</button>
		</form>
	</div>
</div>
