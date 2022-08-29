export const secondsToTime = secs => {
  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  if (minutes / 10 < 1) minutes = `0${minutes}`
  if (seconds / 10 < 1) seconds = `0${seconds}`
  return {"mins": minutes, "secs": seconds}
}
