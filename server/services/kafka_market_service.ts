
import { Kafka } from 'kafkajs';
import { useViemService } from "./viem_service";
import { v4 as uuidv4 } from 'uuid';
import RealEstateMarketABI, {
  REAL_ESTATE_MARKET_ADDRESS,
} from "~~/shared/abi/RealEstateMarketABI";

const TOPICS = {
  BUY_OFFER_DATA_VALIDATED: "buy-offer-data-validated",
  BUY_OFFER_WALLET_FETCHED: "buy-offer-wallet-fetched",
  BUY_OFFER_TRANSACTION_PREPARED: "buy-offer-transaction-prepared",
  BUY_OFFER_TRANSACTION_SIGNED: "buy-offer-transaction-signed",
  BUY_OFFER_TRANSACTION_CONFIRMED: "buy-offer-transaction-confirmed",
  BUY_OFFER_TRANSACTION_LOGGED: "buy-offer-transaction-logged",
  BUY_OFFER_ERROR: "buy-offer-error",
}


const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "nft-marketplace",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"]
});

export const produceMessage = async <T extends Record<string, any>>(topic: string, message: T & { processId?: string }) => {
  const producer = kafka.producer();
  
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ 
        key: message.processId || uuidv4(), 
        value: JSON.stringify(message) 
      }]
    });
    console.log(`Message sent to topic ${topic}`);
  } finally {
    await producer.disconnect();
  }
};

export function useKafkaMarketService() {
  
  const startBuyMarketOffer = async (offerId: string, userId: string) => {
    const processId = uuidv4(); // Generate a process ID to track this purchase flow
    try {
      const { client: chainClient } = useViemService();
      const offer = await chainClient.readContract({
        address: REAL_ESTATE_MARKET_ADDRESS,
        abi: RealEstateMarketABI,
        functionName: 'offers',
        args: [BigInt(offerId)]
      });
      
      const offerValid = offer[3];
      const price = offer[2].toString();
      
      if (!offerValid) {
        throw new Error("Offer is not valid");
      }
      return produceMessage(TOPICS.BUY_OFFER_DATA_VALIDATED, {
        processId,
        offerId: offerId.toString(),
        userId,
        price,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error validating offer:", error);
    
      await produceMessage(TOPICS.BUY_OFFER_ERROR, {
        processId,
        offerId: offerId.toString(),
        userId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  };
  
  

  return { 
    startBuyMarketOffer
  };
}