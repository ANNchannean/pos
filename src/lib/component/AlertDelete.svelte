<button
	onclick={(e) =>
		confirm('ទិន្ន័យនឹងត្រូវលុប!') ? e.currentTarget.form?.requestSubmit() : undefined}
	class="btn btn-danger"
	type="button"><i class="fa-solid fa-trash"></i> លុប</button
>
