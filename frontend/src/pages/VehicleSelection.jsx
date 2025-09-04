import React from 'react'
import bike1 from "../assets/bike1.jpg";

const VehicleSelection = () => {
  return (
    <div className="flex h-screen w-screen">
        <div>
            <p>Select Service</p>
            <div className='flex gap-4 justify-center items-center'>
                <img src={bike1} alt="bike" className="h-10 w-15" />

            </div>
        </div>
    </div>
  )
}
export default VehicleSelection;