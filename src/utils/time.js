export const msToTime = (milliseconds) => {
  if (milliseconds < 0) {
    return {
      hours: '00',
      minutes: '00',
      seconds: '00'
    };
  }

  let seconds = Math.floor((milliseconds / 1000) % 60);
  let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  let hours = Math.floor(milliseconds / (1000 * 60 * 60));

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return { hours, minutes, seconds };
};
