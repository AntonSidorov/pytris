import React from 'react';
import './Viewer.css';
import { viewMoves, GeneratorState, gameState } from './machine';
import Player from './Player';
import Item from './Item';

interface State {
  sequence?: string;
  game: GeneratorState;
  generator?: ReturnType<typeof viewMoves>;
  moves?: string[];
  playing: boolean;
  playInterval?: number;
}

class Viewer extends React.Component<any, State> {
  state: State = { game: { ...gameState(), move: 'N' }, playing: false };

  sequenceChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    this.setState({ sequence: event.target.value });

  loadSequence = () => {
    if (!this.state.sequence) return;
    this.setState({
      generator: viewMoves(this.state.sequence.split(' ').join('')),
      game: { ...gameState(), move: 'N' },
    });
  };

  iterate = () => {
    // debugger;
    const iterator = this.state.generator?.next();
    if (!iterator) return;
    if (iterator.done) return this.setState({ sequence: iterator.value });
    this.setState({ game: iterator.value });
  };

  play = () => {
    if (this.state.playing) {
      window.clearInterval(this.state.playInterval);
      this.setState({ playing: false });
      return;
    }
    this.setState({ playing: true, playInterval: window.setInterval(this.iterate, 500) });
  };

  render() {
    return (
      <section className="viewer">
        <section className="visualiser">
          <Player {...this.state.game} />
        </section>
        <div className="controls">
          {Item('Move', this.state.game.move)}
          <textarea value={this.state.sequence} onChange={this.sequenceChange}></textarea>
          <button onClick={this.loadSequence}> Load sequence</button>
          <button onClick={this.play}> {this.state.playing ? 'Stop' : 'Play'}</button>
          <button onClick={this.iterate}> Iterate</button>
        </div>
      </section>
    );
  }
}

export default Viewer;
