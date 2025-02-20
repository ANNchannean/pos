<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	let { q_name = 'q' }: { q_name?: string } = $props();
	let timeout: number | NodeJS.Timeout | null = $state(null);
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout!);
		const form = currentTarget?.form;
		if (!form) return;
		timeout = setTimeout(() => {
			form.requestSubmit();
		}, 400);
	};
</script>

<input
	autocomplete="off"
	oninput={handleQ}
	type="search"
	name={q_name}
	class="form-control"
	placeholder="ស្វែងរក..."
/>
