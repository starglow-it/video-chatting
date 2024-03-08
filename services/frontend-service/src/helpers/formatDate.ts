const formatDate = (text: string) => {
    const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (text) {
        const date = new Date(text);

        const month = date.getMonth();
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${monthAbbreviations[month]} ${day} ${year} ${hours}:${minutes}:${seconds}`;
    } else {
        return '';
    }
};

export default formatDate;