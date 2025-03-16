<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';
	import { page } from '$app/state';
	// import { onNavigate } from '$app/navigation';
	import { store } from '$lib/store/store.svelte';
	// onNavigate((navigation) => {
	// 	if (!document.startViewTransition) return;
	// 	return new Promise((resolve) => {
	// 		document.startViewTransition(async () => {
	// 			resolve();
	// 			await navigation.complete;
	// 		});
	// 	});
	// });
	let { data, children }: { data: LayoutServerData; children: Snippet } = $props();
	let { user } = $derived(data);
	$effect(() => {
		store.inerHight = (window.innerHeight - 160).toString().concat('px');
	});
</script>

<nav class="navbar navbar-default sticky-top navbar-expand-lg bg-body-tertiary">
	<div class="container">
		<!-- <a class="navbar-brand" href="/dash"><i class="fa-solid fa-house"></i> ទំព័រដើម </a> -->
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
			<ul class="navbar-nav">
				<li class="nav-item">
					<a class:text-warning={page.url.pathname === '/dash'} class="nav-link" href="/dash"
						><i class="fa-solid fa-house"></i> ទំព័រដើម
					</a>
				</li>
				<li class="nav-item">
					<a
						class:text-warning={page.url.pathname === '/dash/pos'}
						class="nav-link"
						href="/dash/pos"
						><i class="fa-solid fa-barcode"></i> លក់ទំនិញ
					</a>
				</li>

				<li class="nav-item dropdown">
					<a
						class:text-warning={page.url.pathname.includes('/dash/report/')}
						class="nav-link dropdown-toggle"
						href={'#'}
						role="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						<i class="fa-solid fa-stapler"></i> របាយការណ៌
					</a>
					<ul class="dropdown-menu">
						<li>
							<a
								class="dropdown-item"
								class:text-warning={page.url.pathname.includes('/dash/report/sale')}
								href="/dash/report/sale"><i class="fa-solid fa-comments-dollar"></i> របាយការណ៌លក់</a
							>
						</li>
						<li>
							<a
								class="dropdown-item"
								class:text-warning={page.url.pathname.includes('/dash/report/dept')}
								href="/dash/report/dept"><i class="fa-solid fa-wallet"></i> របាយការណ៌ជំពាក់</a
							>
						</li>
						<li>
							<a
								class="dropdown-item"
								class:text-warning={page.url.pathname.includes('/dash/report/save')}
								href="/dash/report/save"
								><i class="fa-solid fa-file-export"></i> វិក្កយបត្ររក្សាទុក</a
							>
						</li>
					</ul>
				</li>
				<li class="nav-item dropdown">
					<a
						class:text-warning={page.url.pathname.includes('/dash/product') ||
							page.url.pathname.includes('/dash/brand') ||
							page.url.pathname.includes('/dash/category') ||
							page.url.pathname.includes('/dash/unit')}
						class="nav-link dropdown-toggle"
						href={'#'}
						role="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						<i class="fa-solid fa-folder-tree"></i> សារពើភ័ណ្ឌ
					</a>
					<ul class="dropdown-menu">
						<li>
							<a
								class="dropdown-item"
								class:text-warning={page.url.pathname.includes('/dash/inventory')}
								href="/dash/inventory"><i class="fa-solid fa-money-bill-trend-up"></i> ទិញចូល</a
							>
						</li>
						<li>
							<a
								class="dropdown-item"
								class:text-warning={page.url.pathname.includes('/dash/product')}
								href="/dash/product"><i class="fa-solid fa-cart-shopping"></i> ផលិតផល់</a
							>
						</li>
						<li>
							<a
								class="dropdown-item"
								class:text-warning={page.url.pathname.includes('/dash/group-price')}
								href="/dash/group-price"><i class="fa-solid fa-coins"></i> កញ្ចប់តម្លៃ</a
							>
						</li>
						<li>
							<a
								class="dropdown-item"
								class:text-warning={page.url.pathname.includes('/dash/brand')}
								href="/dash/brand"><i class="fa-solid fa-sheet-plastic"></i> ប្រេនទំនិញ</a
							>
						</li>
						<li>
							<a
								class="dropdown-item"
								class:text-warning={page.url.pathname.includes('/dash/category')}
								href="/dash/category"><i class="fa-solid fa-tags"></i> ប្រភេទទំនិញ</a
							>
						</li>
						<li>
							<a
								class="dropdown-item"
								class:text-warning={page.url.pathname.includes('/dash/unit')}
								href="/dash/unit"><i class="fa-solid fa-circle-nodes"></i> ខ្នាត</a
							>
						</li>
					</ul>
				</li>
				<li class="nav-item">
					<a
						class:text-warning={page.url.pathname.includes('/dash/customer')}
						class="nav-link"
						href="/dash/customer"><i class="fa-solid fa-user-group"></i> អតិថិជន</a
					>
				</li>
				<li class="nav-item">
					<a
						class:text-warning={page.url.pathname.includes('/dash/supplier')}
						class="nav-link"
						href="/dash/supplier"><i class="fa-solid fa-address-book"></i> អ្នកផ្គត់ផ្គង់</a
					>
				</li>
				<li class="nav-item">
					<a
						class:text-warning={page.url.pathname.includes('/dash/exspend')}
						class="nav-link"
						href="/dash/exspend"><i class="fa-solid fa-comment-dollar"></i> ការចំណាយ</a
					>
				</li>
			</ul>
		</div>
		<div class="d-flex position-relative dropdown">
			<button
				aria-label="navbardopwdown"
				class="btn btn-warning btn-sm"
				type="button"
				data-bs-toggle="dropdown"
				aria-expanded="false"
				><i class="fas fa-user fa-fw"></i>
				{user?.username}
			</button>
			<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
				<li>
					<a class="dropdown-item" href="/user/create/?user_id={user.id}"
						><i class="fa-regular fa-user"></i> អ្នកប្រើប្រាស់ : {user?.username}</a
					>
				</li>
				<li>
					<a class="dropdown-item" href="/user/create/?user_id={user.id}"
						><i class="fa-solid fa-shield-halved"></i> សិទ្ធជា : {user.role}
					</a>
				</li>
				<li><hr class="dropdown-divider" /></li>
				<li>
					<a data-sveltekit-preload-data="off" class="dropdown-item" href="/auth/logout"
						><i class="fa-solid fa-right-from-bracket"></i> ចាកចេញ</a
					>
				</li>
			</ul>
		</div>
	</div>
</nav>

<main style="min-height: 94vh" class="container-fluid bg-body-tertiary ">
	{#if store.inerHight}
		{@render children?.()}
	{:else}
		<div class="opacity-50" style="text-align:center;margin-top: 40vh;">
			<i class="fa-solid fa-spinner fa-spin fa-2x"></i>
		</div>
	{/if}
</main>
