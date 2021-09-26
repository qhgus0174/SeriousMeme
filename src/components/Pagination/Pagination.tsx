import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

interface IPage {
    totalCount: number;
    perPage: number;
    currentPage: number;
    setCurrentPage: (e: number) => void;
}

const Pagination = ({ totalCount = 0, perPage = 4, currentPage = 1, setCurrentPage }: IPage) => {
    const [pageNumbers, setPageNumbers] = useState<number[]>([]);

    useEffect(() => {
        setPageNumbers(Array.from(Array(Math.ceil(totalCount / perPage)).keys(), x => x + 1));
    }, [totalCount]);

    return (
        <>
            <PagingUl>
                <PagingLi
                    onClick={() => {
                        setCurrentPage(1);
                    }}
                    active={false}
                >
                    처음
                </PagingLi>
                {pageNumbers.map((pageNumber: number, index: number) => {
                    return (
                        <PagingLi
                            onClick={() => {
                                setCurrentPage(pageNumber);
                            }}
                            key={index}
                            active={pageNumber === currentPage}
                        >
                            <span>{pageNumber}</span>
                        </PagingLi>
                    );
                })}
                <PagingLi
                    onClick={() => {
                        setCurrentPage(pageNumbers.length);
                    }}
                    active={false}
                >
                    끝
                </PagingLi>
            </PagingUl>
        </>
    );
};

const PagingUl = styled.ul`
    display: flex;
    justify-content: center;
`;

interface IPageStyle {
    active: boolean;
}

const PagingLi = styled.li<IPageStyle>`
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid ${props => props.theme.colors.white};
    padding: 0.5em 0.8em;
    margin: 0 0.2em 0 0.2em;

    &:hover {
        background: ${props => props.theme.colors.main2};
    }

    background: ${props => props.active && props.theme.colors.main};
`;

export default Pagination;
