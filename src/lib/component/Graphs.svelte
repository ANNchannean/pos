<script lang="ts">
	import { Chart } from 'chart.js/auto';
	interface Props {
		datasets: {
			label?: string;
			borderColor?: string;
			backgroundColor?: string;
			data: number[];
		}[];
		labels: any[];
		title: string;
		type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';
	}
	let { datasets, labels, title, type = 'line' }: Props = $props();
	let id = $state(`id${Math.random().toString(36).substring(2, 9)}`);
	let chart: Chart | null = $state(null);
	function initCart(datasets: Props['datasets'], labels: Props['labels'], id: string) {
		const ctx = (document?.getElementById(id) as HTMLCanvasElement)?.getContext('2d');
		chart = new Chart(ctx!, {
			type: type,
			data: {
				labels: [...labels],
				datasets: datasets.map((dataset) => ({
					label: dataset.label && dataset.label,
					data: dataset.data,
					borderColor: dataset.borderColor && dataset.borderColor,
					backgroundColor: dataset.backgroundColor && dataset.backgroundColor,
					fill: false,
					hoverOffset: 4,
					tension: 0.1
				}))
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'top'
					},
					title: {
						display: true,
						text: title,

						font: {
							size: 25
						}
					}
				}
			}
		});
	}
	$effect(() => {
		initCart(datasets, labels, id);
		return () => {
			chart?.destroy();
		};
	});
</script>

<canvas {id}></canvas>
