module.exports = {
  'Airplane': {
    description: 'Bomb the land below without hitting friendly airplanes!',
    controls: {
      B: 'Drop bomb'
    }
  },
  'Breakout (Brix hack) [David Winter, 1997]': {
    description: 'Use the paddle to deflect the ball into all the bricks.',
    controls: {
      S: 'Move paddle left',
      H: 'Move paddle right'
    }
  },
  'Pong (1 player)': {
    description: 'Pong!',
    controls: {
      W: 'Move paddle up',
      S: 'Move paddle down'
    }
  },
  'Pong (alt)': {
    description: 'Pong with a friend!',
    controls: {
      W: 'Move player 1 paddle up',
      S: 'Move player 1 paddle down',
      D: 'Move player 2 paddle up',
      C: 'Move player 2 paddle down',
    }
  },
  'Space Invaders [David Winter] (alt)': {
    description: 'Destroy the space invaders before they destroy you!',
    controls: {
      S: 'Move spaceship left',
      H: 'Move spaceship right',
      SPACEBAR: 'Fire photon torpedos!'
    }
  },
  'Tron': {
    description: 'Face off against your best friend or nemesis. Your vehicle leaves a dangerous trail behind it. Trap or corner your opponent to secure victory - but don\t hit your own tail!',
    controls: {
      ASDW: 'Player 1 left/down/right/up',
      JKLI: 'Player 2 left/down/right/up',
      ',': 'Set up a map with a bounding box',
      M: 'Set up a map without a bounding box',
      Z: 'Start game'
    }
  }
}
