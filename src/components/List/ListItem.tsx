import React, { useContext, useState } from 'react';
import Button from '~components/Button/Button';
import TextBox from '~components/Input/TextBox';
import { deleteDoc, IBoard, updateDoc } from '~firebase/board/board';
import { AuthContext } from '~context/AuthContext';
import { css } from '@emotion/react';

const ListItem = (items: IBoard) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [newContent, setNewContent] = useState<string>(items.content);

    const {
        state: { authUser },
    } = useContext(AuthContext);

    const onChangeEditBox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = event;

        setNewContent(value);
    };

    const onClickDelete = async () => {
        await deleteDoc({ docId: items.docId });
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await updateDoc({ docId: items.docId, content: newContent });
        setIsEdit(false);
    };

    return (
        <div css={css`border: 1px solid black; padding:1rem"`}>
            {isEdit ? (
                <>
                    <form onSubmit={onSubmit}>
                        <TextBox value={newContent} onChange={onChangeEditBox} />
                        <Button type="submit">수정</Button>
                        <Button type="button" onClick={() => setIsEdit(false)}>
                            취소
                        </Button>
                    </form>
                </>
            ) : (
                <>
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
