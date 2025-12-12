import anime from "animejs";
import { useEffect } from "react";
import { GameStages } from "./Global";

const ProgressBarRound = (props: {
  stage: GameStages;
  maxDuration: number;
  currentDuration: number;
}): JSX.Element => {
  useEffect(() => {
    var duration = (props.maxDuration - props.currentDuration) * 1000;
    anime({
      targets: "progress",
      value: [0, 100],
      easing: "linear",
      autoplay: true,
      duration: duration,
    });
  }, [props.stage, props.maxDuration, props.currentDuration]);
  return (
    <div>
      <div className="progressRoundTitle">
        {props.stage === GameStages.PLACE_BET
          ? "PLACE BET"
          : props.stage === GameStages.WINNERS
          ? " WINNERS"
          : "NO MORE BETS"}
      </div>
      <progress className={"linearProgressRounds"} value="0" max="100" />
    </div>
  );
};

export default ProgressBarRound;
