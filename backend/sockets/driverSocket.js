import pool from "../config/db.js"

const driverSocket = async (io) =>{
    io.on("connection",(socket)=>{
        socket.on("driverId",driverId => {
            
            socket.driverId = driverId
            socket.join(driverId.toString())
            console.log("driver id created",driverId)

        })

        socket.on("rideAccepted",rideId => {
            if (!socket.driverId ){
                return
            }

            const rides = pool.query(`SELECT * FROM rides WHERE id = $1`,[rideId])
            if (rides.rows.length === 0 || rides.rows[0].status !== "pending" ){
                io.to([socket.driverId]).emit("rideUnavilable",rideId)
            }

            pool.query(
                `UPDATE rides SET status=ongoing driver_id = $1 WEHRE id = $2`,[socket.driverId,rideId]
            )

            pool.query(
                `UPDATE driver_rides SET is_avilable=FALSE WHERE driver_id = $1`,[socket.driverId]
            )
            
            console.log("ride confirmed")
            io.to([rides.rows[0].user_id]).socket.emit("rideConfirmed",{
                rideId,
                driverId:socket.driverId
            })
            
        })


        socket.on("rideDeclined",rideId => {
            console.log("ride declined")
            pool.query(
                `UPDATE rides SET status = cancel WHERE id = $1`,[rideId]
            )
        })
    })
}

export default driverSocket