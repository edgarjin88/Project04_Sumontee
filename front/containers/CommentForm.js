import {Button, Form, Input} from 'antd';
import React, {useCallback, useEffect, useState} from 'react'; 
import {ADD_COMMENT_REQUEST} from '../reducers/post';
import {useSelector, useDispatch} from 'react-redux'


const CommentForm = ({post}) =>{ 
  const [commentText, setCommentText] = useState('');
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const { me } = useSelector(state => state.user); 
  const dispatch = useDispatch(); 

  const onSubmitComment = useCallback((e) => {
    e.preventDefault();
    if (!me) {
      return alert('Login required');
    }
    return dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: commentText,
      },
    });
  }, [me && me.id, commentText]);

  useEffect(() => {
    setCommentText('');
  }, [commentAdded === true]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

return(
  <Form onSubmit={onSubmitComment}>
<Form.Item>
  <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText} />
</Form.Item>
<Button type="primary" htmlType="submit" loading={isAddingComment}>Add Comment</Button>
</Form>


)}

export default CommentForm; 


