import React from 'react';
import { ReactComponent as GitHub } from '~assets/svg/github.svg';
import { ReactComponent as GoogleLogo } from '~assets/svg/google.svg';
import { ReactComponent as StarEmpty } from '~assets/svg/star-empty.svg';
import { ReactComponent as StarFill } from '~assets/svg/star-fill.svg';
import { ReactComponent as Login } from '~assets/svg/login.svg';
import { ReactComponent as Logout } from '~assets/svg/logout.svg';
import { ReactComponent as Profile } from '~assets/svg/defaultProfile.svg';
import { ReactComponent as Home } from '~assets/svg/home.svg';
import { ReactComponent as Download } from '~assets/svg/download.svg';

interface ISvg {
    shape: IIconType;
    color?: string;
    width?: number;
    height?: number;
}

type IIconType =
    | 'github'
    | 'googleLogo'
    | 'star-empty'
    | 'star-fill'
    | 'login'
    | 'logout'
    | 'profile'
    | 'home'
    | 'download';

const Svg = ({ shape, color = 'black', width = 40, height = 40 }: ISvg) => {
    const icon = () => {
        switch (shape) {
            case 'github':
                return <GitHub fill={color} width={width} height={height} />;
            case 'googleLogo':
                return <GoogleLogo fill={color} width={width} height={height} />;
            case 'star-empty':
                return <StarEmpty fill={color} width={width} height={height} />;
            case 'star-fill':
                return <StarFill fill={color} width={width} height={height} />;
            case 'login':
                return <Login fill={color} width={width} height={height} />;
            case 'logout':
                return <Logout fill={color} width={width} height={height} />;
            case 'profile':
                return <Profile fill={color} width={width} height={height} />;
            case 'home':
                return <Home fill={color} width={width} height={height} />;
            case 'download':
                return <Download fill={color} width={width} height={height} />;
            default:
                return <></>;
        }
    };

    return icon();
};

export default Svg;
