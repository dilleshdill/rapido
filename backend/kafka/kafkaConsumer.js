// kafkaConsumer.js
import { consumer } from "./kafka.js";

const kafkaConsumer = async (io) => {
  await consumer.subscribe({ topic: "ride-events", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        console.log("📥 Event received from Kafka:", event);

        switch (event.type) {
          case "rideAccepted":
            io.to(event.driverId.toString()).emit("rideConfirmed", event);
            io.to(event.userId.toString()).emit("rideSuccess", event);
            break;

          case "driverLocation":
            io.to(event.driverId.toString()).emit("driverLocation", event);
            io.to(event.userId.toString()).emit("driverLocation", event);
            break;

          case "rideCompleted":
            io.to(event.driverId.toString()).emit("rideCompleted", event);
            io.to(event.userId.toString()).emit("rideCompleted", event);
            break;

          default:
            console.log("⚠️ Unknown event type:", event.type);
        }
      } catch (err) {
        console.error("❌ Kafka Consumer Error:", err.message);
      }
    },
  });
};

export default kafkaConsumer;
