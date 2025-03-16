export interface ProductOrder {
	product_id: number;
	name: string;
	price: number;
	qty: number;
	amount: number;
	total: number;
	type: null | 'set';
	unit_id: number | null;
	discount: string | null;
	subUnit: { unit_id: number | null, name: string | null, price: number | null }[]
}
class Store {
	globalLoading = $state(false);
	inerHight = $state('');
	productOrders: ProductOrder[] = $state([]);
}

export const store = new Store();
