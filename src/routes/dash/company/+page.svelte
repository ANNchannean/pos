<script lang="ts">
	import CropImage from '$lib/component/CropImage.svelte';
	import Form from '$lib/component/Form.svelte';
	import { store } from '$lib/store/store.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let { get_company } = $derived(data);
	let loading = $state(false);
	let edit = $state(false);
</script>

<Form
	reset={false}
	method="post"
	action="?/create"
	bind:loading
	fnSuccess={() => (edit = false)}
	enctype="multipart/form-data"
	class="card"
>
	<input type="hidden" name="id" value={get_company?.id || ''} />
	<input type="hidden" name="logo" value={get_company?.logo || ''} />

	<div class="card-header">
		{#if !edit}
			<button
				aria-label="submit"
				type="button"
				onclick={() => (edit = !edit)}
				class="float-right btn btn-outline-primary btn-lg"><i class="fa-solid fa-pen"></i></button
			>
		{/if}
		{#if edit}
			<button aria-label="submit" type="submit" class="float-right btn btn-primary btn-lg"
				><i class="fa-solid fa-floppy-disk"></i></button
			>
		{/if}
	</div>
	<fieldset disabled={!edit}>
		<div class="card-body">
			<section class="invoice border-0">
				<div class="page-header row">
					<div class="col-auto text-center">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

						<img
							onclick={() => document.getElementById('img')?.click()}
							class:border={edit}
							height="170px"
							class="float-right"
							src="/uploads/{get_company?.logo}"
							alt="no logo"
						/>

						<br />
						{#if edit}
							<!-- <input accept="image/*" type="file" name="file" id="file" /> -->
							<CropImage name="file" />
						{/if}
					</div>
					<div class="col text-center">
						<div class="form-floating mb-3">
							<input
								name="name_khmer"
								value={get_company?.name_khmer ?? ''}
								class="form-control text-center"
								type="text"
								id="name_khmer"
								required
								autocomplete="off"
							/>

							<label for="name_khmer">ឈ្មោះក្រុមហ៊ុន (ខ្មែរ)</label>
						</div>
						<div class="form-floating mb-3">
							<input
								name="name_english"
								value={get_company?.name_english ?? ''}
								class="form-control text-center"
								type="text"
								id="name_english"
								required
								autocomplete="off"
							/>

							<label for="name_english">ឈ្មោះក្រុមហ៊ុន (អង់គ្លេស)</label>
						</div>
						<div class="form-floating mb-3">
							<input
								value={get_company?.description ?? ''}
								class="form-control text-center"
								type="text"
								required
								id="description"
								autocomplete="off"
								name="description"
							/>

							<label for="description">ការបរិយាយ</label>
						</div>
						<div class="form-floating mb-3">
							<input
								name="contact"
								value={get_company?.contact ?? ''}
								class="form-control text-center"
								type="text"
								required
								autocomplete="off"
							/>

							<label for="contact">ទំនាក់ទំនង</label>
						</div>
						<div class="form-floating mb-3">
							<input
								value={get_company?.address ?? ''}
								class="form-control text-center"
								type="text"
								required
								autocomplete="off"
								name="address"
							/>

							<label for="address">អាស័យដ្នាន</label>
						</div>
						<div class="form-floating">
							<textarea
								value={get_company?.note ?? ''}
								class="form-control text-center"
								required
								autocomplete="off"
								name="note"
								style="height: 200px;"
							></textarea>
							<label for="note">ចំណាំ</label>
						</div>
					</div>
				</div>
			</section>
		</div>
	</fieldset>
</Form>
