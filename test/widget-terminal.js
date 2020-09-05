const blessed = require('../');
const path = require('path');

const screen = blessed.screen({
  dump: path.join(__dirname, '/logs/termblessed.log'),
  smartCSR: true,
  warnings: true
});

const terminal = blessed.terminal({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  label: 'Terminal',
  fullUnicode: true,
  screenKeys: false,
  cwd: process.cwd(),
  border: {
    type: 'line',
    fg: 'white',
    bg: 'black'
  },

  style: {
    bg: 'black',
    focus: {
      border: {
        fg: 'blue',
      },
    },
    label: {
      bg: 'black',
      fg: 'yellow'
    },
  },
});

screen.key('C-q', () => {
  return screen.destroy();
});
screen.append(terminal);
screen.render();

