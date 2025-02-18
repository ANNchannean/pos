export const localFormat = {
	datetime: <T>(date: T) => {
		if (!date) return '';
		const dateObj = new Date(date as string);
		// return moment().format('YYYY-M-D h:mm:ss');
		return new Intl.DateTimeFormat('en-GB', {
			dateStyle: 'short'
		})
			.format(dateObj)
			.split('/')
			.reverse()
			.join('-')
			.concat(' ')
			.concat(new Intl.DateTimeFormat('en-GB', { timeStyle: 'medium' }).format(dateObj));
	},
	date: <T>(date: T) => {
		if (!date) return '';
		const dateObj = new Date(date as string);
		// return moment().format('YYYY-M-D h:mm:ss');
		return new Intl.DateTimeFormat('en-GB', {
			dateStyle: 'short'
		})
			.format(dateObj)
			.split('/')
			.reverse()
			.join('-')
			.concat(' ');
	},
	time: <T>(date: T) => {
		if (!date) return '';
		const dateObj = new Date(date as string);
		// return moment().format('YYYY-M-D h:mm:ss');
		return new Intl.DateTimeFormat('en-GB', {
			timeStyle: 'medium'
		}).format(dateObj);
	}
};
