import React from 'react';
import './App.css';
import './reset.css';
import Game from './Game';
import Viewer from './Viewer';

const modes = ['playing', 'viewing'] as const;
type Mode = typeof modes[number];
interface State {
  mode: Mode;
}

class App extends React.Component<any, State> {
  state: State = { mode: 'viewing' };

  modeMap: { [key in Mode]: React.ReactNode } = {
    viewing: <Viewer />,
    playing: <Game />,
  };
  componentDidMount() {}

  render() {
    return (
      <main className="app">
        <div className="mode-switcher">
          {modes.map((v) => (
            <button
              key={v}
              onClick={() => this.setState({ mode: v })}
              className={v === this.state.mode ? 'active' : ''}
            >
              {v}
            </button>
          ))}
        </div>
        {this.modeMap[this.state.mode]}
      </main>
    );
  }
}

export default App;

// TO IMPLEMENT:
// A 2nd page for viewing a sequence:
// The sequence is loaded initially, and then can be played through with a slider and auto moves if needed
