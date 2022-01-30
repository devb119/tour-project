export const displayChart = async () => {
  const chart1 = document.getElementById('my-chart').getContext('2d');

  let delayed;

  const res = await fetch('/api/v1/bookings/stats');
  const { data } = await res.json();
  const { thisYear, lastYear, topTour } = data;
  const labels = [];
  const sales = [];
  lastYear.forEach((el) => {
    labels.push(`${el._id}/${el.year}`);
    sales.push(el.sales);
  });
  thisYear.forEach((el) => {
    labels.push(`${el._id}/${el.year}`);
    sales.push(el.sales);
  });

  const tourNames = [];
  const bookingTimes = [];
  topTour.forEach((el) => {
    tourNames.push(el._id.name);
    bookingTimes.push(el.bookingTimes);
  });

  const myChart = new Chart(chart1, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Sales',
          data: sales,
          borderColor: '#55c57a',
          pointBackgroundColor: '#55c57a',
          tension: 0.3,
          // fill: true,
        },
      ],
    },
    options: {
      radius: 5,
      hoverRadius: 10,
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (
            context.type === 'data' &&
            context.mode === 'default' &&
            !delayed
          ) {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      plugins: {
        title: {
          display: false,
          text: 'Sales over last 6 months',
          position: 'bottom',
          font: {
            size: 15,
          },
        },
        legend: {
          display: false,
          position: 'bottom',
        },
      },
    },
  });

  const chart2 = document.getElementById('my-chart-2').getContext('2d');
  const myChart2 = new Chart(chart2, {
    type: 'doughnut',
    data: {
      labels: tourNames,
      datasets: [
        {
          data: bookingTimes,
          backgroundColor: [
            'rgba(139, 218, 143, 1)',
            'rgba(255, 139, 139, 1)',
            'rgba(139, 218, 255, 1)',
            'rgba(255, 209, 139, 1)',
            'rgba(151, 151, 151, 1)',
            'rgba(255, 158, 129, 1)',
          ],
          fill: true,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: false,
          text: 'Best-selling Tours',
          position: 'bottom',
          font: {
            size: 15,
          },
        },
        legend: {
          display: true,
          position: 'bottom',
        },
      },
    },
  });
};
