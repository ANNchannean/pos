<script lang="ts">
	import 'cropperjs/dist/cropper.css';
	import Cropper from 'cropperjs';
	let originalImage = $state('');
	let imageElement: HTMLImageElement | null = $state(null);
	let cropper: any | null = $state(null);
	let croppedImage: string = $state('');
	let sid = $state(`id${Math.random().toString(36).substring(2, 9)}`);
	let fileInput: HTMLInputElement | null = $state(null);
	let originalFileName: string | null = $state(null);
	let { name, submit = false }: { name: string; submit?: boolean } = $props();
	function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			document.getElementById(sid.concat('btn'))?.click();
			originalFileName = file.name;
			const reader = new FileReader();
			reader.onload = (e) => {
				originalImage = e.target?.result as string;
				if (imageElement) {
					imageElement.src = originalImage;
					if (cropper) {
						cropper.destroy();
					}
					cropper = new Cropper(imageElement, {
						aspectRatio: 4 / 4
					});
				}
			};
			reader.readAsDataURL(file);
		}
	}

	function cropImage() {
		if (cropper) {
			croppedImage = cropper.getCroppedCanvas().toDataURL();
			const byteString = atob(croppedImage.split(',')[1]);
			const mimeString = croppedImage?.split(',')[0].split(':')[1].split(';')[0];
			const ab = new ArrayBuffer(byteString.length);
			const ia = new Uint8Array(ab);
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			const blob = new Blob([ab], { type: mimeString });
			const file = new File([blob], originalFileName || 'croppedImage.png', { type: mimeString });
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(file);
			if (fileInput) fileInput.files = dataTransfer.files;
			cropper.destroy();
		}
	}
</script>

<div class="input-group">
	<label for="" class="input-group-text"> ជ្រើសរើសរូបភាព </label>
	<button
		onclick={() => document.getElementById(sid.concat('img'))?.click()}
		aria-label="selectimage"
		class="form-control text-start"
		type="button"
	>
		{originalFileName}
	</button>
	{#if croppedImage && !submit}
		<img class="input-group-text" height="38px" src={croppedImage} alt="" />
	{/if}
</div>

<input
	{name}
	bind:this={fileInput}
	onchange={handleFileChange}
	type="file"
	accept="image/*"
	class="d-none"
	id={sid.concat('img')}
/>

<!-- Button trigger modal -->
<!-- Modal -->
<button
	aria-label="selectimage"
	class="d-none"
	type="button"
	data-bs-toggle="modal"
	data-bs-target={`#${sid}`}
	id={sid.concat('btn')}
>
</button>
<div
	class="modal"
	id={sid}
	data-bs-keyboard="false"
	tabindex="-1"
	aria-labelledby="staticBackdropLabel"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-body">
				<div style="width: 100%;max-height: 460px;overflow: hidden;">
					<!-- svelte-ignore a11y_img_redundant_alt -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<img class="img-fluid" width="100%" src="/no-image.jpg" bind:this={imageElement} alt="" />
				</div>
			</div>
			<div class="modal-footer p-0 m-0">
				<!-- <input
					aria-hidden="true"
					id={sid.concat('img')}
					class="d-none"
					type="file"
					accept="image/*"
					onchange={handleFileChange}
				/> -->
				<button
					aria-label="cropperimage"
					onclick={(e) => {
						cropImage();
						if (submit) {
							e.currentTarget.form?.requestSubmit();
						}
						// submit && e.currentTarget.form?.requestSubmit();
						// if (fileInput) {
						// 	fileInput.value = '';
						// }
						// fileInput?.value && (fileInput.value = '');
					}}
					type="button"
					class="btn btn-light w-100"
					data-bs-dismiss="modal"><i class="fa-solid fa-scissors"></i>...</button
				>
			</div>
		</div>
	</div>
</div>

<!-- <input aria-hidden="true" class="d-none" type="file" bind:this={fileInput} {name} /> -->
