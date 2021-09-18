import React from 'react';
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';

interface ITab {
    titles: string[]; //탭 헤더 명
    currIndex: number;
    onClickTab: (e: number) => void;
}

const Tab = ({ titles, currIndex, onClickTab }: ITab) => {
    const theme = useTheme();
    return (
        <TabHeader>
            {titles.map((title: string, index: number) => {
                return (
                    <div
                        key={index}
                        css={css`
                            width: 100%;
                            text-align: center;
                            margin-bottom: 1rem;
                            padding-bottom: 0.4rem;
                            cursor: pointer;
                            ${currIndex == index &&
                            `color: ${theme.colors.primary}; border-bottom: 4px solid ${theme.colors.primary};`};

                            &:hover {
                                backgroud: ${theme.colors.primaryDark};
                                color: ${theme.colors.primaryDark};
                            }
                        `}
                        onClick={() => onClickTab(index)}
                    >
                        {title}
                    </div>
                );
            })}
        </TabHeader>
    );
};

const TabHeader = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
`;

export default Tab;
