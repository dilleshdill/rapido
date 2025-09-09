// kafka.js
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "ride-service",
  brokers: ["localhost:9092"], // change if Kafka runs elsewhere
});

// Export producer & consumer
export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "ride-group" });

// Function to connect
export const connectKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    console.log("✅ Kafka connected successfully");
  } catch (err) {
    console.error("❌ Kafka connection error:", err.message);
  }
};
