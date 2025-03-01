<script lang="ts">
	import { goto } from '$app/navigation';
	import { page as page_ } from '$app/state';
	interface Props {
		items: number;
		n: number;
	}

	let page: number = $state(1);
	let limit: number = $state(10);
	let { items, n = $bindable() }: Props = $props();
	let total_page = $derived(Math.ceil(items / limit));
	function pushPage() {
		if (page < 1 || page > total_page) {
			page = 1;
		}
		const newUrl = new URL(page_.url);
		newUrl?.searchParams?.set('page', page.toString());
		newUrl?.searchParams?.set('limit', limit.toString());
		goto(newUrl, { keepFocus: true, noScroll: true });
	}
	$effect(() => {
		n = page === 1 ? 1 : limit * page - limit + 1;
	});
</script>

<fieldset disabled={items < limit}>
	<div class="row">
		<div class="col-12 d-flex justify-content-end">
			<div>
				<button
					aria-label="minus2"
					onclick={() => {
						page = page - 2;
						pushPage();
					}}
					class="btn btn-light align-items-center"><i class="fa-solid fa-angles-left"></i></button
				>
				<button
					aria-label="plus2"
					onclick={() => {
						page = page - 1;
						pushPage();
					}}
					class="btn btn-light align-items-center"><i class="fa-solid fa-angle-left"></i></button
				>
			</div>

			<div class="mx-2">
				<input
					oninput={(e) => {
						page = Number(e.currentTarget.value);
						pushPage();
					}}
					value={page}
					style="width: 70px;"
					type="number"
					class="form-control form-control-sm text-center"
				/>
			</div>
			<div class="align-content-center">
				<!-- <span>{locale.T('of')} / {total_page} {locale.T('page')} </span> -->
			</div>
			<div>
				<button
					aria-label="addpage"
					onclick={() => {
						page = page + 1;
						pushPage();
					}}
					class="btn btn-light"><i class="fa-solid fa-angle-right"></i></button
				>
				<button
					aria-label="adpagetow"
					onclick={() => {
						page = page + 2;
						pushPage();
					}}
					class="btn btn-light"><i class="fa-solid fa-angles-right"></i></button
				>
			</div>
		</div>
	</div>
</fieldset>
