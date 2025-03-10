<script lang="ts">
	import { enhance } from '$app/forms';
	import type { FormEventHandler } from 'svelte/elements';
	interface Props {
		children: import('svelte').Snippet;
		class?: string;
		method?: 'GET' | 'POST' | 'get' | 'post';
		enctype?: 'multipart/form-data' | 'text/plain' | 'application/x-www-form-urlencoded';
		loading?: boolean;
		reset?: boolean;
		action?: string;
		showToast?: boolean;
		fnSuccess?: () => void;
		fnError?: () => void;
		onchange?: FormEventHandler<HTMLFormElement> | null | undefined;
		data_sveltekit_keepfocus?: boolean;
		data_sveltekit_noscroll?: boolean;
	}
	let {
		children,
		class: className,
		method = 'GET',
		enctype = 'application/x-www-form-urlencoded',
		loading = $bindable(),
		showToast = true,
		reset = true,
		action,
		fnSuccess,
		fnError,
		onchange,
		data_sveltekit_keepfocus = false,
		data_sveltekit_noscroll = false
	}: Props = $props();
</script>

<fieldset disabled={loading}>
	<form
		data-sveltekit-keepfocus={data_sveltekit_keepfocus}
		data-sveltekit-noscroll={data_sveltekit_noscroll}
		{onchange}
		{action}
		{method}
		{enctype}
		class={className}
		use:enhance={() => {
			loading = true;
			return async ({ update, result }) => {
				await update({ reset: reset });
				loading = false;
				if (result.type === 'failure') {
					fnError?.();
				}
				if (result.type === 'success' || result.type === 'redirect') {
					fnSuccess?.();
				}
				if (showToast) {
					if (result.type === 'failure') {
						new bs5.Toast({
							body: `<i class="fa-solid fa-circle-xmark"></i> ការស្នើរបរាជ័យ`,
							className: 'border-0 bg-danger text-white me-1',
							btnCloseWhite: true,
							margin: '60px'
						}).show();
					}
					if (result.type === 'success' || result.type === 'redirect') {
						new bs5.Toast({
							body: `<i class="fa-solid fa-circle-check"></i> ការស្នើរជោគជ័យ`,
							className: 'border-0 bg-success text-white me-1',
							btnCloseWhite: true,
							margin: '60px'
						}).show();
					}
				}
			};
		}}
	>
		{@render children?.()}
	</form>
</fieldset>
