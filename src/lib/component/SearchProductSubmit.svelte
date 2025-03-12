<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	interface Props {
		items: { name: any; id: any }[];
		height?: string;
		placeholder?: string;
		name: string;
		q_name?: string;
	}

	let {
		items,
		height = '300',
		placeholder = 'ស្វែងរក...',
		q_name = $bindable(''),
		name
	}: Props = $props();
	let timeout: number | NodeJS.Timeout;
	let q = $state('');
	const handleQ = () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			const newUrl = new URL(page.url);
			newUrl?.searchParams?.set(q_name, q);
			goto(newUrl, { keepFocus: true, noScroll: true });
		}, 400);
	};
	let data = $derived(items);
	function pushParam(param: string | undefined, e: string) {
		const newUrl = new URL(page.url);
		if (param) {
			newUrl?.searchParams?.set(param, e);
			goto(newUrl, { keepFocus: true, noScroll: true });
		}

		document.getElementById('dropdown')?.focus();
	}
	$effect(() => {
		if (data?.length === 1) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				pushParam(name, data[0].id);
				q = '';
				handleQ();
			}, 400);
		}
	});
	
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	onclick={(e) => {
		e.stopPropagation();
	}}
	class="dropdown form-control m-0 p-0 shadow-none border-0"
>
	<!-- svelte-ignore a11y_autofocus -->
	<input
		oninput={handleQ}
		{placeholder}
		bind:value={q}
		autocomplete="off"
		data-bs-toggle="dropdown"
		id="dropdown"
		class="form-control"
		type="text"
		data-bs-auto-close="outsite"
	/>
	<ul style="width: 100%;" class="dropdown-menu">
		<div style=" max-height: {height.concat('px')}; overflow-y: auto;">
			<!-- svelte-ignore a11y_invalid_attribute -->
			{#if data?.length}
				{#each data || [] as item (item.id)}
					<!-- svelte-ignore a11y_autofocus -->

					<li>
						<button
							onclick={() => {
								pushParam(name, item.id);
								q = '';
								handleQ();
							}}
							id="submit"
							type="button"
							class="dropdown-item">{item.name ?? ''}</button
						>
					</li>
				{/each}
			{:else}
				<button type="button" class="dropdown-item">
					<i class="fa-regular fa-face-sad-cry"></i> គ្មានទិន្ន័យទេ
				</button>
			{/if}
		</div>
	</ul>
</div>
