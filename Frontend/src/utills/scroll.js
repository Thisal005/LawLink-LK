// Utils - scroll.js

export const useBottomScroll = (ref) => {
    useEffect(() => {
        const element = ref.current;
        element?.scrollIntoView({ behavior: 'smooth' });
    }, [ref]);
};