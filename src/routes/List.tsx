import React, { useContext, useEffect, useState } from 'react';
import { SpinnerContext } from '~context/SpinnerContext';
import ListItem from '~components/List/ListItem';

import { DocumentData, onSnapshot, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { IBoard, queryBoardCollection } from '~firebase/board/board';

import styled from '@emotion/styled';
import { toast } from 'react-toastify';
import { media } from '~styles/device';
import Pagination from '~components/Pagination/Pagination';

const List = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(6);

    const { setSpinnerVisible } = useContext(SpinnerContext);

    const [contentList, setContentList] = useState<IBoard[]>([]);
    const [contentCount, setContentCount] = useState<number>(0);

    useEffect(() => {
        getList();
    }, [currentPage]);

    const getList = async () => {
        try {
            setContentList([]);
            setSpinnerVisible(true);
            const getContent = onSnapshot(queryBoardCollection, (snapshot: QuerySnapshot<DocumentData>) => {
                const snapshotDocs = snapshot.docs as Array<QueryDocumentSnapshot<IBoard>>;

                const postList = snapshotDocs.map((doc: QueryDocumentSnapshot<IBoard>) => {
                    return { ...doc.data(), docId: doc.id };
                });

                setContentList(postList);

                setContentCount(postList.length);
            });
        } catch (err: unknown) {
            const { message } = err as Error;
            toast.error('리스트 로딩 중 오류가 발생했습니다.');
        } finally {
            setSpinnerVisible(false);
        }
    };

    return (
        <MainDiv>
            <ListDiv>
                <ListTitle>✨ 짤 자랑 ✨</ListTitle>
                {contentList
                    .slice(
                        currentPage === 1 ? 0 : (currentPage - 1) * perPage,
                        currentPage === 1 ? perPage : (currentPage - 1) * perPage + perPage,
                    )
                    .map((content: IBoard) => {
                        return (
                            <ListItem
                                key={content.docId}
                                id={content.id}
                                docId={content.docId}
                                content={content.content}
                                createAt={content.createAt}
                                createUserId={content.createUserId}
                                createUserEmail={content.createUserEmail}
                                attatchmentUrl={content.attatchmentUrl}
                                flexBasis={100 / (perPage / 2)}
                            />
                        );
                    })}
                <ListPaginig>
                    <Pagination
                        currentPage={currentPage}
                        perPage={perPage}
                        setCurrentPage={setCurrentPage}
                        totalCount={contentCount}
                    />
                </ListPaginig>
            </ListDiv>
        </MainDiv>
    );
};

const MainDiv = styled.div`
    flex-basis: 75%;
    margin-top: 1em;
    margin-bottom: 2em;
`;

const ListTitle = styled.h2`
    margin-top: 1em;
    margin-bottom: 1em;
    display: flex;
    flex-basis: 100%;
    text-align: center;
    justify-content: center;
    height: 10%;
    align-items: center;
`;
const ListDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-basis: 50%;
    min-width: 50%;
    flex-flow: wrap;
    align-items: center;
    padding-right: 1em;
    box-sizing: border-box;
    align-items: flex-start;
    align-content: flex-start;
`;

const ListPaginig = styled.div`
    display: flex;
    flex-basis: 100%;
    text-align: center;
    justify-content: center;
    height: 10%;
    align-items: center;
`;
export default List;
