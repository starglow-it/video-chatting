import {useEffect, useState} from "react";

export const useWindowResize = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const resizeHandler = () => {
            setWidth(() => window.innerWidth);
            setHeight(() => window.innerHeight);
        }

        window.addEventListener('resize', resizeHandler);

        return () => {
            window.removeEventListener('resize', resizeHandler);
        }
    }, []);

    return {
        width,
        height
    }
}