<script lang="ts">
	let { colspan, items }: { colspan: number; items: number } = $props();
</script>

{#if items === 0}
	<tr>
		<td {colspan} class="text-center"><i class="fa-regular fa-face-sad-cry"></i> គ្មានទិន្ន័យទេ</td>
	</tr>
{/if}
