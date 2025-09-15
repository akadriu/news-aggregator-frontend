export const timeDifference = (fetchDate) => {
    const now = new Date();
    const fetchTime = new Date(fetchDate);
    const diffInMinutes = Math.floor((now - fetchTime) / (1000 * 60) - 120);

    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutash`;
    } else if (diffInMinutes < 24 * 60) {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} ore`;
    } else {
        const diffInDays = Math.floor(diffInMinutes / (24 * 60));
        return `${diffInDays} dite`;
    }
};
