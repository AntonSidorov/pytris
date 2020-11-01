import React from 'react';
import { GameState, makeMove, shape, gameState } from './machine';
import Player from './Player';
const inputToMoveMap: { [key: string]: string } = {
  A: 'M',
  D: 'P',
  E: 'R',
  Q: 'C',
  S: 'D',
  X: 'H',
};

// This Component will be responsible for JUST game input + copying the output sequence.
// There will be a 2nd one replaying it

interface State {
  game: GameState;
  moves: string[];
  timer?: number;
}

class Game extends React.Component<any, State> {
  state: State = {
    game: gameState(),
    moves: [],
  };

  componentDidMount() {
    this.setState({
      timer: setTimeout(this.loop, 100),
    });
  }

  scheduleLoop = () => {
    if (this.state.timer) window.clearTimeout(this.state.timer);
    this.setState({ timer: setTimeout(this.loop, 100) });
  };
  loop = (move = 'N') => {
    if (!this.state.game.next) this.move(shape.toSpawn(shape.next()));
    this.move(move);
    if (!this.state.game.dead) this.scheduleLoop();
  };

  move = (m: string) =>
    this.setState({
      moves: [...this.state.moves, m],
      game: makeMove(this.state.game, m),
    });

  input = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === ' ') {
      this.setState({ game: gameState() });
      return;
    }
    const move = inputToMoveMap[event.key.toUpperCase()];
    if (!move) return;
    this.loop(move);
  };
  render() {
    if (this.state.game.dead) console.log(this.state.game);
    return (
      <section className="game" onKeyDown={this.input} tabIndex={0}>
        {this.state.game.dead && (
          <div className="game-over">
            <h1>You are dead! Press space to restart</h1>
          </div>
        )}
        <Player {...this.state.game}></Player>
        <section className="debug-info">
          {this.state.game.dead && (
            <textarea>{this.state.moves.join(' ')}</textarea>
          )}
        </section>
      </section>
    );
  }
}

export default Game;
