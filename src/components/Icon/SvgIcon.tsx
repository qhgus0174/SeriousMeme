import React from 'react';
import { ReactComponent as GitHubIcon } from '~assets/svg/github.svg';
import { ReactComponent as GoogleLogoIcon } from '~assets/svg/google.svg';
import { ReactComponent as StarEmpty } from '~assets/svg/star-empty.svg';
import { ReactComponent as StarFill } from '~assets/svg/star-fill.svg';

interface ISvg {
    shape: string;
    color?: string;
    width?: number;
    height?: number;
}

const Svg = ({ shape, color = 'black', width = 32, height = 32 }: ISvg) => {
    const icon = () => {
        switch (shape) {
            case 'github':
                return <GitHubIcon fill={color} width={width} height={height} />;
            case 'googleLogo':
                return <GoogleLogoIcon fill={color} width={width} height={height} />;
            case 'star-empty':
                return <StarEmpty fill={color} width={width} height={height} />;
            case 'star-fill':
                return <StarFill fill={color} width={width} height={height} />;
            default:
                return <></>;
        }
    };

    return icon();
};

export default Svg;
