<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { EventHandler } from 'svelte/elements';
	interface Props {
		items: { name: any; id: any }[];
		name?: string;
		placeholder?: string;
		height?: string;
		q_name?: string;
		value?: string | number | null;
	}
	let {
		items,
		name = '',
		placeholder = 'Select',
		q_name = '',
		height = '300',
		value = $bindable('')
	}: Props = $props();
	let timeout: number | NodeJS.Timeout;
	let q = $state('');
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout);
		if (!value) q = '';
		timeout = setTimeout(() => {
			if (q_name) {
				const newUrl = new URL(page.url);
				newUrl?.searchParams?.set(q_name, currentTarget?.value);
				goto(newUrl, { keepFocus: true, noScroll: true });
			} else {
				q = currentTarget.value;
			}
		}, 400);
	};
	let data = $derived.by(() => {
		if (q_name) {
			return items.slice(0, 200);
		}
		if (!q_name) {
			return items.filter((el) => el.name?.toLowerCase().includes(q.toLowerCase())).slice(0, 200);
		}
	});
	function pushParam(e: string) {
		const newUrl = new URL(page.url);
		newUrl?.searchParams?.set(name, e);
		goto(newUrl, { keepFocus: true, noScroll: true });
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	onclick={() => document.getElementById(name)?.focus()}
	class="dropdown form-control m-0 p-0 shadow-none border-0"
>
	<input {value} type="hidden" {name} />
	<button
		type="button"
		onclick={() => (q = '')}
		class="form-control"
		data-bs-toggle="dropdown"
		aria-expanded="false"
	>
		<span class="col-10 text-start text-truncate" style="float:left;">
			{items.find((e) => e.id === value)?.name
				? items.find((e) => e.id === value)?.name
				: placeholder}
		</span>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<span
			onclick={(e) => {
				e.stopPropagation();
				document.getElementById(name)?.focus();
				value = '';
				pushParam('');
			}}
			class="float-end"
		>
			<i class="fa-solid fa-xmark"></i></span
		>
	</button>

	<div style="width: 100%;" class="dropdown-menu">
		<div class="px-2 pb-2">
			<input id={name} oninput={handleQ} class="form-control" type="search" />
		</div>

		<div style=" max-height: {height.concat('px')}; overflow-y: auto;">
			<!-- svelte-ignore a11y_invalid_attribute -->
			<div class="text-decoration-none">
				{#each data || [] as item}
					<button
						type="button"
						class:active={item.id === items.find((e) => e.id === value)?.id}
						onclick={(e) => {
							e.preventDefault();
							value = item.id;
							pushParam(item.id);
						}}
						class="dropdown-item"
					>
						{item.name}
					</button>
				{/each}
				{#if data?.length === 0}
					<button type="button" class="dropdown-item">
						<i class="fa-regular fa-face-sad-cry"></i> គ្មានទិន្ន័យទេ
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
