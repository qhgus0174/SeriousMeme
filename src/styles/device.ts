export const customMediaQuery = (maxWidth: number): string => {
    return `@media (max-width: ${maxWidth}px)`;
};

export const media = {
    custom: customMediaQuery,
    desktop: customMediaQuery(922),
    tablet: customMediaQuery(768),
    phone: customMediaQuery(576),
};
