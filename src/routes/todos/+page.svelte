<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Todo } from '$lib/todo';
	import toast, { Toaster } from 'svelte-french-toast';

	export let data: PageData;
	$: ({ todos, profile, supabase } = data);

	let avatarUrl = '';
	let loading = false;

	const downloadImage = async (path: string) => {
		try {
			const { data, error } = await supabase.storage.from('avatars').download(path);

			if (error) {
				throw error;
			}

			const url = URL.createObjectURL(data);
			avatarUrl = url;
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message);
			}
		}
	};

	const handleSubmit: SubmitFunction = ({ formData, cancel }) => {
		if (!formData.get('content')) {
			cancel();
			return;
		}

		loading = true;

		return async ({ update }) => {
			toast.success('TODO created!');
			await update();
			loading = false;
		};
	};

	const handleUpdate: SubmitFunction = () => {
		loading = true;

		return async ({ formData, result }) => {
			if (result.type === 'success' && formData.get('completed') === 'on')
				toast.success('Congratulations!');

			loading = false;
		};
	};

	const handleDelete: SubmitFunction = ({ formData, cancel }) => {
		if (!formData.get('id')) {
			cancel();
			return;
		}

		loading = true;

		return async ({ update }) => {
			await update();
			loading = false;
		};
	};

	const handleCompleted = (todo: Todo) => {
		const form = document.querySelector(`button[data-todo-id="${todo.id}"]`) as HTMLButtonElement;
		if (form) {
			form.click();
		}
	};

	$: if (profile.avatar_url) downloadImage(profile.avatar_url);
</script>

<svelte:head>
	<title>Todos</title>
</svelte:head>

<Toaster position="bottom-left" />

<div class="relative container mx-auto flex flex-col space-y-4 mt-[10vh] max-w-2xl">
	<div>
		<img src={avatarUrl} alt="AV" class="rounded-full w-32 h-32 mx-auto my-12 object-cover" />
		<div class="flex space-x-4 items-end justify-start mb-4">
			<h1 class="text-2xl font-bold">Today</h1>
			<p class="text-2xl">{new Date().toLocaleDateString()}</p>
		</div>
		<form method="post" action="?/addToDo" use:enhance={handleSubmit} class="flex space-x-2 my-2">
			<input
				type="text"
				name="content"
				placeholder="Add New Todo"
				disabled={loading}
				autofocus
				required
				minlength="2"
				class="flex-1 border rounded-md p-2 dark:bg-slate-800"
			/>
		</form>
	</div>

	<div class="flex space-x-4 max-h-96">
		<div class="flex-1 flex flex-col overflow-y-auto">
			{#each todos as todo}
				<form
					method="post"
					action="?/updateToDo"
					use:enhance={handleUpdate}
					class="group/item flex items-center space-x-4 py-2 px-4 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transtion-all"
				>
					<input type="text" name="id" value={todo.id} hidden />
					<input
						type="checkbox"
						id={'content' + todo.id}
						name="completed"
						checked={todo.completed}
						on:change={() => handleCompleted(todo)}
						class="accent-slate-700 dark:checked:hover:accent-none"
					/>
					<label
						for={'content' + todo.id}
						class="flex-1 group-hover/item:font-semibold transition-all">{todo.content}</label
					>
					<button data-todo-id={todo.id} type="submit" hidden />

					<form method="post" action="?/deleteToDo" use:enhance={handleDelete}>
						<input name="id" value={todo.id} hidden />
						<button
							type="submit"
							title="delete"
							disabled={loading}
							class="group/delete group-hover/item:scale-[1.2] hover:rotate-12 transition-transform p-2 rounded-md"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-5 h-5 text-red-400 group-disabled/delete:text-gray-500"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/>
							</svg>
						</button>
					</form>
				</form>
			{/each}
		</div>
	</div>
</div>
