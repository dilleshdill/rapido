// kafkaProducer.js
import { producer } from "./kafka.js";

export const sendKafkaEvent = async (event) => {
  try {
    await producer.send({
      topic: "ride-events",
      messages: [
        {
          key: event.type, // e.g. "rideAccepted"
          value: JSON.stringify(event),
        },
      ],
    });

    console.log(`📤 Event sent to Kafka: ${event.type}`, event);
  } catch (err) {
    console.error("❌ Kafka Producer Error:", err.message);
  }
};
