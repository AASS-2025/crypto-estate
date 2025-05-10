// server/utils/camunda-client.ts
import { Client, ClientConfig } from "camunda-external-task-client-js";

// Define singleton client instance
let clientInstance: Client | null = null;

/**
 * Returns a singleton instance of the Camunda client
 * @returns The Camunda client instance
 */
export function getCamundaClient(): Client {
  if (!clientInstance) {
    const config: ClientConfig = {
      baseUrl: process.env.CAMUNDA_API_URL || "http://localhost:8080/engine-rest",
      asyncResponseTimeout: 10000,
      maxTasks: 10,
    };
    
    clientInstance = new Client(config);
    console.log("Camunda client initialized with baseUrl:", config.baseUrl);
  }
  
  return clientInstance;
}

export function resetCamundaClient(): void {
  clientInstance = null;
}