import { updateProfile } from '~firebase/user/profile';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '~components/Button/Button';
import TextBox from '~components/Input/TextBox';
import ListItem from '~components/List/ListItem';
import { AuthContext } from '~context/AuthContext';
import { getMyDocs, IBoard } from '~firebase/board/board';
import { SpinnerContext } from '~context/SpinnerContext';
import { uploadByAttachmentUrlProfile } from '~firebase/storage/storage';
import { getDownloadURL } from 'firebase/storage';
import SvgIcon from '~components/Icon/SvgIcon';
import { useInput } from '~hooks/useInput';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Pagination from '~components/Pagination/Pagination';

const Profile = () => {
    const {
        state: { authUser },
    } = useContext(AuthContext);
    const [contentList, setContentList] = useState<IBoard[]>([]);
    const [newPhotoUrl, setNewPhotoUrl] = useState<string | null>(null);
    const [isFold, setIsFold] = useState<boolean>(false);

    const [newDisplayName, bindNewDisplayName] = useInput<string | null>(authUser!.displayName);
    const { setSpinnerVisible } = useContext(SpinnerContext);

    const imageInputRef = useRef<HTMLInputElement>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(12);
    const [contentCount, setContentCount] = useState<number>(0);

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

            let photoUrl: string | null = null;

            if (newPhotoUrl) {
                const res = await uploadByAttachmentUrlProfile(authUser ? authUser.uid : 'anonymous', newPhotoUrl);
                photoUrl = await getDownloadURL(res.ref);
                await updateProfile(authUser!, { displayName: newDisplayName, photoURL: photoUrl });
            } else {
                console.log('abcd');
                await updateProfile(authUser!, { displayName: newDisplayName });
            }
            toast('프로필이 변경되었습니다.');
            setContentList([]);
            getList();
        } catch (err: unknown) {
            const { message } = err as Error;
            console.log(message);
        } finally {
            setSpinnerVisible(false);
        }
    };

    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;
        if (!files) {
            return;
        }
        const file = files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            if (reader.result instanceof ArrayBuffer) return;
            setNewPhotoUrl(reader.result);
        };
    };

    return (
        <>
            <ProfileFormContainer onSubmit={onSubmit}>
                <PhotoDiv onClick={() => imageInputRef.current?.click()}>
                    {authUser!.photoURL ? (
                        <img src={authUser!.photoURL} width="100px" height="100px" alt="프로필 사진" />
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
                <TextBox width="10" {...bindNewDisplayName} />
                <Button>프로필 변경</Button>
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
                            flexBasis={25}
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
        </>
    );
};
interface iii {
    isFold: boolean;
}
const FoldDiv = styled.div`
    cursor: pointer;
    svg {
        margin-left: 0.5em;
    }
`;

const ProfileFormContainer = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PhotoDiv = styled.div`
    cursor: pointer;
    img,
    svg {
        border-radius: 50%;
    }
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
