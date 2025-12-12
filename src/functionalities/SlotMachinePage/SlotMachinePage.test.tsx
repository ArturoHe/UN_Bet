import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SlotMachinePage from "./index";
import { slotMachineApi } from "../../api/slotMachineApi";

// Mock de la API
vi.mock("../../api/slotMachineApi", () => ({
  slotMachineApi: {
    createSession: vi.fn(),
    getBalance: vi.fn(),
    spin: vi.fn(),
    getStats: vi.fn(),
  },
}));

// Mock de componentes
vi.mock("../../components/SlotMachine", () => ({
  default: ({ onSpin, isSpinning }: any) => (
    <div>
      <button onClick={onSpin} disabled={isSpinning}>
        Girar
      </button>
      <div>Slot Machine Component</div>
    </div>
  ),
  SYMBOL_VALUES: {
    "🍒": 2,
    "🍋": 3,
    "🍊": 5,
    "🍇": 8,
    "⭐": 15,
    "💎": 25,
    "7️⃣": 50,
  },
}));

vi.mock("../../components/BetSelector", () => ({
  default: ({ onBetChange }: any) => (
    <div>
      <button onClick={() => onBetChange(50)}>Cambiar Apuesta</button>
    </div>
  ),
}));

vi.mock("../../components/BetModal", () => ({
  default: () => <div>Bet Modal</div>,
}));

vi.mock("../../components/LeftPanel", () => ({
  default: ({ balance, winnings }: any) => (
    <div>
      <div>Balance: {balance}</div>
      <div>Winnings: {winnings}</div>
    </div>
  ),
}));

describe("SlotMachinePage - Backend Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería inicializar la sesión y cargar el saldo al montar", async () => {
    const mockSession = { session_id: 123, server_seed_hash: "abc123" };
    const mockBalance = { saldo: 1000 };

    (slotMachineApi.createSession as any).mockResolvedValue(mockSession);
    (slotMachineApi.getBalance as any).mockResolvedValue(mockBalance);

    render(<SlotMachinePage title="Test Slot Machine" />);

    // Verificar que muestra loading
    expect(screen.getByText("Cargando juego...")).toBeInTheDocument();

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.queryByText("Cargando juego...")).not.toBeInTheDocument();
    });

    // Verificar que se llamaron las APIs
    expect(slotMachineApi.createSession).toHaveBeenCalledTimes(1);
    expect(slotMachineApi.getBalance).toHaveBeenCalledTimes(1);

    // Verificar que se muestra el saldo
    expect(screen.getByText("Balance: 1000")).toBeInTheDocument();
  });

  it("debería realizar un giro y actualizar el saldo", async () => {
    const mockSession = { session_id: 123, server_seed_hash: "abc123" };
    const mockBalance = { saldo: 1000 };
    const mockSpinResponse = {
      session_id: 123,
      nonce: 1,
      result: [0, 0, 0], // Triple cereza
      symbols: ["🍒", "🍒", "🍒"],
      win_amount: 40, // Apuesta 20 * multiplicador 2 = 40
      multiplier: 2,
      hmac_hex: "def456",
      server_seed_hash: "abc123",
    };

    (slotMachineApi.createSession as any).mockResolvedValue(mockSession);
    (slotMachineApi.getBalance as any).mockResolvedValue(mockBalance);
    (slotMachineApi.spin as any).mockResolvedValue(mockSpinResponse);

    render(<SlotMachinePage title="Test Slot Machine" />);

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.queryByText("Cargando juego...")).not.toBeInTheDocument();
    });

    const user = userEvent.setup();
    const spinButton = screen.getByText("Girar");

    // Realizar un giro
    await user.click(spinButton);

    // Verificar que se llamó a la API de spin
    await waitFor(() => {
      expect(slotMachineApi.spin).toHaveBeenCalledWith(
        123,
        expect.any(String), // client_seed
        20 // bet_amount
      );
    });

    // El saldo debería actualizarse: 1000 - 20 (apuesta) + 40 (ganancia) = 1020
    await waitFor(() => {
      expect(screen.getByText("Balance: 1020")).toBeInTheDocument();
    });
  });

  it("debería mostrar error si el saldo es insuficiente", async () => {
    const mockSession = { session_id: 123, server_seed_hash: "abc123" };
    const mockBalance = { saldo: 10 }; // Saldo menor que la apuesta mínima

    (slotMachineApi.createSession as any).mockResolvedValue(mockSession);
    (slotMachineApi.getBalance as any).mockResolvedValue(mockBalance);

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<SlotMachinePage title="Test Slot Machine" />);

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.queryByText("Cargando juego...")).not.toBeInTheDocument();
    });

    const user = userEvent.setup();
    const spinButton = screen.getByText("Girar");

    // Intentar girar
    await user.click(spinButton);

    // Verificar que se muestra alerta
    expect(alertMock).toHaveBeenCalledWith(
      "Saldo insuficiente para realizar esta apuesta"
    );

    // Verificar que NO se llamó a la API de spin
    expect(slotMachineApi.spin).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  it("debería manejar errores de red correctamente", async () => {
    const mockSession = { session_id: 123, server_seed_hash: "abc123" };
    const mockBalance = { saldo: 1000 };

    (slotMachineApi.createSession as any).mockResolvedValue(mockSession);
    (slotMachineApi.getBalance as any).mockResolvedValue(mockBalance);
    (slotMachineApi.spin as any).mockRejectedValue(new Error("Network error"));

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<SlotMachinePage title="Test Slot Machine" />);

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.queryByText("Cargando juego...")).not.toBeInTheDocument();
    });

    const user = userEvent.setup();
    const spinButton = screen.getByText("Girar");

    // Intentar girar
    await user.click(spinButton);

    // Verificar que se muestra alerta de error
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "Error al procesar la apuesta. Por favor, intenta de nuevo."
      );
    });

    alertMock.mockRestore();
  });

  it("debería actualizar la apuesta cuando el usuario la cambia", async () => {
    const mockSession = { session_id: 123, server_seed_hash: "abc123" };
    const mockBalance = { saldo: 1000 };

    (slotMachineApi.createSession as any).mockResolvedValue(mockSession);
    (slotMachineApi.getBalance as any).mockResolvedValue(mockBalance);

    render(<SlotMachinePage title="Test Slot Machine" />);

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.queryByText("Cargando juego...")).not.toBeInTheDocument();
    });

    // Verificar apuesta inicial
    expect(screen.getByText(/Apuesta actual: \$20/)).toBeInTheDocument();

    const user = userEvent.setup();
    const changeBetButton = screen.getByText("Cambiar Apuesta");

    // Cambiar apuesta
    await user.click(changeBetButton);

    // Verificar que se actualiza la apuesta
    expect(screen.getByText(/Apuesta actual: \$50/)).toBeInTheDocument();
  });
});
