<script lang="ts">
	import Form from './Form.svelte';

	interface Props {
		children?: import('svelte').Snippet;
		class?: string;
		name?: string;
		action: string;
	}
	let { children, class: className = 'btn btn-danger', name = 'លុប', action }: Props = $props();
</script>

<Form method="post" {action}>
	<button
		onclick={(e) =>
			confirm('ទិន្ន័យនឹងត្រូវលុបជារៀងរហូត!') ? e.currentTarget.form?.requestSubmit() : undefined}
		class={className}
		type="button"
		><i class="fa-solid fa-trash"></i> {name}
	</button>
	{@render children?.()}
</Form>
