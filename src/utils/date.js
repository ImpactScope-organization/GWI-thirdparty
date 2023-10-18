const currentDate = new Date();

const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
  timeZoneName: 'short',
};

export const formattedDate = currentDate.toLocaleDateString('en-US', options);

