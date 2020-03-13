export const msToTime = (duration) => {
  if (duration < 0) {
    return {
      hours: '00',
      minutes: '00',
      seconds: '00'
    };
  }

  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return { hours, minutes, seconds };
};
