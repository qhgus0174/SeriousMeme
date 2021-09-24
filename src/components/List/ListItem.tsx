import React, { useContext, useEffect, useState } from 'react';
import { deleteDoc, IBoard } from '~firebase/board/board';
import { AuthContext } from '~context/AuthContext';
import { deleteAttachmentByUrl } from '~firebase/storage/storage';
import { ModalActionContext } from '~context/ModalContext';
import styled from '@emotion/styled';
import { getUserInfo, IUser } from '~firebase/user/user';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import SvgIcon from '~components/Icon/SvgIcon';
import { SpinnerContext } from '~context/SpinnerContext';
import { toast } from 'react-toastify';

interface IListitem extends IBoard {
    flexBasis?: number;
}

const ListItem = (items: IListitem) => {
    type UserInfo = Pick<IUser, 'photoUrl' | 'name'>;

    const initialState: UserInfo = {
        name: '',
        photoUrl: '',
    };

    const { setSpinnerVisible } = useContext(SpinnerContext);

    const [userInfo, setUserInfo] = useState<UserInfo>(initialState);

    const { setModalProps } = useContext(ModalActionContext);

    useEffect(() => {
        getUserProfile();
    }, []);

    const {
        state: { authUser },
    } = useContext(AuthContext);

    const getUserProfile = async () => {
        try {
            setSpinnerVisible(true);
            const docs = (await getUserInfo(items.createUserId)) as QuerySnapshot<UserInfo>;

            docs.forEach((doc: QueryDocumentSnapshot<UserInfo>) => {
                const { name, photoUrl } = doc.data();
                setUserInfo(prevState => ({ ...prevState, name: name, photoUrl: photoUrl }));
            });
        } catch (e) {
            toast.error('데이터 로딩 중 오류가 발생했습니다.');
        } finally {
            setSpinnerVisible(false);
        }
    };
    const onClickDelete = async () => {
        try {
            setSpinnerVisible(true);

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
        } catch (error) {
            toast.error('데이터 삭제 중 오류가 발생했습니다.');
        } finally {
            setSpinnerVisible(false);
        }
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
    display: flex;
    flex-direction: column;
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
    flex-basis: 70%;
    img {
        max-width: 100%;
        max-height: 100%;
    }
`;
const UserInfoContainer = styled.div`
    padding: 1em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-basis: 30%;
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
    cursor: pointer;
`;

export default ListItem;
