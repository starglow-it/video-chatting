function parseCustomDateString(dateString: string): string | null {
    const parts = dateString.split(' ');

    const day = parseInt(parts[0], 10);
    const weekday = parts[1];
    const month = parts[2];
    const year = parseInt(parts[3], 10);
    const time = parts[4];
    const timezone = parts[5];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthIndex = months.indexOf(month);

    // Note: You might need to adjust this depending on your requirements
    const formattedDate = `${weekday} ${day} ${months[monthIndex]} ${time} ${timezone}`;

    return formattedDate;
}

function parseCustomDateStringToValidDate(dateString: string): string | null {
    const parts = dateString.split(' ');

    const day = parseInt(parts[0], 10);
    const weekday = parts[1];
    const month = parts[2];
    const year = parseInt(parts[3], 10);
    const time = parts[4];
    const timezone = parts[5];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthIndex = months.indexOf(month);

    // Note: You might need to adjust this depending on your requirements
    const validDate = `${year}-${monthIndex+1}-${day}T${time}`;

    return validDate;
}

export { parseCustomDateString, parseCustomDateStringToValidDate };

