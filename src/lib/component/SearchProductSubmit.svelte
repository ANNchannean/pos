<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { EventHandler } from 'svelte/elements';
	import Form from './Form.svelte';
	import NoData from './NoData.svelte';
	interface Props {
		items: { name: any; id: any; price: any }[];
		height?: string;
		placeholder?: string;
		children?: import('svelte').Snippet;
		action: string;
		q_name?: string;
	}

	let {
		items,
		height = '300',
		placeholder = 'ស្វែងរក...',
		children,
		action,
		q_name
	}: Props = $props();
	let q = $state('');
	let timeout: number | NodeJS.Timeout;
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout);
		const value = currentTarget?.value;
		if (!value) q = '';
		timeout = setTimeout(() => {
			if (q_name) {
				const newUrl = new URL(page.url);
				newUrl?.searchParams?.set(q_name, currentTarget?.value);
				goto(newUrl, { keepFocus: true, noScroll: true });
			} else {
				q = value;
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
		if (q_name) {
			newUrl?.searchParams?.set(q_name, e);
			goto(newUrl, { keepFocus: true, noScroll: true });
		}
		q = '';
		document.getElementById('dropdown')?.focus();
	}
	$effect(() => {
		if (data?.length === 1) {
			document.getElementById('submit')?.click();
			pushParam('');
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
		name="q"
		autocomplete="off"
		data-bs-toggle="dropdown"
		id="dropdown"
		bind:value={q}
		class="form-control"
		type="text"
		data-bs-auto-close="outsite"
	/>
	<ul style="width: 100%;" class="dropdown-menu">
		<div style=" max-height: {height.concat('px')}; overflow-y: auto;">
			<!-- svelte-ignore a11y_invalid_attribute -->
			{#if data?.length}
				{#each data || [] as item}
					<!-- svelte-ignore a11y_autofocus -->
					<Form
						fnSuccess={() => document.getElementById('dropdown')?.focus()}
						method="post"
						{action}
					>
						<li>
							{@render children?.()}
							<input type="hidden" name="product_id" value={item.id} />
							<input type="hidden" name="price" value={item.price} />
							<button id="submit" type="submit" class="dropdown-item">{item.name ?? ''}</button>
						</li>
					</Form>
				{/each}
			{:else}
				<button type="button" class="dropdown-item">
					<i class="fa-regular fa-face-sad-cry"></i> គ្មានទិន្ន័យទេ
				</button>
			{/if}
		</div>
	</ul>
</div>
