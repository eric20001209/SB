
		$.plot('#flotBars', [flotBarsData], {
			colors: ['#8CC9E8'],
			series: {
				bars: {
					show: true,
					barWidth: 0.8,
					align: 'center'
				}
			},
			xaxis: {
				mode: 'categories',
				tickLength: 0
			},
			grid: {
				hoverable: true,
				clickable: true,
				borderColor: 'rgba(0,0,0,0.1)',
				borderWidth: 1,
				labelMargin: 15,
				backgroundColor: 'transparent'
			},
			tooltip: true,
			tooltipOpts: {
				content: '%y',
				shifts: {
					x: -10,
					y: 20
				},
				defaultTheme: false
			}
		});
	/*
	Flot: Pie
	*/
	$.plot('#flotPie', flotPieData, {
			series: {
				pie: {
					show: true,
					combine: {
						color: '#999',
						threshold: 0.1
					}
				}
			},
			legend: {
				show: false
			},
			grid: {
				hoverable: true,
				clickable: true
			}
		});
