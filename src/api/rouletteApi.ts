import api from "./axiosConfig";

// Interfaces para la API de ruleta
export interface RouletteSession {
  session_id: number;
  server_seed_hash: string;
}

export interface RouletteSessionHash {
  session_id: number;
  server_seed_hash: string;
}

export interface RouletteSpinRequest {
  client_seed: string;
}

export interface RouletteSpinResponse {
  session_id: number;
  nonce: number;
  pocket: number;
  color: "red" | "black" | "green";
  hmac_hex: string;
  server_seed_hash: string;
}

export interface RouletteBetRequest {
  client_seed: string;
  bet: {
    type: string; // "red", "black", "number", "odd", "even", etc.
    amount: number;
  };
}

export interface RouletteBetResponse {
  success: boolean;
  message?: string;
  balance?: number;
}

// Funciones de la API
export const rouletteApi = {
  /**
   * Crear una nueva sesión de ruleta
   */
  createSession: async (): Promise<RouletteSession> => {
    const response = await api.post<RouletteSession>("/v1/roulette/session");
    return response.data;
  },

  /**
   * Obtener el hash de la sesión
   */
  getSessionHash: async (sessionId: number): Promise<RouletteSessionHash> => {
    const response = await api.get<RouletteSessionHash>(
      `/v1/roulette/session/${sessionId}/hash`
    );
    return response.data;
  },

  /**
   * Girar la ruleta
   */
  spin: async (
    sessionId: number,
    clientSeed: string
  ): Promise<RouletteSpinResponse> => {
    const response = await api.post<RouletteSpinResponse>(
      `/v1/roulette/session/${sessionId}/spin`,
      { client_seed: clientSeed }
    );
    return response.data;
  },

  /**
   * Realizar una apuesta
   */
  placeBet: async (
    sessionId: number,
    betData: RouletteBetRequest
  ): Promise<RouletteBetResponse> => {
    const response = await api.post<RouletteBetResponse>(
      `/v1/roulette/session/${sessionId}/bet`,
      betData
    );
    return response.data;
  },
};

export default rouletteApi;
