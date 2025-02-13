<script lang="ts">
	import type { PageData } from './$types';
	import QRCode from 'qrcode';
	let { data }: { data: PageData } = $props();
	async function generateQR(text: string) {
		try {
			// console.log(await QRCode.toDataURL(text));
			return await QRCode.toDataURL(text);
		} catch (err) {
			console.error(err);
		}
	}
	let qr: any = $state('');
</script>

<h1>hello world</h1>
<button onclick={async () => (qr = await generateQR('1334'))} class="btn btn-primary">Test</button>
<img src={qr} alt="" />
