interface IDevice {
    device: 'mobile' | 'tablet' | 'desktop';
}

const breakPoint = {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
};

/**
 * * 모바일 우선 : min-width
 * * 데스크탑 우선 : max-width
 */
export const device = {
    mobile: `(max-width: ${breakPoint.mobile})`,
    tablet: `(max-width: ${breakPoint.tablet})`,
    desktop: `(max-width: ${breakPoint.desktop})`,
};
