<script lang="ts">
	import { enhance } from '$app/forms';
	import Form from '$lib/component/Form.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let show = $state(false);
</script>

<div class="center">
	<div class="card">
		<div class="card-header">
			<h4 class="card-title text-center"><i class="fa-solid fa-gears"></i> ចូលប្រើប្រព័ន្ធ</h4>
		</div>
		<div class="card-body">
			<Form showToast={false}  action="?/login" method="POST">
				<label for="username">ឈ្មោះអ្នកប្រើប្រព័ន្ធ</label>

				<div class="input-group">
					<label class="input-group-text" for="username"><i class="fa-regular fa-user"></i></label>
					<input type="text" name="username" class="form-control" id="" />
				</div>
				<br />
				<label for="username">ពាក្យសម្ងាត់</label>

				<div class="mb-3 input-group">
					<label class="input-group-text" for="username"><i class="fa-solid fa-lock"></i></label>
					<input type={show ? 'text' : 'password'} name="password" class="form-control" id="" />
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label
						aria-label="Show password"
						onclick={() => (show = !show)}
						class={show ? ' input-group-text' : 'input-group-text'}
					>
						{#if show}
							<i class="fa-regular fa-eye"></i>
						{:else}
							<i class="fa-regular fa-eye-slash"></i>
						{/if}
					</label>
				</div>
				<span class="text-danger p-2">
					{form?.message}
					
				</span>
				<div class="">
					<button class="btn btn-warning float-end btn-block"
						><i class="fa-solid fa-right-to-bracket"></i> ចូលប្រើប្រព័ន្ធ</button
					>
					<button class="btn btn-outline-warning" formaction="?/register"
						><i class="fa-solid fa-fingerprint"></i> បង្កើតគណនីថ្មី</button
					>
				</div>
			</Form>
		</div>
	</div>
</div>

<style>
	.center {
		margin: auto;
		width: 550px;
		padding: 10px;
		margin-top: 10%;
	}
</style>
