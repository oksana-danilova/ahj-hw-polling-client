export default function getCreationDate(time) {
  const date = new Date(time);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  return `${hours}:${minutes} ${day}.${month}.${date.getFullYear()}`;
}
