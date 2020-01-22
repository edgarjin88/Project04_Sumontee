import { Button, Form, Input } from 'antd';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EDIT_NICKNAME_REQUEST } from '../reducers/user';

const NicknameEditForm = () => {
  const [editedName, setEditedName] = useState('');
  const dispatch = useDispatch();
  const { me, isEditingNickname } = useSelector(state => state.user);

  const onChangeNickname = useCallback((e) => {
    setEditedName(e.target.value);
  }, []);

  const onEditNickname = useCallback((e) => {
    e.preventDefault();
    dispatch({
      type: EDIT_NICKNAME_REQUEST,
      data: editedName,
    });
  }, [editedName]); //여기에는 editedName이 있어야 한다. 없으면 이름이 비어져 버림. 혹은 빈 값으로 가버림. dispatch 할 때는 빈값이면 안되는게 규칙일듯?:

  return (
    <Form style={{ marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px' }} onSubmit={onEditNickname}>
      <Input addonBefore="Nick Name" value={editedName || (me && me.nickname)} onChange={onChangeNickname} />
      <Button type="primary" htmlType="submit" loading={isEditingNickname}>Edit</Button>
    </Form>
  );
};

export default NicknameEditForm;
