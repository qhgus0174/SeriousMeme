import React from 'react';
import { Theme, useTheme } from '@emotion/react';
import { ReactComponent as GitHub } from '~assets/svg/github.svg';
import { ReactComponent as GoogleLogo } from '~assets/svg/google.svg';
import { ReactComponent as StarEmpty } from '~assets/svg/star-empty.svg';
import { ReactComponent as StarFill } from '~assets/svg/star-fill.svg';
import { ReactComponent as Login } from '~assets/svg/login.svg';
import { ReactComponent as Logout } from '~assets/svg/logout.svg';
import { ReactComponent as Profile } from '~assets/svg/profile.svg';
import { ReactComponent as MyProfile } from '~assets/svg/myProfile.svg';
import { ReactComponent as Home } from '~assets/svg/home.svg';
import { ReactComponent as Download } from '~assets/svg/download.svg';
import { ReactComponent as DefaultUser } from '~assets/svg/defaultUser.svg';
import { ReactComponent as Trash } from '~assets/svg/trash.svg';
import { ReactComponent as ArrowDown } from '~assets/svg/arrow-down.svg';
import { ReactComponent as ArrowUp } from '~assets/svg/arrow-up.svg';
import { ReactComponent as Edit } from '~assets/svg/edit.svg';
import { ReactComponent as Reset } from '~assets/svg/reset.svg';
import { ReactComponent as More } from '~assets/svg/more.svg';
import { ReactComponent as Draw } from '~assets/svg/draw.svg';
import { ReactComponent as Images } from '~assets/svg/images.svg';
import { ReactComponent as Twinkle } from '~assets/svg/twinkle.svg';

interface ISvg {
    shape: IIconType;
    color?: keyof Theme['colors'];
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
    | 'download'
    | 'defaultUser'
    | 'trash'
    | 'arrow-down'
    | 'arrow-up'
    | 'edit'
    | 'reset'
    | 'more'
    | 'draw'
    | 'images'
    | 'myprofile'
    | 'twinkle';

const Svg = ({ shape, color = 'black', width = 38, height = 38 }: ISvg) => {
    const theme = useTheme();
    const iconColor = theme.colors[color];

    const icon = () => {
        switch (shape) {
            case 'github':
                return <GitHub fill={iconColor} width={width} height={height} />;
            case 'googleLogo':
                return <GoogleLogo fill={iconColor} width={width} height={height} />;
            case 'star-empty':
                return <StarEmpty fill={iconColor} width={width} height={height} />;
            case 'star-fill':
                return <StarFill fill={iconColor} width={width} height={height} />;
            case 'login':
                return <Login fill={iconColor} width={width} height={height} />;
            case 'logout':
                return <Logout fill={iconColor} width={width} height={height} />;
            case 'profile':
                return <Profile fill={iconColor} width={width} height={height} />;
            case 'home':
                return <Home fill={iconColor} width={width} height={height} />;
            case 'download':
                return <Download fill={iconColor} width={width} height={height} />;
            case 'defaultUser':
                return <DefaultUser fill={iconColor} width={width} height={height} />;
            case 'trash':
                return <Trash fill={iconColor} width={width} height={height} />;
            case 'arrow-down':
                return <ArrowDown fill={iconColor} width={width} height={height} />;
            case 'arrow-up':
                return <ArrowUp fill={iconColor} width={width} height={height} />;
            case 'edit':
                return <Edit fill={iconColor} width={width} height={height} />;
            case 'reset':
                return <Reset fill={iconColor} width={width} height={height} />;
            case 'more':
                return <More fill={iconColor} width={width} height={height} />;
            case 'draw':
                return <Draw fill={iconColor} width={width} height={height} />;
            case 'images':
                return <Images fill={iconColor} width={width} height={height} />;
            case 'myprofile':
                return <MyProfile fill={iconColor} width={width} height={height} />;
            case 'twinkle':
                return <Twinkle fill={iconColor} width={width} height={height} />;
            default:
                return <></>;
        }
    };

    return icon();
};

export default Svg;
