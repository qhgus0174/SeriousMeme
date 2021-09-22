import React, { useContext, useState } from 'react';
import Button from '~components/Button/Button';
import TextBox from '~components/Input/TextBox';
import { deleteDoc, IBoard, updateDoc } from '~firebase/board/board';
import { AuthContext } from '~context/AuthContext';
import { css } from '@emotion/react';
import { deleteAttachmentByUrl } from '~firebase/storage/storage';
import { ModalActionContext } from '~context/ModalContext';
import { useInput } from '~hooks/useInput';

const ListItem = (items: IBoard) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [newContent, bindNewContent] = useInput<string>(items.content);

    const { setModalProps } = useContext(ModalActionContext);

    const {
        state: { authUser },
    } = useContext(AuthContext);

    const onClickDelete = async () => {
        setModalProps({
            isOpen: true,
            type: 'dialog',
            content: <>데이터를 삭제하시겠습니까?</>,
            options: {
                width: '25',
                height: '30',
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
        <div css={css`border: 1px solid black; padding:1rem"`}>
            {isEdit ? (
                <>
                    <form onSubmit={onSubmit}>
                        <TextBox {...bindNewContent} />
                        <Button type="submit">수정</Button>
                        <Button type="button" onClick={() => setIsEdit(false)}>
                            취소
                        </Button>
                    </form>
                </>
            ) : (
                <>
                    {items.attatchmentUrl && (
                        <>
                            이미지 :
                            <div>
                                <img src={items.attatchmentUrl} width="300px" height="200px" />
                            </div>
                        </>
                    )}
                    컨텐츠 :<div> {items.content}</div>
                    이메일 : <div>{items.createUserEmail}</div>
                    {authUser?.uid === items.createUserId && (
                        <>
                            <Button type="button" onClick={onClickDelete}>
                                삭제
                            </Button>
                            <Button type="button" onClick={() => setIsEdit(true)}>
                                수정
                            </Button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ListItem;
