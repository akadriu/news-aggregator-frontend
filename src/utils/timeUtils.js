export const timeDifference = (fetchDate) => {
    const now = new Date();
    
    // Your Python sends: "2025-09-27T18:10:13" (local time format)
    // JavaScript will interpret this as local time, which is correct
    const fetchTime = new Date(
         fetchDate.replace(" ", "T") + (fetchDate.endsWith("Z") ? "" : "Z")
    );
    
    const diffInMinutes = Math.floor((now - fetchTime) / (1000 * 60));

    // Debug logging (remove after testing)
    console.log(`Now: ${now.toLocaleString()}`);
    console.log(`Fetch: ${fetchTime.toLocaleString()}`);
    console.log(`Diff: ${diffInMinutes} minutes`);

    if (diffInMinutes < 0) {
        return "tani";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minutash`;
    } else if (diffInMinutes < 24 * 60) {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} ore`;
    } else {
        const diffInDays = Math.floor(diffInMinutes / (24 * 60));
        return `${diffInDays} dite`;
    }
};