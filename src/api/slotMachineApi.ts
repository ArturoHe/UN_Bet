import api from "./axiosConfig";
import { BalanceResponse } from "./types";

// Interfaces para la API del tragamonedas

export interface SlotMachineSession {
  session_id: number;
  server_seed_hash: string;
}

export interface SlotMachineSessionHash {
  session_id: number;
  server_seed_hash: string;
}

export interface SlotMachineSpinRequest {
  client_seed: string;
  bet_amount: number;
}

export interface SlotMachineSpinResponse {
  session_id: number;
  nonce: number;
  result: number[]; // [índice_símbolo_0, índice_símbolo_1, índice_símbolo_2]
  symbols: string[]; // ['🍒', '🍒', '🍒']
  win_amount: number;
  multiplier: number;
  hmac_hex: string;
  server_seed_hash: string;
}

// Tipos de apuesta del tragamonedas
export type SlotBet = {
  amount: number;
  lines?: number; // Número de líneas a apostar (opcional para expansión futura)
};

export interface SlotMachineBetRequest {
  client_seed: string;
  bet: SlotBet;
}

export interface SlotMachineBetResponse {
  success?: boolean;
  message?: string;
  balance?: number;
  spin?: SlotMachineSpinResponse;
  bet_result?: {
    won: boolean;
    amount: number;
    multiplier: number;
  };
  user?: any;
}

// Funciones de la API
export const slotMachineApi = {
  /**
   * Crear una nueva sesión del tragamonedas
   */
  createSession: async (): Promise<SlotMachineSession> => {
    const response = await api.post<SlotMachineSession>("/v1/slots/session");
    return response.data;
  },

  /**
   * Obtener el hash de la sesión
   */
  getSessionHash: async (
    sessionId: number
  ): Promise<SlotMachineSessionHash> => {
    const response = await api.get<SlotMachineSessionHash>(
      `/v1/slots/session/${sessionId}/hash`
    );
    return response.data;
  },

  /**
   * Girar el tragamonedas (spin)
   */
  spin: async (
    sessionId: number,
    clientSeed: string,
    betAmount: number
  ): Promise<SlotMachineSpinResponse> => {
    const response = await api.post<SlotMachineSpinResponse>(
      `/v1/slots/session/${sessionId}/spin`,
      {
        client_seed: clientSeed,
        bet_amount: betAmount,
      }
    );
    return response.data;
  },

  /**
   * Realizar una apuesta y girar
   */
  placeBet: async (
    sessionId: number,
    betData: SlotMachineBetRequest
  ): Promise<SlotMachineBetResponse> => {
    const token = sessionStorage.getItem("jwtToken");
    const response = await api.post<SlotMachineBetResponse>(
      `/v1/slots/session/${sessionId}/bet`,
      betData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  /**
   * Obtener el saldo del usuario
   */
  getBalance: async (): Promise<BalanceResponse> => {
    const token = sessionStorage.getItem("jwtToken");
    const response = await api.get<BalanceResponse>("/profile/me/saldo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Obtener estadísticas del jugador en slots
   */
  getStats: async (): Promise<{
    total_spins: number;
    total_won: number;
    total_lost: number;
    biggest_win: number;
  }> => {
    const token = sessionStorage.getItem("jwtToken");
    const response = await api.get<{
      total_spins: number;
      total_won: number;
      total_lost: number;
      biggest_win: number;
    }>("/v1/slots/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default slotMachineApi;
