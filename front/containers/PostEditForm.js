import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { EDIT_POST_REQUEST} from '../reducers/post';


const PostEditForm = ({postId, postContent, closeEditForm}) => {
  const dispatch = useDispatch();
  // const {content} = useSelector(state=> state)
  const [text, setText] = useState('');
  const {isAddingPost, postAdded, editingCompleted } = useSelector(state => state.post); 
 
  // const {userId} 
  useEffect(() => {
    setText(postContent);
  }, [postAdded === true]);

  const onSubmitForm = useCallback( async(e) => {
    
    e.preventDefault();
    if (!text || !text.trim()) {
      return alert('Please write before submit');
    }
    
    dispatch({  
      type: EDIT_POST_REQUEST,
      data: postId,
      content: text, 
    });

    setTimeout(()=>{
      closeEditForm()
    }, 1000)
  
  }, [text]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);
  

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onSubmit={onSubmitForm}>
      <Input.TextArea maxLength={2000} placeholder="What do you want to share?" value={text} onChange={onChangeText} />
      <div>
          
        <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={isAddingPost}>
          <strong><Icon type="select" />EDIT POST</strong></Button>

      <Button type="danger" onClick={closeEditForm} style={{ float: 'right' }} loading={isAddingPost}>
          <strong><Icon type="select" />Cancel</strong></Button>
      </div>
    </Form>
  );
};

export default PostEditForm;

