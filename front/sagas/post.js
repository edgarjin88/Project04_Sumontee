import { all, fork, takeLatest, put, throttle, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LOAD_COMMENTS_FAILURE,
  LOAD_COMMENTS_REQUEST,
  LOAD_COMMENTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_MAIN_POSTS_FAILURE,
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_MAIN_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  RETWEET_FAILURE,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS, LOAD_POST_SUCCESS, LOAD_POST_FAILURE, LOAD_POST_REQUEST,
  UPLOAD_PROFILE_REQUEST,
  UPLOAD_PROFILE_FAILURE,
  UPLOAD_PROFILE_SUCCESS,
  EDIT_POST_REQUEST, 
  EDIT_POST_FAILURE,
  EDIT_POST_SUCCESS
} from '../reducers/post';


import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

// const path = require('path')
// const fs = require('fs')
// var certsPath = path.join(__dirname, 'path', 'to');
// const https = require('https')
// const http = require('http')

// const options ={
//     key: fs.readFileSync(path.join(certsPath, 'sumontee_com_key.txt')),
   
//     cert: fs.readFileSync(path.join(certsPath, 'sumontee.com.crt')),
   
//     ca: fs.readFileSync(path.join(certsPath, 'sumontee.com.ca-bundle'))
// }

// const path = require('path')
// const fs = require('fs')
const https = require('https')
// let certsPath = path.join(__dirname, '/');

const httpsAgent = process.env.NODE_ENV === "production" ? new https.Agent({
  rejectUnauthorized: false,
  // cert: fs.readFileSync(path.join(__dirname,'sumontee.com.crt')),
  // key: fs.readFileSync(path.join(__dirname,'sumontee_com_key.txt'))
  
}) : undefined


function addPostAPI(postData) { //이경우 이게 formdata가 보내주는 정보가 된다. 
  return axios.post('/post', postData, {
    httpsAgent,
    withCredentials: true,
  });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({ 
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({ 
      type: ADD_POST_TO_ME,  
      data: result.data.id,
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function loadMainPostsAPI(lastId = 0, limit = 10) {
  return axios.get(`/posts?lastId=${lastId}&limit=${limit}`, {httpsAgent, 
    withCredentials: true});
  //lastId=0가 들어감에 주의하자. 개시글이 하나도 없는 경우가 있기 때문이다.이경우에는 서버쪽에서는 처음부터 불러온다.  
}

function* loadMainPosts(action) { 

  try {
    const result = yield call(loadMainPostsAPI, action.lastId);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPosts() {
  yield throttle(2000, LOAD_MAIN_POSTS_REQUEST, loadMainPosts); 
  
}

function loadHashtagPostsAPI(tag, lastId) {
  return axios.get(`/hashtag/${encodeURIComponent(tag)}?lastId=${lastId}&limit=10`, {httpsAgent, 
    withCredentials: true}); 
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS, 
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts); 
}

function loadUserPostsAPI(id) { 
  return axios.get(`/user/${id || 0}/posts`, {httpsAgent, 
    withCredentials: true}); 
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, { content: data.content}, {
    withCredentials: true,
    httpsAgent
  });
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId,
        comment: result.data,
      },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e,
    });
  }
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function loadCommentsAPI(postId) {
  return axios.get(`/post/${postId}/comments`, {httpsAgent, withCredentials: true});
}

function* loadComments(action) { 
  try {
    const result = yield call(loadCommentsAPI, action.data);
    yield put({
      type: LOAD_COMMENTS_SUCCESS,
      data: {
        postId: action.data,
        comments: result.data,
      },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_COMMENTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadComments() {
  yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}

function uploadImagesAPI(formData) {
  return axios.post('/post/images', formData, {
    withCredentials: true,
    httpsAgent
  });
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: e,
    });
  }
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}


function uploadProfileImagesAPI(formData) {
  return axios.post('/post/profile', formData, {
    withCredentials: true,
    httpsAgent
  });
}

function* uploadProfileImages(action) {
  try {
    const result = yield call(uploadProfileImagesAPI, action.data);
    yield put({
      type: UPLOAD_PROFILE_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UPLOAD_PROFILE_FAILURE,
      error: e,
    });
  }
}

function* watchUploadProfileImages() {
  yield takeLatest(UPLOAD_PROFILE_REQUEST, uploadProfileImages);
}



function likePostAPI(postId) {
  return axios.post(`/post/${postId}/like`, {}, {   
    withCredentials: true,
    httpsAgent
  });
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: {
        postId: action.data,
        userId: result.data.userId,
      },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LIKE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function unlikePostAPI(postId) {
  return axios.delete(`/post/${postId}/like`, { // delete  에 주의
    withCredentials: true,
    httpsAgent
  });
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: {
        postId: action.data,
        userId: result.data.userId,
      },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function retweetAPI(postId) {
  return axios.post(`/post/${postId}/retweet`, {}, {
    withCredentials: true,
    httpsAgent
  });
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: RETWEET_FAILURE,
      error: e,
    });
    alert(e.response && e.response.data);
  }
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

function removePostAPI(postId) {
  return axios.delete(`/post/${postId}`, { // delete!
    withCredentials: true,
    httpsAgent
  });
}

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}



function editPostAPI(postId, content) {
  return axios.patch(`/post/${postId}`,{content}, {
    withCredentials: true,
    httpsAgent
  });
}

function* editPost(action) {
  try {
    const result = yield call(editPostAPI, action.data, action.content);
    yield put({
      type: EDIT_POST_SUCCESS,
      data: result.data,
      postId: action.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: EDIT_POST_FAILURE,
      error: e,
    });
  }
}

function* watchEditPost() {
  yield takeLatest(EDIT_POST_REQUEST, editPost);
}






function loadPostAPI(postId) {
  return axios.get(`/post/${postId}`, {httpsAgent, withCredentials: true});
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadMainPosts),
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchLoadComments),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
    fork(watchUploadImages),
    fork(watchUploadProfileImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchRetweet),
    fork(watchRemovePost),
    fork(watchEditPost),
    fork(watchLoadPost),
  ]);
}

//all([])을 하면 fork들의 모든 답변이 돌아올 때까지 기다려야 하는 것 아닌가 ? 
//action이 dispatch 되지 않은 fork 들은 뭔가를 리턴하는 것인가?
//all([call(a), call(b)])  이런식이면 블로킹 해서 서로 기다린다. 
// 그러나 fork 이면 논블로킹
