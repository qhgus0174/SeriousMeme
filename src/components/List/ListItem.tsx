import React, { useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { AuthContext } from '~context/AuthContext';
import { ModalActionContext } from '~context/ModalContext';
import { SpinnerContext } from '~context/SpinnerContext';
import SvgIcon from '~components/Icon/SvgIcon';
import TextBox from '~components/Input/TextBox';
import Button from '~components/Button/Button';
import { nowDateToMillis } from '~utils/luxon';
import { useInput } from '~hooks/useInput';
import { media } from '~styles/device';
import { deleteDoc, IBoard, updateDoc } from '~firebase/board/board';
import { deleteAttachmentByUrl } from '~firebase/storage/storage';
import { getUserInfo, IUser } from '~firebase/user/user';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
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

    const [newContent, bindNewContent] = useInput<string>(items.content);
    const [isEdit, setIsEdit] = useState<boolean>(false);
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

    const onClickEdit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setSpinnerVisible(true);
            await updateDoc(items.docId, newContent);
            setIsEdit(false);
            toast.success('수정이 완료되었습니다.');
        } catch (error) {
            toast.error('데이터 수정 중 오류가 발생했습니다.');
        } finally {
            setSpinnerVisible(false);
        }
    };

    const onClickDownload = () => {
        setSpinnerVisible(true);

        toast.info('짤을 다운로드 합니다.');
        const url = items.attatchmentUrl;
        const filename = `${nowDateToMillis}.png`;
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(xhr.response);
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
        };
        xhr.open('GET', url);
        xhr.send();

        setSpinnerVisible(false);
    };
    return (
        <ListContainer flexBasis={items.flexBasis}>
            <WhiteBackground>
                <ImageContainer>{items.attatchmentUrl && <img src={items.attatchmentUrl} />}</ImageContainer>
                <ImageDownloadButton
                    icon={<SvgIcon shape="download" width={20} height={20} />}
                    color="main"
                    onClick={() => onClickDownload()}
                >
                    다운로드
                </ImageDownloadButton>
                <UserInfoContainer>
                    <UserTextDiv>
                        {isEdit ? (
                            <>
                                <EditBox {...bindNewContent} autoFocus />
                            </>
                        ) : (
                            <h4>{items.content ? items.content : `제목 없음`}</h4>
                        )}

                        <UserInfoDiv>
                            {userInfo.photoUrl ? <img src={userInfo.photoUrl} /> : <SvgIcon shape="defaultUser" />}
                            <span>{userInfo.name ? userInfo.name : '익명 사용자'}</span>
                        </UserInfoDiv>
                    </UserTextDiv>
                    {authUser?.uid === items.createUserId &&
                        (isEdit ? (
                            <ContentButtonContainer>
                                <Button color="main" type="button" onClick={onClickEdit}>
                                    완료
                                </Button>
                                <Button color="cancel" type="button" onClick={() => setIsEdit(false)}>
                                    취소
                                </Button>
                            </ContentButtonContainer>
                        ) : (
                            <ContentButtonContainer>
                                <ContentButtonDiv onClick={() => setIsEdit(true)}>
                                    <SvgIcon color="main2" shape="edit" width={20} height={20} />
                                </ContentButtonDiv>
                                <ContentButtonDiv onClick={onClickDelete}>
                                    <SvgIcon shape="trash" width={20} height={20} />
                                </ContentButtonDiv>
                            </ContentButtonContainer>
                        ))}
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

    ${media.tablet} {
        flex-basis: 50%;
        min-width: 50%;
    }

    ${media.phone} {
        flex-basis: 100%;
        min-width: 100%;
    }
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
    padding: 1em 1em 1em 1em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-basis: 30%;
`;

const UserTextDiv = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin-left: 1em;
    margin-right: 1em;
    h4 {
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
    cursor: pointer;
`;

const EditBox = styled(TextBox)`
    padding: 0;
    margin: 0;
    color: ${props => props.theme.colors.black};
`;
const ContentButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const ImageDownloadButton = styled(Button)`
    justify-content: center;
`;
export default ListItem;
