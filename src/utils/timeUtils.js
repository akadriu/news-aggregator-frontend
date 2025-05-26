export const timeDifference = (fetchDate) => {
    const now = new Date();
    const fetchTime = new Date(fetchDate);
    const diffInMinutes = Math.floor((now - fetchTime) / (1000 * 60));

    if (diffInMinutes < 60) {
        return `${diffInMinutes} minuta`;
    } else {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} ore`;
    }
};
