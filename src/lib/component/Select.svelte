<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { EventHandler } from 'svelte/elements';
	import NoData from './NoData.svelte';
	interface Props {
		items: { name: any; id: any }[];
		name?: string;
		displayName?: string;
		value?: any;
		height?: string;
		action?: string;
		selectType?: 'form' | 'submit' | 'param';
		q_name?: string;
		children?: import('svelte').Snippet;
	}
	let {
		items,
		name = '',
		displayName = 'Select',
		value = $bindable(''),
		q_name = '',
		height = '300',
		action = '',
		selectType = 'form',
		children
	}: Props = $props();
	let timeout: number | NodeJS.Timeout;
	let q = $state('');
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
	let data = $derived(
		items.filter((el) => el.name?.toLowerCase().includes(q.toLowerCase())).slice(0, 200)
	);
	function pushParam(e: string) {
		const newUrl = new URL(page.url);
		newUrl?.searchParams?.set(name, e);
		goto(newUrl, { keepFocus: true, noScroll: true });
	}
	$effect(() => {
		if (value === 0 || value === '0') {
			value = null;
		}
	});
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
				: displayName}
		</span>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		{#if selectType === 'submit'}
			<span
				onclick={(e) => {
					e.stopPropagation();
					document.getElementById(name)?.focus();
					value = null;
					// document.getElementById('submit_selected')?.click();
				}}
				class="float-end"
			>
				<i class="fa-solid fa-xmark"></i></span
			>
		{:else if selectType === 'form'}
			<span
				onclick={(e) => {
					e.stopPropagation();
					document.getElementById(name)?.focus();
					value = null;
				}}
				class="float-end"
			>
				<i class="fa-solid fa-xmark"></i></span
			>
		{:else if selectType === 'param'}
			<span
				onclick={(e) => {
					e.stopPropagation();
					document.getElementById(name)?.focus();
					value = null;
					pushParam('');
				}}
				class="float-end"
			>
				<i class="fa-solid fa-xmark"></i></span
			>
		{/if}
	</button>

	<div style="width: 100%;" class="dropdown-menu">
		<div class="px-2 pb-2">
			<input id={name} oninput={handleQ} class="form-control" type="search" />
		</div>

		<div style=" max-height: {height.concat('px')}; overflow-y: auto;">
			<!-- svelte-ignore a11y_invalid_attribute -->
			<div class="text-decoration-none">
				{#each data as item}
					{#if selectType === 'submit'}
						<form {action} method="post">
							<input type="hidden" value={item.id} {name} />
							{@render children?.()}
							<button
								type="submit"
								class:active={item.id === items.find((e) => e.id === value)?.id}
								class="dropdown-item"
								onclick={() => {
									value = item.id;
								}}
							>
								{item.name}
							</button>
						</form>
					{:else if selectType === 'form'}
						<button
							type="button"
							class:active={item.id === items.find((e) => e.id === value)?.id}
							onclick={(e) => {
								e.preventDefault();
								if (value === item.id) {
									value = null;
								} else {
									value = item.id;
								}
							}}
							class="dropdown-item"
						>
							{item.name}
						</button>
					{:else if selectType === 'param'}
						<button
							type="button"
							class:active={item.id === items.find((e) => e.id === value)?.id}
							onclick={(e) => {
								e.preventDefault();
								if (value === item.id) {
									value = null;
									pushParam('');
								} else {
									value = item.id;
									pushParam(item.id);
								}
							}}
							class="dropdown-item"
						>
							{item.name}
						</button>
					{/if}
				{/each}
				{#if data.length === 0}
					<button type="button" class="dropdown-item">
						<i class="fa-solid fa-magnifying-glass"></i>
						<i class="fa-regular fa-face-sad-cry"></i> គ្មានទិន្ន័យទេ
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
<!-- {#if selectType === 'submit'}
	<div class="d-none">
		<form
			use:enhance={() => {
				store.globalLoading = true;
				return async ({ update }) => {
					await update();
					store.globalLoading = false;
				};
			}}
			{action}
			method="post"
		>
			<input type="text" value="" {name} />
			<button id="submit_selected" type="submit">p</button>
		</form>
	</div>
{/if} -->
