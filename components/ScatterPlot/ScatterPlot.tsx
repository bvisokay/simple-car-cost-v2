// receives list of cars and displays as a scatter plot
// cost on the Y-axis and miles on the x-axis

import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js"
import { Scatter } from "react-chartjs-2"

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

// types
import { CarInList } from "../../lib/types"

interface ScatterPlotProps {
  cars: CarInList[]
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ cars }) => {
  const arrOfCars = cars.map(carObject => {
    return {
      x: carObject.miles,
      y: carObject.price
    }
  })
  const data = {
    labels: cars.map(item => item.description),
    datasets: [
      {
        label: "(Miles, Price)",
        data: arrOfCars,
        backgroundColor: "#007bff"
      }
    ]
  }

  const options = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      /*  x: {
        type: "linear", // Use 'linear' scale for X-axis
        position: "bottom"
      }, */
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div>
      {arrOfCars.length > 1 && (
        <>
          <br />
          <Scatter options={options} data={data} />
          <br />
          <hr />
          <br />
          <br />
        </>
      )}
    </div>
  )
}
export default ScatterPlot
