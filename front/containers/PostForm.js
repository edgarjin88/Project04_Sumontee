import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, REMOVE_IMAGE, UPLOAD_IMAGES_REQUEST } from '../reducers/post';

// let v =""
// const srcAddress = process.env.NODE_ENV ==="development" ? `http://localhost:3065/${v}` : v

const PostForm = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post); // 스테이트에서 정보 가져오기
  const imageInput = useRef(); //여기서 선언해 줘야 접근이 가능하다. 

  useEffect(() => {
    setText('');
  }, [postAdded === true]);

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (!text || !text.trim()) {
      return alert('Please write before submit');
    } 
    const formData = new FormData();  // 동영상이나 이미지는 그냥 mulitpart/data로 보낼 수 있고
    imagePaths.forEach((i) => {       // 만약 ajax로 보내고 싶으면 키와 벨류로 나눠서. 어펜드 해야한다. 
      formData.append('image', i);  // 처음에 나오는 인자인 image 스트링을 서버쪽에서 이걸로 인식. FormData 에다가 집어 넣는다. 
    });
    formData.append('content', text);  //ajax  to maintain singlepage, 이거 하려면 FormData 써야 한다. 페이지 리프에시 안하게
    dispatch({  
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const onChangeImages = useCallback((e) => {
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => { //e.target.files가 array니까. key value pair로 큰 어레이를 만듬.
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onClickImageUpload = useCallback(() => { // 버튼 누르면 이미지 업로드 창 나오게. 
    imageInput.current.click(); // 항상 current를 잊지 말자.
    //아래 버튼을 클릭하면 image input 색션을 클릭하것 처럼 만들기 위해서. 
  }, [imageInput.current]); //굳이 필요

  const onRemoveImage = useCallback(index => () => { //실제로 이미지가 업로드 되었을 때. 
    //굳이 이 부분을 고차 함수로 만든 이유가 있었을까? 
    dispatch({
      type: REMOVE_IMAGE,
      index,
    });
  }, []);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onSubmit={onSubmitForm}>
      {/* multipart/form-data 쓰면 브라우져에서 Formdata 객체 재공 */}
      <Input.TextArea maxLength={2000} placeholder="What do you want to share?" value={text} onChange={onChangeText} />
      <div>
        <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button type="secondary" onClick={onClickImageUpload}><strong><Icon type="picture" theme="filled"/> UPLOAD IMAGE</strong></Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={isAddingPost}>
          <strong><Icon type="select" />  POST</strong></Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={process.env.NODE_ENV ==="development" ? `http://localhost:3065/${v}` : v} style={{ width: '200px' }} alt={v} /> 
            {/* 차후 교체 그냥 v가 되어야만 한다. */}
            
            <div>
              <Button onClick={onRemoveImage(i)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;

