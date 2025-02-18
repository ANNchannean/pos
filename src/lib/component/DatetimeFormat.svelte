<script lang="ts">
	interface Props {
		date: string | null | undefined;
		timeStyle?: boolean;
		dateStyle?: boolean;
	}

	let { date, timeStyle = true, dateStyle = true }: Props = $props();
</script>

{#if date?.length}
	{#if dateStyle}
		{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' })
			.format(new Date(date))
			.replaceAll('/', '-')}
	{/if}
	{#if timeStyle}
		{new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', hour12: true })
			.format(new Date(date))
			.replaceAll('/', '-')
			.replace('am', 'ព្រឹក')
			.replace('pm', 'ល្ងាច')}
	{/if}
{/if}
