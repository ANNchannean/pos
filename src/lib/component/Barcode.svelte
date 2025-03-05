<script lang="ts">
	import JsBarcode from 'jsbarcode';

	let { text }: { text: string | null } = $props();
	
	let barcode = $state('');
	$effect(() => {
		if (text && text?.length < 15) {
			const canvas = document.createElement('canvas');
			JsBarcode(canvas, text || '', { format: 'CODE39' });
			barcode = canvas.toDataURL('image/png');
		}
	});
</script>

<img src={barcode} alt="" />
