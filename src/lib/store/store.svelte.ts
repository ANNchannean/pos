export interface ProductOrder {
	id: number;
	name: string;
	price: number;
	qty: number;
	amount: number;
	total: number;
	unit_id: number;
	discount: string | null;
}
class Store {
	globalLoading = $state(false);
	inerHight = $state('');
	productOrders: ProductOrder[] = $state([]);
}

export const store = new Store();
