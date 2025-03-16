<script lang="ts">
	import { store, type ProductOrder } from '$lib/store/store.svelte';
	import {  modalDiscount, calulatorDiscount } from '$lib/client/addProduct';
	interface Props<T> {
		product_id: number;
		get_product: T;
	}
	let { product_id, get_product }: Props<any> = $props();
	const product = $derived(store.productOrders.find((e) => e.product_id === product_id));
	let id = $derived('id'.concat(product_id.toString()));
</script>

<tr>
	<td>
		<div>
			<!-- Button trigger modal -->
			<button
				type="button"
				class={product?.type === 'set'
					? 'btn text-success btn-link my-0 py-0 text-start text-decoration-none'
					: 'btn btn-link my-0 py-0 text-start text-decoration-none'}
				data-bs-toggle="modal"
				data-bs-target={'#'.concat(id)}
			>
				{product?.name}
			</button>
			<div
				data-bs-backdrop="static"
				class="modal fade"
				{id}
				tabindex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title fs-5 text-truncate">
								{product?.name}
							</h1>
							<button
								id={"close_modal".concat(id)}
								type="button"
								class="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div class="modal-body">
							<div class="input-group pb-2">
								<label style="width: 120px;" for="" class="input-group-text">បញ្ចុះតម្លៃ</label>
								<input
									oninput={(e) => {
										const value = e.currentTarget.value || '';
										if (!isNaN(+value)) {
										} else {
											if (!value.includes('%')) {
												e.currentTarget.value = value.slice(0, value.length - 1);
												alert('ទិន្ន័យត្រូវតែជាលេខឫមានសញ្ញា % នៅខាងក្រោយ');
											}
										}
									}}
									value={product?.discount}
									type="text"
									name="discount"
									class="form-control"
									id={`discount${product_id}`}
								/>
							</div>
							<div class="input-group pb-2">
								<label style="width: 120px;" for="" class="input-group-text">ខ្នាត</label>
								<input
									value={product?.qty}
									type="number"
									name="qty"
									min="1"
									class="form-control"
									id={`qty${product_id}`}
								/>
								<select
									onchange={(e) => {
										const value = e.currentTarget.value || '';
										if (
											store.productOrders
												.find((e) => e.product_id === product_id)
												?.subUnit.find((e) => e.unit_id === +value)
										) {
											const priceElement = document.getElementById(
												`price${product_id}`
											) as HTMLInputElement | null;
											if (priceElement) {
												priceElement.value =
													store.productOrders
														.find((e) => e.product_id === product_id)
														?.subUnit.find((e) => e.unit_id === +value)
														?.price?.toString() ?? '';
											}
										} else {
											const priceElement = document.getElementById(
												`price${product_id}`
											) as HTMLInputElement | null;
											if (priceElement) {
												priceElement.value = get_product?.price.toString() || '';
											}
										}
									}}
									class="form-control"
									name="unit_id"
									id={`unit_id${product_id}`}
								>
									{#each product?.subUnit || [] as item}
										<option
											selected={item.unit_id ===
											store.productOrders?.find((e) => e.product_id === product_id)?.unit_id
												? true
												: false}
											value={item.unit_id}>{item.name}</option
										>
									{/each}
								</select>
							</div>
							<div class="input-group pb-2">
								<label style="width: 120px;" for="" class="input-group-text">តម្លៃលក់</label>
								<input
									value={product?.price}
									type="number"
									name="price"
									step="any"
									min="1"
									class="form-control"
									id={`price${product_id}`}
								/>
							</div>
							<div class="input-group">
								<label style="width: 120px;" for="" class="input-group-text">តម្លៃរូម</label>

								<div class="form-control">
									<div class="form-check py-0 my-0">
										<input
											onchange={(e) => {
												const a = store.productOrders.find((e) => e.product_id === product_id);
												if (a) a.type = a.type === null ? 'set' : null;
											}}
											class="form-check-input"
											type="checkbox"
											name="type"
											value={product?.type === 'set' ? 'set' : null}
											id={`type${product_id}`}
										/>
										<label class="form-check-label" for={`type${product_id}`}>
											គ្រីសដើម្បីបញ្ជូលក្នុងតម្លៃរូម {store.productOrders.find(
												(e) => e.product_id === product_id
											)?.type}
											{product_id}
										</label>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer float-end">
							<button
								onclick={() => {
									modalDiscount(product_id);
								}}
								type="button"
								class="btn btn-primary"
							>
								រក្សាទុក</button
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</td>
	<td>$ {product?.price} </td>
	<td>
		<input
			onchange={(e) => {
				const value = +e.currentTarget.value as number;
				const found = store.productOrders.find((e) => e.product_id === product?.product_id);
				if (found) {
					found.qty = Number(value);
					found.amount = +(+value * Number(product?.price)).toFixed(2);
					found.total = found.discount
						? +Number(calulatorDiscount(found.qty, found.price, found.discount)).toFixed(2)
						: found.amount;
				}
			}}
			class="form-control py-1"
			style="width: 60px;"
			type="number"
			min="1"
			value={product?.qty}
		/>
	</td>
	<td>$ {product?.total}</td>
	<td>
		<button
			onclick={() => {
				store.productOrders = store.productOrders.filter(
					(e) => e.product_id !== product?.product_id
				);
			}}
			aria-label="delete"
			class="btn btn-link text-decoration-none text-danger"
		>
			<i class="fa-solid fa-trash"></i>
		</button>
	</td>
</tr>
