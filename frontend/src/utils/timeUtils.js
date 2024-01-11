export const convertTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours % 12 || 12;
    const period = hours < 12 ? "am" : "pm";
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}