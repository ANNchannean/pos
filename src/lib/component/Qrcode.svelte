<script lang="ts">
	import { Html5Qrcode } from 'html5-qrcode';
	interface Props {
		close_on_success?: boolean;
		redirect?: string;
		value: string | null;
		scan_type: 'qr' | 'br';
	}
	let { value = $bindable(''), close_on_success = true, redirect, scan_type }: Props = $props();
	let id = $state(`id${Math.random().toString(36).substring(2, 9)}`);
	let cameraList: { id: string; label: string }[] = $state([]);
	let deviceId: string = $state('');
	let html5Qrcode = $state<Html5Qrcode | null>(null);
	let qrbox = $derived(
		scan_type === 'qr' ? { width: 250, height: 250 } : { width: 250, height: 170 }
	);
	$effect(() => {
		init();
		return () => {
			html5Qrcode?.clear();
		};
	});
	function init() {
		html5Qrcode = new Html5Qrcode('reader'.concat(id));
	}
	function start(id: string) {
		if (id) {
			html5Qrcode?.start(
				{ deviceId: id },
				{
					fps: 30,
					qrbox: qrbox
				},

				onScanSuccess,
				onScanFailure
			);
		} else {
			html5Qrcode?.start(
				{ facingMode: 'environment' },
				{
					fps: 30,
					qrbox: qrbox
				},
				onScanSuccess,
				onScanFailure
			);
		}
	}
	async function stop() {
		await html5Qrcode?.stop();
		html5Qrcode?.clear();
	}
	async function pause() {
		html5Qrcode?.pause();
	}
	async function resume() {
		html5Qrcode?.resume();
	}

	function onScanSuccess(decodedText: string, decodedResult: {}) {
		// alert(`Code matched = ${decodedText}`);
		// console.log(decodedResult);
		value = decodedText;
		pause();
		if (close_on_success) {
			document.getElementById(id.concat('close'))?.click();
			stop();
			if (redirect) {
				window.location.href = redirect;
			}
		}
	}

	function onScanFailure(error: {}) {
		// console.warn(`Code scan error = ${error}`);
	}
	const getCameras = () => {
		Html5Qrcode.getCameras()
			.then((devices) => {
				/**
				 * devices would be an array of objects of type:
				 * { id: "id", label: "label" }
				 */
				// console.info(devices);
				if (devices && devices.length) {
					cameraList = devices;
				}
			})
			.catch((err) => {
				console.error(err);
				cameraList = [];
			});
	};

	const scanFile = (e: Event) => {
		const input = e.target as HTMLInputElement;
		if (!input.files?.length) {
			return;
		}
		const file = input.files[0];
		html5Qrcode
			?.scanFile(file, /* showImage= */ true)
			.then((qrCodeMessage) => {
				// success, use qrCodeMessage
				console.log(qrCodeMessage);
				value = qrCodeMessage;
				if (redirect) {
					window.location.href = redirect;
				}
				html5Qrcode?.clear();
			})
			.catch((err) => {
				// failure, handle it.
				console.log(`Error scanning file. Reason: ${err}`);
			});
	};
	$effect(() => {
		document.onkeydown = (e) => {
			if (e.key === 'Enter') {
				resume();
			}
		};
	});
</script>

<div class="btn-group me-2" role="group" aria-label="First group">
	<button
		aria-label="openmodalscan"
		onclick={() => {
			start(deviceId);
			getCameras();
		}}
		type="button"
		class="btn btn-warning"
		data-bs-dismiss="modal"
		data-bs-toggle="modal"
		data-bs-target={'#'.concat(id)}
	>
		<i class="fa-solid fa-barcode"></i>
	</button>
	<button
		aria-label="uploadfilesccan"
		onclick={() => document.getElementById('qrcode_file')?.click()}
		type="button"
		class="btn btn-outline-warning"><i class="fa-solid fa-upload"></i></button
	>
</div>
<input id="qrcode_file" hidden type="file" accept="image/*" onchange={scanFile} />
<!-- Button trigger modal -->

<!-- Modal -->
<div
	class="modal fade"
	{id}
	aria-hidden="true"
	data-bs-backdrop="static"
	aria-labelledby="exampleModalToggleLabel2"
	tabindex="-1"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-body">
				{#if cameraList.length > 1}
					<div class="input-group mb-2">
						<select class="form-control" onchange={stop} bind:value={deviceId} name="camera" id="">
							<option value="">Default</option>
							{#each cameraList as item}
								<option selected={deviceId === item.id} value={item.id} data-key={item.id}>
									{item.label}
								</option>
							{/each}
						</select>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
						<label
							role="button"
							class="input-group-text"
							onclick={() => {
								start(deviceId);
							}}><i class="fa-solid fa-arrows-spin"></i></label
						>
					</div>
				{/if}

				<main style="min-height: 350px;" class="img-thumbnail">
					<div id={'reader'.concat(id)}></div>
				</main>
				<!-- <button onclick={scanLocalFile} >Scan local file</button> -->
			</div>
			<div class="modal-footer flex-nowrap p-0">
				<button
					id={id.concat('close')}
					onclick={stop}
					type="button"
					class=" btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end"
					data-bs-dismiss="modal">បិទ</button
				>
				<button
					onclick={resume}
					disabled={value === ''}
					type="button"
					class="btn btn-lg btn-link fs-6 text-decoration-none text-danger col-6 py-3 m-0 rounded-0"
				>
					<strong>រក្សាទុក</strong>
				</button>
			</div>
		</div>
	</div>
</div>
