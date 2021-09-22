import { updateProfile } from '~firebase/user/user';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
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

const Profile = () => {
    const {
        state: { authUser },
    } = useContext(AuthContext);
    const [contentList, setContentList] = useState<IBoard[]>([]);
    const [newDisplayName, bindNewDisplayName] = useInput<string | null>(authUser!.displayName);
    const [newPhotoUrl, setNewPhotoUrl] = useState<string | null>(authUser!.photoURL);
    const { setSpinnerVisible } = useContext(SpinnerContext);

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
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            setSpinnerVisible(true);

            let photoUrl: string | null = null;

            if (newPhotoUrl) {
                await updateProfile(authUser!, { displayName: newDisplayName, photoURL: photoUrl });
                const res = await uploadByAttachmentUrlProfile(authUser ? authUser.uid : 'anonymous', newPhotoUrl);
                photoUrl = await getDownloadURL(res.ref);
                toast('변경되었음');
                setContentList([]);
                getList();
            }
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
            <form onSubmit={onSubmit}>
                {newPhotoUrl ? (
                    <>
                        <img src={newPhotoUrl} width="50px" height="50px" alt="프로필 사진" />
                    </>
                ) : (
                    <SvgIcon shape="profile" />
                )}
                <input type="file" accept="image/*" onChange={onChangeFile} />
                <TextBox {...bindNewDisplayName} />
                <Button>프로필 변경</Button>
            </form>
            {contentList.map((content: IBoard) => {
                return (
                    <ListItem
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
        </>
    );
};

export default Profile;
