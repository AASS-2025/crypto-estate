import { getCamundaClient } from './camunda-client';
import { Variables, TaskService, Task } from "camunda-external-task-client-js";
import axios from 'axios';
import consola from "consola";
import { useViemService } from "./viem_service";
import RealEstateMarketABI, {
  REAL_ESTATE_MARKET_ADDRESS,
} from "~~/shared/abi/RealEstateMarketABI";
import { createClient } from '@supabase/supabase-js'

const logger = consola.create({
  defaults: {
    tag: "camunda_market_service",
  },
});

export const createDirectServiceClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

export function useCamundaMarketService() {
  const config = useRuntimeConfig();
  const camundaApiUrl = config.public.camundaApiUrl || 'http://localhost:8080/engine-rest';
  
  const initializeCamundaTaskHandlers = () => {
    logger.info("Initializing Camunda task handlers...");
    if (!process.server) return;
    const client = getCamundaClient();
    client.subscribe("validateOfferData", async function({ task, taskService }: { task: Task, taskService: TaskService }) {
      try {
        logger.info("validateOfferData task executing...");
        
        const offerId: string = task.variables.get("offerId");
        const userId: string = task.variables.get("userId");
        
        logger.info(`Validating Offer with offerId: ${offerId})`);
        const { client: chainClient } = useViemService();
        const offer = await chainClient.readContract({
          address: REAL_ESTATE_MARKET_ADDRESS,
          abi : RealEstateMarketABI,
          functionName: 'offers',
          args: [BigInt(offerId)]
        })
        logger.info("Offer data fetched from blockchain:", offer);
        // const offerValid = offer[3];
        const offerValid = true;
        const price = offer[2].toString();

        const processVariables = new Variables();
        processVariables.set("isDataValid", offerValid);
        processVariables.set("price", price);
        await taskService.complete(task, processVariables);
        
        logger.success("NFT validation completed with result:", {
          offerValid,
          price,
        });
      } catch (error) {
        logger.error("Error in NFT validation service:", error);
        if (error instanceof Error) {
          await taskService.handleBpmnError(
            task, 
            "VALIDATION_ERROR",
            `NFT validation failed: ${error.message}`
          );
        }
      }
    });
    return client;
  };
  
  const startBuyOfferProcess = async (
    userId: string,
    offerId: bigint,
  ): Promise<string> => {
    logger.info("Starting BuyOfferProcess", {
      userId,
      offerId,
    });
    
    try {
      const response = await axios.post(`${camundaApiUrl}/process-definition/key/buyOfferProcess/start`, {
        variables: {}
      });
      
      logger.success("BuyOfferProcess started", {
        processInstanceId: response.data.id,
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      const taskResponse = await axios.get(`${camundaApiUrl}/task`, {
        params: {
          processInstanceId: response.data.id,
        }
      });

      const taskId = taskResponse.data[0].id;
      logger.info("BuyOfferProcess task found", {
        taskId,
      });

      await axios.post(`${camundaApiUrl}/task/${taskId}/complete`, {
        variables: {
          offerId: {
            value: offerId.toString(),
            type: "string"
          },
          userId: {
            value: userId,
            type: "string"
          },
        }
      })
      return response.data.id;

    } catch (error) {

      logger.error("Failed to start BuyOfferProcess", error);
      throw new Error('Failed to start offer purchase process');
    }
  };
  

  return { 
    initializeCamundaTaskHandlers,
    startBuyOfferProcess, 
  };
}