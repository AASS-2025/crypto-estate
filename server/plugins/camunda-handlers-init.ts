// server/plugins/camunda-init.ts
import { useCamundaMarketService } from '../services/camunda_market_service';


export default defineNitroPlugin((nitro) => {  // Add nitro as parameter here
  const { initializeCamundaTaskHandlers } = useCamundaMarketService();
  
  // Initialize Camunda task handlers when server starts
  const client = initializeCamundaTaskHandlers();
  
  // Optionally, you can also handle cleanup when server shuts down
  nitro.hooks.hookOnce('close', () => {
    // Perform any cleanup if needed
    if (client && typeof client.stop === 'function') {
      client.stop();
    }
  });
});