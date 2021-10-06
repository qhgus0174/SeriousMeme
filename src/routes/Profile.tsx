import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { AuthContext } from '~context/AuthContext';
import { SpinnerContext } from '~context/SpinnerContext';
import Button from '~components/Button/Button';
import TextBox from '~components/Input/TextBox';
import ListItem from '~components/List/ListItem';
import SvgIcon from '~components/Icon/SvgIcon';
import Pagination from '~components/Pagination/Pagination';
import { useInput } from '~hooks/useInput';
import { media } from '~styles/device';
import { updateProfile } from '~firebase/user/profile';
import { getMyDocs, IBoard } from '~firebase/board/board';
import { uploadByAttachmentUrlProfile } from '~firebase/storage/storage';
import { getDownloadURL } from 'firebase/storage';
import { updateUserInfo } from '~firebase/user/user';
import { auth } from '~firebase/firebaseInstance';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

const Profile = () => {
    const {
        state: { authUser },
    } = useContext(AuthContext);

    const history = useHistory();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(6);
    const [contentCount, setContentCount] = useState<number>(0);

    const [contentList, setContentList] = useState<IBoard[]>([]);
    const [newPhotoUrl, setNewPhotoUrl] = useState<string | null>(authUser!.photoURL);
    const [isFold, setIsFold] = useState<boolean>(false);

    const [newDisplayName, bindNewDisplayName] = useInput<string | null>(authUser!.displayName);
    const { setSpinnerVisible } = useContext(SpinnerContext);
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setContentList([]);
        getList();
    }, []);

    const getList = async () => {
        const docs = (await getMyDocs(authUser!.uid)) as QuerySnapshot<IBoard>;

        docs.forEach((doc: QueryDocumentSnapshot<IBoard>) => {
            const newObj = { ...doc.data(), docId: doc.id };
            setContentList(res => [...res, newObj]);
        });

        setContentCount(docs.size);
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            setSpinnerVisible(true);

            if (newPhotoUrl) {
                if (newPhotoUrl != authUser!.photoURL) {
                    const photoUrl = await getFileUrl();
                    updateUserProfile(photoUrl);
                } else {
                    updateUserProfile(newPhotoUrl);
                }
            }

            toast.success('프로필이 변경되었습니다.');

            setContentList([]);
            getList();
        } catch (err: unknown) {
            const { message } = err as Error;
            console.log(message);
        } finally {
            setSpinnerVisible(false);
        }
    };

    const getFileUrl = async (): Promise<string> => {
        if (newPhotoUrl) {
            const res = await uploadByAttachmentUrlProfile(authUser ? authUser.uid : 'anonymous', newPhotoUrl);
            const downloadUrl = await getDownloadURL(res.ref);
            return downloadUrl;
        } else {
            return '';
        }
    };

    const updateUserProfile = async (photoUrl: string) => {
        await updateProfile(authUser!, { displayName: newDisplayName, photoURL: photoUrl });
        await updateUserInfo(authUser!.uid, { name: newDisplayName, photoUrl: photoUrl });
    };

    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;

        if (!files) return;
        const file = files[0];
        const reader = new FileReader();

        if (!file) return;
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            if (reader.result instanceof ArrayBuffer) return;
            setNewPhotoUrl(reader.result);
        };
    };

    const logOut = async () => {
        setSpinnerVisible(true);
        try {
            await signOut(auth);
            history.push('/');
            toast.info('로그아웃 되었습니다.');
        } catch (error) {
            toast.error('로그아웃 중 오류가 발생했습니다.');
        } finally {
            setSpinnerVisible(false);
        }
    };

    return (
        <ProfileContainter>
            <ProfileFormContainer onSubmit={onSubmit}>
                <PhotoDiv onClick={() => imageInputRef.current?.click()}>
                    {newPhotoUrl ? (
                        <img src={newPhotoUrl} width="100px" height="100px" alt="프로필 사진" />
                    ) : (
                        <SvgIcon shape="profile" width={100} height={100} />
                    )}
                    <input
                        ref={imageInputRef}
                        css={css`
                            display: none;
                        `}
                        type="file"
                        accept="image/*"
                        onChange={onChangeFile}
                    />
                </PhotoDiv>
                <InfoDiv>
                    <InfoInnerDiv>
                        <TextBox {...bindNewDisplayName} />
                        <Button type="submit">프로필 변경</Button>
                    </InfoInnerDiv>
                    <LogoutDiv>
                        <Button
                            type="button"
                            icon={<SvgIcon color="white" shape="logout" width={20} height={20} />}
                            onClick={() => logOut()}
                        >
                            로그아웃
                        </Button>
                    </LogoutDiv>
                </InfoDiv>
            </ProfileFormContainer>
            <ListTitle>
                <FoldDiv onClick={() => setIsFold(!isFold)}>
                    내 게시물
                    {isFold ? (
                        <SvgIcon color="white" shape="arrow-up" width={20} height={20} />
                    ) : (
                        <SvgIcon color="white" shape="arrow-down" width={20} height={20} />
                    )}
                </FoldDiv>
            </ListTitle>
            <ListDiv isFold={isFold}>
                {contentList.map((content: IBoard) => {
                    return (
                        <ListItem
                            flexBasis={100 / (perPage / 2)}
                            id={content.id}
                            key={content.docId}
                            docId={content.docId}
                            content={content.content}
                            createAt={content.createAt}
                            createUserId={content.createUserId}
                            createUserEmail={content.createUserEmail}
                            attatchmentUrl={content.attatchmentUrl}
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
        </ProfileContainter>
    );
};
interface iii {
    isFold: boolean;
}
const ProfileContainter = styled.div`
    flex-basis: 75%;
    margin-top: 1em;
    margin-bottom: 1em;

    ${media.tablet} {
        flex-basis: 85%;
    }
    ${media.phone} {
        flex-basis: 100%;
    }
`;
const FoldDiv = styled.div`
    cursor: pointer;
    svg {
        margin-left: 0.5em;
    }
`;

const LogoutDiv = styled.div`
    display: none;
    ${media.phone} {
        display: flex;
        width: 100%;

        button {
            margin-top: 1em;
            width: 100%;
        }
    }
`;

const ProfileFormContainer = styled.form`
    margin-top: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${media.phone} {
        flex-basis: 100%;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
`;

const PhotoDiv = styled.div`
    cursor: pointer;
    img,
    svg {
        border-radius: 50%;
    }
`;

const InfoDiv = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-right: 1em;
`;
const InfoInnerDiv = styled.div`
    display: flex;
    flex-direction: row;
`;

const ListDiv = styled.div`
    display: flex;
    ${(props: iii) => (props.isFold ? 'opacity: 0;' : 'opacity: 1;')}
    justify-content: center;
    flex-flow: wrap;
    align-items: center;
    padding-right: 1em;
    box-sizing: border-box;
    transition: all 0.3s;
`;

const ListTitle = styled.h2`
    margin-top: 3em;
    margin-bottom: 1em;
    display: flex;
    flex-basis: 100%;
    text-align: center;
    justify-content: center;
`;

const ListPaginig = styled.div`
    display: flex;
    flex-basis: 100%;
    text-align: center;
    justify-content: center;
    height: 10%;
    align-items: center;
`;
export default Profile;
