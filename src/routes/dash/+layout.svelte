<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/state';
	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<nav class="navbar sticky-top navbar-expand-lg bg-body-tertiary">
	<div class="container">
		<a class="navbar-brand" href="/dash"><i class="fa-solid fa-house"></i> ទំព័រដើម </a>
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
					<a
						class:text-warning={page.url.pathname.includes('/dash/product')}
						class="nav-link"
						aria-current="page"
						href="/dash/product"><i class="fa-solid fa-cart-plus"></i> ផលិតផល់</a
					>
				</li>
				<li class="nav-item">
					<a
						class:text-warning={page.url.pathname.includes('/dash/brand')}
						class="nav-link"
						href="/dash/brand"><i class="fa-solid fa-sheet-plastic"></i> ប្រេនទំនិញ</a
					>
				</li>
				<li class="nav-item">
					<a
						class:text-warning={page.url.pathname.includes('/dash/category')}
						class="nav-link"
						href="/dash/category"><i class="fa-solid fa-tags"></i> ប្រភេទទំនិញ</a
					>
				</li>
				<li class="nav-item">
					<a
						class:text-warning={page.url.pathname.includes('/dash/unit')}
						class="nav-link"
						href="/dash/unit"><i class="fa-solid fa-circle-nodes"></i> ខ្នាត</a
					>
				</li>
				<li class="nav-item">
					<a
						class:text-warning={page.url.pathname.includes('/dash/customer')}
						class="nav-link"
						href="/dash/customer"><i class="fa-solid fa-user-group"></i> អតិថិជន</a
					>
				</li>
				<!-- <li class="nav-item dropdown">
					<a
						class="nav-link dropdown-toggle"
						href="#"
						role="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						Dropdown
					</a>
					<ul class="dropdown-menu">
						<li><a class="dropdown-item" href="#">Action</a></li>
						<li><a class="dropdown-item" href="#">Another action</a></li>
						<li><hr class="dropdown-divider" /></li>
						<li><a class="dropdown-item" href="#">Something else here</a></li>
					</ul>
				</li> -->
			</ul>
		</div>
		<!-- <form class="d-flex" role="search">
			<input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
			<button class="btn btn-outline-success" type="submit">Search</button>
		</form> -->
	</div>
</nav>

<div class="container pt-3">
	{@render children()}
</div>
