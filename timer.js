require('./memory');

const TIMER_HERTZ_FREQUENCY = 60;
const SOUND_ALERT_CODE = '\007';

setInterval(timeInterval, TIMER_HERTZ_FREQUENCY);

function timeInterval() {
  if ((DT ^ 0x0000) != 0x0000) {
    DT -= 1;
  }
  if ((ST ^ 0x0000) != 0x0000) {
    process.stdout.write(SOUND_ALERT_CODE);
    ST -= 1;
  }
}
