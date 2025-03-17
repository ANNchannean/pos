<script lang="ts">
	import Barcode from '$lib/component/Barcode.svelte';
	import Graphs from '$lib/component/Graphs.svelte';
	import type { PageServerData } from './$types';
	import QRCode from 'qrcode';
	let { data }: { data: PageServerData } = $props();
	let { count_product, count_user, count_customer, exspend, income } = $derived(data);
</script>

<div class="container">
	<div class="row g-1">
		<div class="col-lg-4 col-md-6 col-sm-12">
			<div class="card text-bg-light">
				<div class="card-body row g-0 justify-content-between">
					<div class="col-auto">
						<div style="font-size: 30px;">បុគ្គលិក</div>
						<div style="font-size: 30px;">{count_user} នាក់</div>
					</div>
					<div class="col-auto text-warning">
						<i class="fa-regular fa-user fa-6x"></i>
					</div>
				</div>
			</div>
		</div>
		<div class="col-lg-4 col-md-6 col-sm-12">
			<div class="card text-bg-light">
				<div class="card-body row g-0 justify-content-between">
					<div class="col-auto">
						<div style="font-size: 30px;">អតិថិជន</div>
						<div style="font-size: 30px;">{count_customer} នាក់</div>
					</div>
					<div class="col-auto text-warning">
						<i class="fa-regular fa-address-card fa-6x"></i>
					</div>
				</div>
			</div>
		</div>
		<div class="col-lg-4 col-md-6 col-sm-12">
			<div class="card text-bg-light">
				<div class="card-body row g-0 justify-content-between">
					<div class="col-auto">
						<div style="font-size: 30px;">ទំនិញ</div>
						<div style="font-size: 30px;">{count_product} មុខ</div>
					</div>
					<div class="col-auto text-warning">
						<i class="fa-solid fa-cart-shopping fa-6x"></i>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div>
		<table class="table table-light">
			<thead class="table-active">
				<tr>
					<th>កាលបរិច្ឋេទ</th>
					<th>ចំណាយ</th>
					<th>ចំណូល</th>
					<th>ចំនេញ / ខាត</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td></td>
					<td>$ {exspend}</td>
					<td>$ {income}</td>
					<td>
						{#if income - exspend < 0}
							ខាត $ {(income - exspend).toString().replace('-', '')}
						{/if}
						{#if income - exspend > 0}
							ចំនេញ $ {(income - exspend).toString().replace('-', '')}
						{/if}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div>
		<h1>ទំនិញលក់ថ្ងៃនេះ</h1>
		<table class="table table-light">
			<thead class="table-active">
				<tr>
					<th>កាលបរិច្ឋេទ</th>
					<th>ចំណាយ</th>
					<th>ចំណូល</th>
					<th>ចំនេញ / ខាត</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td></td>
					<td>$ {exspend}</td>
					<td>$ {income}</td>
					<td>
						{#if income - exspend < 0}
							ខាត $ {(income - exspend).toString().replace('-', '')}
						{/if}
						{#if income - exspend > 0}
							ចំនេញ $ {(income - exspend).toString().replace('-', '')}
						{/if}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
<div class="row g-1">
	<!-- <div class="col-6">
		<Graphs
			type="bar"
			labels={[locale.T('opd'), locale.T('ipd'), locale.T('laboratory'), locale.T('imagerie')]}
			title=""
			datasets={list}
		/>
	</div>
	<div class="col-6">
		<Graphs
			type="pie"
			labels={[locale.T('opd'), locale.T('ipd'), locale.T('laboratory'), locale.T('imagerie')]}
			title=""
			datasets={list}
		/>
	</div> -->
</div>
<!-- 
<Form enctype="multipart/form-data" action="?/test" method="POST">
	<CropImage submit={false} name="file" />
	<input type="hidden" name="id" value={id ?? ''} />
	<input type="time" name="time" bind:value={time} id="" />
	<input type="date" name="date" bind:value={date} id="" />
	<input type="datetime-local" name="datetime" value={datetime} id="" />

	{date} <br />
	{localFormat.date(date).length}
	<button type="submit">Submit</button>
</Form>

<hr />
{#each get_tests as item}
	<Form reset={true} action="?/d_test" method="POST">
		
		<h3 onclick={() => (id === Number(item.id) ? (id = null) : (id = item.id))}>
			<button class="btn btn-sm btn-light fs-3 text-danger" value={item.id} type="submit" name="id"
				>X {item.id ?? ''}</button
			>
			<DateTimeFormat date={item.date} timeStyle={false} />
			<DateTimeFormat date={item.datetime} />
		</h3>
	</Form>
{/each}
<h1 id="one" class="m-0">Dashbaord</h1>
<ol class="breadcrumb float-sm-right">
	<li class="breadcrumb-item"><a href="/">Home</a></li>
	<li class="breadcrumb-item active">Dashboard</li>
</ol>
/> -->
