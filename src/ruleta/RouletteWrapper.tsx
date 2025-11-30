import React from "react";
import Wheel from "./Wheel";
import Board from "./Board";
import { Button } from "@mantine/core";
import {
  Item,
  PlacedChip,
  RouletteWrapperState,
  GameData,
  GameStages,
  ValueType,
} from "./Global";
import { Timer } from "easytimer.js";
import classNames from "classnames";
import rouletteApi from "../api/rouletteApi";

import ProgressBarRound from "./ProgressBar";

// var singleRotation = 0

// var r1 = singleRotation * 0 // 0
// var r2 = singleRotation * 2 // 19.45..

class RouletteWrapper extends React.Component<any, any> {
  rouletteWheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ];

  timer = new Timer();
  numberRef = React.createRef<HTMLInputElement>();
  state: RouletteWrapperState = {
    rouletteData: {
      numbers: this.rouletteWheelNumbers,
    },
    chipsData: {
      selectedChip: null,
      placedChips: new Map(),
    },
    number: {
      next: null,
    },
    winners: [],
    history: [],
    stage: GameStages.PLACE_BET,
    username: "",
    endTime: 0,
    progressCountdown: 0,
    time_remaining: 0,
    sessionId: null,
    serverSeedHash: null,
    clientSeed: this.generateClientSeed(),
    isSpinning: false,
  };
  socketServer: any;
  animateProgress: any;

  blackNumbers = [
    2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35,
  ];

  constructor(props: { username: string }) {
    super(props);

    this.onSpinClick = this.onSpinClick.bind(this);
    this.onChipClick = this.onChipClick.bind(this);
    this.getChipClasses = this.getChipClasses.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.placeBet = this.placeBet.bind(this);
    this.clearBet = this.clearBet.bind(this);
    this.initializeSession = this.initializeSession.bind(this);
    this.handleSpin = this.handleSpin.bind(this);
  }

  // Generar una semilla de cliente aleatoria
  generateClientSeed(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  // Inicializar sesión de ruleta
  async initializeSession() {
    try {
      const session = await rouletteApi.createSession();
      this.setState({
        sessionId: session.session_id,
        serverSeedHash: session.server_seed_hash,
      });
      console.log("Sesión de ruleta creada:", session);
    } catch (error) {
      console.error("Error al crear sesión de ruleta:", error);
    }
  }

  // Manejar el giro de la ruleta
  async handleSpin() {
    if (!this.state.sessionId || this.state.isSpinning) {
      console.warn("No hay sesión activa o ya está girando");
      return;
    }

    this.setState({ isSpinning: true, stage: GameStages.NO_MORE_BETS });

    try {
      const spinResult = await rouletteApi.spin(
        this.state.sessionId,
        this.state.clientSeed
      );

      // Actualizar el historial
      const newHistory = [spinResult.pocket, ...this.state.history].slice(
        0,
        10
      );

      // Actualizar el estado con el resultado
      this.setState({
        number: { next: spinResult.pocket.toString() },
        history: newHistory,
        isSpinning: false,
        stage: GameStages.WINNERS,
        clientSeed: this.generateClientSeed(), // Nueva semilla para el próximo giro
      });

      console.log("Resultado del giro:", spinResult);

      // Después de 5 segundos, volver a la etapa de apuestas
      setTimeout(() => {
        this.setState({ stage: GameStages.PLACE_BET });
      }, 5000);
    } catch (error) {
      console.error("Error al girar la ruleta:", error);
      this.setState({ isSpinning: false, stage: GameStages.PLACE_BET });
    }
  }

  async componentDidMount() {
    console.log("RouletteWrapper montado");
    await this.initializeSession();
  }
  componentWillUnmount() {
    // TODO: Cerrar conexión de socket cuando esté inicializado
    // this.socketServer.close();
  }
  setGameData(gameData: GameData) {
    if (gameData.stage === GameStages.NO_MORE_BETS) {
      // PLACE BET from 25 to 35
      var endTime = 35;
      var nextNumber = gameData.value;
      this.setState({
        endTime: endTime,
        progressCountdown: endTime - gameData.time_remaining,
        number: { next: nextNumber },
        stage: gameData.stage,
        time_remaining: gameData.time_remaining,
      });
    } else if (gameData.stage === GameStages.WINNERS) {
      // PLACE BET from 35 to 59
      var endTime = 59;
      if (gameData.wins.length > 0) {
        this.setState({
          endTime: endTime,
          progressCountdown: endTime - gameData.time_remaining,
          winners: gameData.wins,
          stage: gameData.stage,
          time_remaining: gameData.time_remaining,
          history: gameData.history,
        });
      } else {
        this.setState({
          endTime: endTime,
          progressCountdown: endTime - gameData.time_remaining,
          stage: gameData.stage,
          time_remaining: gameData.time_remaining,
          history: gameData.history,
        });
      }
    } else {
      // PLACE BET from 0 to 25
      var endTime = 25;
      this.setState({
        endTime: endTime,
        progressCountdown: endTime - gameData.time_remaining,
        stage: gameData.stage,
        time_remaining: gameData.time_remaining,
      });
    }
  }

  onCellClick(item: Item) {
    //console.log("----");
    var currentChips = this.state.chipsData.placedChips;

    var chipValue = this.state.chipsData.selectedChip;
    if (chipValue === 0 || chipValue === null) {
      return;
    }
    let currentChip = {} as PlacedChip;
    currentChip.item = item;
    currentChip.sum = chipValue;

    console.log(this.state.chipsData.placedChips);
    console.log(item);
    if (currentChips.get(item) !== undefined) {
      currentChip.sum += currentChips.get(item).sum;
    }

    //console.log(currentChips[item]);
    currentChips.set(item, currentChip);
    this.setState({
      chipsData: {
        selectedChip: this.state.chipsData.selectedChip,
        placedChips: currentChips,
      },
    });
  }
  onChipClick(chip: number | null) {
    if (chip != null) {
      this.setState({
        chipsData: {
          selectedChip: chip,
          placedChips: this.state.chipsData.placedChips,
        },
      });
    }
  }

  getChipClasses(chip: number) {
    var cellClass = classNames({
      chip_selected: chip === this.state.chipsData.selectedChip,
      "chip-100": chip === 100,
      "chip-20": chip === 20,
      "chip-10": chip === 10,
      "chip-5": chip === 5,
    });

    return cellClass;
  }
  onSpinClick() {
    var nextNumber = this.numberRef!.current!.value;
    if (nextNumber != null) {
      this.setState({ number: { next: nextNumber } });
    }
  }

  // Convertir el tipo de apuesta del frontend al formato del backend
  getBetFromItem(item: Item, amount: number): any {
    switch (item.type) {
      case ValueType.NUMBER:
        return {
          type: "straight",
          number: item.value,
          amount: amount,
        };
      case ValueType.RED:
        return {
          type: "color",
          side: "red" as const,
          amount: amount,
        };
      case ValueType.BLACK:
        return {
          type: "color",
          side: "black" as const,
          amount: amount,
        };
      case ValueType.EVEN:
        return {
          type: "odd_even",
          side: "even" as const,
          amount: amount,
        };
      case ValueType.ODD:
        return {
          type: "odd_even",
          side: "odd" as const,
          amount: amount,
        };
      case ValueType.NUMBERS_1_18:
        return {
          type: "low_high",
          side: "low" as const,
          amount: amount,
        };
      case ValueType.NUMBERS_19_36:
        return {
          type: "low_high",
          side: "high" as const,
          amount: amount,
        };
      case ValueType.NUMBERS_1_12:
        return {
          type: "dozen",
          which: 1 as const,
          amount: amount,
        };
      case ValueType.NUMBERS_2_12:
        return {
          type: "dozen",
          which: 2 as const,
          amount: amount,
        };
      case ValueType.NUMBERS_3_12:
        return {
          type: "dozen",
          which: 3 as const,
          amount: amount,
        };
      default:
        return {
          type: "straight",
          number: 0,
          amount: amount,
        };
    }
  }

  async placeBet() {
    if (!this.state.sessionId || this.state.stage !== GameStages.PLACE_BET) {
      console.warn("No se puede apostar en este momento");
      return;
    }

    var placedChipsMap = this.state.chipsData.placedChips;

    if (placedChipsMap.size === 0) {
      console.warn("No hay apuestas para realizar");
      return;
    }

    console.log("=== INICIO DE APUESTAS ===");
    console.log("Total de apuestas a enviar:", placedChipsMap.size);

    try {
      // Procesar cada apuesta
      let apuestaNumero = 1;
      for (let key of Array.from(placedChipsMap.keys())) {
        var chipsPlaced = placedChipsMap.get(key) as PlacedChip;

        const betRequest = {
          client_seed: this.state.clientSeed,
          bet: this.getBetFromItem(chipsPlaced.item, chipsPlaced.sum),
        };

        console.log(`Apuesta #${apuestaNumero}:`, betRequest);

        this.setState({ isSpinning: true, stage: GameStages.NO_MORE_BETS });

        const betResponse = await rouletteApi.placeBet(
          this.state.sessionId,
          betRequest
        );

        console.log(`Respuesta apuesta #${apuestaNumero}:`, betResponse);
        
        // El backend ya devuelve el resultado del giro en la respuesta
        if (betResponse.spin) {
          const spinResult = betResponse.spin;
          
          // Actualizar el historial
          const newHistory = [spinResult.pocket, ...this.state.history].slice(0, 10);

          // Actualizar el estado con el resultado
          this.setState({
            number: { next: spinResult.pocket.toString() },
            history: newHistory,
            isSpinning: false,
            stage: GameStages.WINNERS,
            clientSeed: this.generateClientSeed(), // Nueva semilla para el próximo giro
          });

          console.log("Resultado del giro (desde apuesta):", spinResult);

          // Después de 5 segundos, volver a la etapa de apuestas
          setTimeout(() => {
            this.setState({ stage: GameStages.PLACE_BET });
          }, 5000);
        }
        
        apuestaNumero++;
      }

      console.log("=== FIN DE APUESTAS ===");

      // NO llamar a handleSpin() porque el backend ya devuelve el resultado
      // await this.handleSpin();
    } catch (error) {
      console.error("Error al realizar la apuesta:", error);
      alert("Error al realizar la apuesta. Por favor, intenta de nuevo.");
      this.setState({ isSpinning: false, stage: GameStages.PLACE_BET });
    }
  }

  clearBet() {
    this.setState({
      chipsData: {
        placedChips: new Map(),
      },
    });
  }
  render() {
    return (
      <div>
        <div>
          <table className={"rouletteWheelWrapper"}>
            <tbody>
              <tr>
                <td className={"winnersBoard"}>
                  <div className={"winnerItemHeader hideElementsTest"}>
                    WINNERS
                  </div>
                  {this.state.winners.map((entry, index) => {
                    return (
                      <div className="winnerItem" key={`winner-${index}`}>
                        {index + 1}. {entry.username} won {entry.sum}$
                      </div>
                    );
                  })}
                </td>
                <td>
                  <Wheel
                    rouletteData={this.state.rouletteData}
                    number={this.state.number}
                  />
                </td>
                <td>
                  <div className={"winnerHistory hideElementsTest"}>
                    {this.state.history.map((entry, index) => {
                      if (entry === 0) {
                        return (
                          <div className="green" key={`history-${index}`}>
                            {entry}
                          </div>
                        );
                      } else if (this.blackNumbers.includes(entry)) {
                        return (
                          <div className="black" key={`history-${index}`}>
                            {entry}
                          </div>
                        );
                      } else {
                        return (
                          <div className="red" key={`history-${index}`}>
                            {entry}
                          </div>
                        );
                      }
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Board
            onCellClick={this.onCellClick}
            chipsData={this.state.chipsData}
            rouletteData={this.state.rouletteData}
          />
        </div>
        <div className={"progressBar hideElementsTest"}>
          <ProgressBarRound
            stage={this.state.stage}
            maxDuration={this.state.endTime}
            currentDuration={this.state.time_remaining}
          />
        </div>
        {/* <div>
        <h2>Updated: {this.state.number.next}</h2>
          <input className={"number"} ref={this.numberRef} />
          <button className={"spin"} onClick={this.onSpinClick}>
            Spin
          </button>
        </div> */}
        <div className="roulette-actions hideElementsTest">
          <ul>
            <li>
              <Button
                variant="gradient"
                gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
                size="xl"
                onClick={() => this.clearBet()}
              >
                Clear Bet
              </Button>
            </li>
            <li className={"board-chip"}>
              <div
                key={"chip_100"}
                className={this.getChipClasses(100)}
                onClick={() => this.onChipClick(100)}
              >
                100
              </div>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_20"}>
                <div
                  className={this.getChipClasses(20)}
                  onClick={() => this.onChipClick(20)}
                >
                  20
                </div>
              </span>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_10"}>
                <div
                  className={this.getChipClasses(10)}
                  onClick={() => this.onChipClick(10)}
                >
                  10
                </div>
              </span>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_5"}>
                <div
                  className={this.getChipClasses(5)}
                  onClick={() => this.onChipClick(5)}
                >
                  5
                </div>
              </span>
            </li>
            <li>
              <Button
                disabled={
                  this.state.stage !== GameStages.PLACE_BET ||
                  this.state.isSpinning ||
                  this.state.chipsData.placedChips.size === 0
                }
                variant="gradient"
                gradient={{ from: "orange", to: "red" }}
                size="xl"
                onClick={() => this.placeBet()}
              >
                {this.state.isSpinning ? "Girando..." : "Place Bet & Spin"}
              </Button>
            </li>
            <li style={{ marginLeft: "10px" }}>
              <div style={{ fontSize: "12px", color: "#fff" }}>
                {this.state.sessionId ? (
                  <>
                    <div>Session: {this.state.sessionId}</div>
                    <div
                      style={{
                        fontSize: "10px",
                        wordBreak: "break-all",
                        maxWidth: "200px",
                      }}
                    >
                      Seed: {this.state.clientSeed.substring(0, 20)}...
                    </div>
                  </>
                ) : (
                  <div>Cargando sesión...</div>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default RouletteWrapper;
