import React from 'react';
import './Player.css';
import { GameState } from './machine';
import Item from './Item';

const cellClass = (v: number) =>
  'cell ' + (v === 1 ? 'filled' : v === 0 ? '' : 'error');

function Player(props: GameState) {
  return (
    <main className="player">
      <section className="tetris-grid">
        {props.rendered.map((v, i) => (
          <div className={cellClass(v)} key={i}></div>
        ))}
      </section>
      <section className="stats">
        {Item('Timer', props.timer)}
        {Item('Current shape', props.current?.type)}
        {Item('Next shape', props.next?.type)}
        {Item('Score', props.score)}
        {Item('Dead', props.dead.toString())}
      </section>
    </main>
  );
}

export default Player;
