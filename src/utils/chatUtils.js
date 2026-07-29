export const normalizeImageUrl = (value) => {
  if (!value) return null;

  const trimmedValue = String(value).trim();
  const markdownMatch = trimmedValue.match(/\((https?:\/\/[^)]+)\)/i);

  if (markdownMatch?.[1]) {
    return markdownMatch[1];
  }

  const directMatch = trimmedValue.match(/https?:\/\/\S+/i);
  return directMatch?.[0] ?? null;
};

export const formatChatTimestamp = (value, referenceDate = new Date()) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const sameDay =
    parsedDate.toDateString() === new Date(referenceDate).toDateString();

  if (!sameDay) {
    return `${parsedDate.getUTCDate()}/${parsedDate.getUTCMonth() + 1}`;
  }

  const hours = parsedDate.getUTCHours();
  const minutes = parsedDate.getUTCMinutes().toString().padStart(2, "0");
  const compactHour = hours % 12 || 12;

  return `${compactHour}:${minutes}`;
};
