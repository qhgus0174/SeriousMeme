import React, { useContext, useEffect, useState } from 'react';
import Button from '~components/Button/Button';
import TextBox from '~components/Input/TextBox';
import { deleteDoc, IBoard, updateDoc } from '~firebase/board/board';
import { AuthContext } from '~context/AuthContext';
import { deleteAttachmentByUrl } from '~firebase/storage/storage';
import { ModalActionContext } from '~context/ModalContext';
import { useInput } from '~hooks/useInput';
import styled from '@emotion/styled';
import { getUserInfo, IUser } from '~firebase/user/user';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import SvgIcon from '~components/Icon/SvgIcon';

interface IListitem extends IBoard {
    flexBasis?: number;
}

const ListItem = (items: IListitem) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [newContent, bindNewContent] = useInput<string>(items.content);

    type UserInfo = Pick<IUser, 'photoUrl' | 'name'>;

    const initialState: UserInfo = {
        name: '',
        photoUrl: '',
    };

    const [userInfo, setUserInfo] = useState<UserInfo>(initialState);

    const { setModalProps } = useContext(ModalActionContext);

    useEffect(() => {
        getUserProfile();
    }, []);

    const {
        state: { authUser },
    } = useContext(AuthContext);

    const getUserProfile = async () => {
        const docs = (await getUserInfo(items.createUserId)) as QuerySnapshot<UserInfo>;

        docs.forEach((doc: QueryDocumentSnapshot<UserInfo>) => {
            const { name, photoUrl } = doc.data();
            setUserInfo(prevState => ({ ...prevState, name: name, photoUrl: photoUrl }));
        });
    };
    const onClickDelete = async () => {
        setModalProps({
            isOpen: true,
            type: 'dialog',
            content: <>데이터를 삭제하시겠습니까?</>,
            options: {
                width: '25',
                height: '26',
                confirmFn: async () => {
                    await deleteDoc(items.docId);
                    if (items.attatchmentUrl) await deleteAttachmentByUrl(items.attatchmentUrl);
                },
            },
        });
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await updateDoc(items.docId, newContent);
        setIsEdit(false);
    };

    return (
        <ListContainer flexBasis={items.flexBasis}>
            <WhiteBackground>
                <ImageContainer>{items.attatchmentUrl && <img src={items.attatchmentUrl} />}</ImageContainer>
                <UserInfoContainer>
                    <UserTextDiv>
                        <h3>{items.content ? items.content : `제목 없음`}</h3>
                        <UserInfoDiv>
                            {userInfo.photoUrl ? <img src={userInfo.photoUrl} /> : <SvgIcon shape="defaultUser" />}
                            <span>{userInfo.name ? userInfo.name : '익명 사용자'}</span>
                        </UserInfoDiv>
                    </UserTextDiv>
                    {authUser?.uid === items.createUserId && (
                        <ContentButtonDiv onClick={onClickDelete}>
                            <SvgIcon shape="trash" width={20} height={20} />
                        </ContentButtonDiv>
                    )}
                </UserInfoContainer>
            </WhiteBackground>
        </ListContainer>
    );
};

const WhiteBackground = styled.div`
    box-sizing: border-box;
    background: ${props => props.theme.colors.white};
    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
`;
const ListContainer = styled.div<Pick<IListitem, 'flexBasis'>>`
    box-sizing: border-box;
    display: flex;
    flex-basis: ${props => (props.flexBasis ? props.flexBasis : 50)}%;
    min-width: ${props => (props.flexBasis ? props.flexBasis : 50)}%;
    justify-content: center;
    flex-direction: column;
    padding: 1.2em;
`;
const ImageContainer = styled.div`
    box-sizing: border-box;
    display: flex;
    width: 100%;

    img {
        width: 100%;
        height: auto;
        border-bottom-left-radius: 1.5em;
        border-bottom-right-radius: 1.5em;
    }
`;
const UserInfoContainer = styled.div`
    padding: 1em;
    display: flex;
    align-items: center;
`;

const UserTextDiv = styled.div`
    box-sizing: border-box;
    margin-left: 1em;
    display: flex;
    flex-direction: column;

    h3 {
        color: ${props => props.theme.colors.black};
    }
`;

const UserInfoDiv = styled.div`
    display: flex;
    align-items: center;

    img,
    svg {
        border-radius: 50%;
        width: 20px;
        height: 20px;
        object-position: center;
        object-fit: cover;
    }

    span {
        margin: 0.5em;
        font-style: italic;
        font-size: 0.8em;
        color: ${props => props.theme.colors.gray};
    }
`;

const ContentButtonDiv = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: auto;
    cursor: pointer;
`;

export default ListItem;
