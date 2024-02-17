export const useTrackDuration = (input: number | string | null | undefined, options: { milliseconds?: boolean } = {
  milliseconds: true
}) => {
  if (!input || input === null) {
    return "00:00";
  }

  const milliseconds = typeof input === "string" ? parseInt(input, 10) : input;

  if (isNaN(milliseconds) || milliseconds < 0) {
    return "Invalid input";
  }

  //const hours = Math.floor(milliseconds / 3600000); // 1 hour = 3600000 milliseconds
  const hours = options.milliseconds ? Math.floor(milliseconds / 3600000) : Math.floor(milliseconds / 3600); // 1 hour = 3600000 milliseconds
  //const minutes = Math.floor((milliseconds % 3600000) / 60000); // 1 minute = 60000 milliseconds
  const minutes = options.milliseconds ? Math.floor((milliseconds % 3600000) / 60000) : Math.floor((milliseconds % 3600) / 60); // 1 minute = 60000 milliseconds
  //const seconds = Math.floor((milliseconds % 60000) / 1000); // 1 second = 1000 milliseconds
  const seconds = options.milliseconds ? Math.floor((milliseconds % 60000) / 1000) : Math.floor(milliseconds % 60); // 1 second = 1000 milliseconds

  let formattedDuration = hours > 0 ? `${hours}:` : "";
  formattedDuration += `${minutes < 10 ? '0' : ''}${minutes}:`;
  formattedDuration += `${seconds < 10 ? '0' : ''}${seconds}`;

  return formattedDuration;
}