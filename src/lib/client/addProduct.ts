import { store, type ProductOrder } from '$lib/store/store.svelte';
export function addProduct(para: ProductOrder) {
   const product_order = store.productOrders;
   // ប្រសិនបើមានទំនិញបានបញ្ជូលរូចត្រូវបូកបន្ថែម ១
   if (product_order.some((e) => e.id === para.id)) {
      // Function ស្វែងរកទំនិញដែលមានហើយបូក ១បន្ថែម
      const obj = store.productOrders?.find((obj) => obj.id === para.id);
      if (obj) {
         obj.qty = obj.qty + 1;
         obj.amount = +(obj.qty * obj.price).toFixed(2);
         obj.total = obj.discount
            ? +Number(calulatorDiscount(obj.qty, obj.price, obj.discount)).toFixed(2)
            : obj.amount;
      }
   } else {
      product_order.push(para);
   }
}
export function calulatorDiscount(qty: number, price: number, discount: string) {
   if (!qty || !price || !discount) return 0;
   const total = qty * price;
   if (discount.includes('%')) {
      return (total - +(total * (Number(discount.replace('%', '')) / 100))).toFixed(2);
   } else {
      return +(qty * price - Number(discount) * qty).toFixed(2);
   }
}
export function modalDiscount(product_id: number) {
   const discount = (document.getElementById(`discount${product_id}`) as HTMLInputElement)?.value;
   const price = (document.getElementById(`price${product_id}`) as HTMLInputElement)?.value;
   const qty = (document.getElementById(`qty${product_id}`) as HTMLInputElement)?.value;
   const unit_id = (document.getElementById(`unit_id${product_id}`) as HTMLInputElement)?.value;
   const found = store.productOrders.find((e) => e.id === product_id);
   if (found) {
      found.qty = Number(qty);
      found.amount = +(+qty * +price).toFixed(2);
      found.discount = discount;
      found.price = +Number(price).toFixed(2);
      found.unit_id = +unit_id;
      found.total = +(
         discount ? +Number(calulatorDiscount(+qty, +price, discount)) : +found.amount
      ).toFixed(2);
   }
   document.getElementById('close_modal')?.click();
}