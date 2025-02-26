<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		class?: string;
		name?:string;
	}
	let { children, class: className = 'btn btn-danger',name="លុប" }: Props = $props();
</script>

<button
	onclick={(e) =>
		confirm('ទិន្ន័យនឹងត្រូវលុបជារៀងរហូត!') ? e.currentTarget.form?.requestSubmit() : undefined}
	class={className}
	type="button"
	><i class="fa-solid fa-trash"></i> {name}
</button>
{@render children?.()}
