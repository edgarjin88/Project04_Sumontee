import produce from 'immer';

export const initialState = {
  mainPosts: [], 
  imagePaths: [],
  addPostErrorReason: '', 
  isAddingPost: false, 
  postAdded: false, 
  isAddingComment: false,
  addCommentErrorReason: '',
  commentAdded: false,
  singlePost: null,
};


export const ADD_ROOM_REQUEST = 'ADD_ROOM_REQUEST';
export const ADD_ROOM_SUCCESS = 'ADD_ROOM_SUCCESS';
export const ADD_ROOM_FAILURE = 'ADD_ROOM_FAILURE';

export const ADD_MESSAGE_REQUEST = 'ADD_MESSAGE_REQUEST';
export const ADD_MESSAGE_SUCCESS = 'ADD_MESSAGE_SUCCESS';
export const ADD_MESSAGE_FAILURE = 'ADD_MESSAGE_FAILURE';

export const LOAD_MESSAGES_REQUEST = 'LOAD_MESSAGES_REQUEST';
export const LOAD_MESSAGES_SUCCESS = 'LOAD_MESSAGES_SUCCESS';
export const LOAD_MESSAGES_FAILURE = 'LOAD_MESSAGES_FAILURE';


export const REMOVE_ROOM_REQUEST = 'REMOVE_ROOM_REQUEST';
export const REMOVE_ROOM_SUCCESS = 'REMOVE_ROOM_SUCCESS';
export const REMOVE_ROOM_FAILURE = 'REMOVE_ROOM_FAILURE';

export const LOAD_ROOM_REQUEST = 'LOAD_ROOM_REQUEST';
export const LOAD_ROOM_SUCCESS = 'LOAD_ROOM_SUCCESS';
export const LOAD_ROOM_FAILURE = 'LOAD_ROOM_FAILURE';


export default (state = initialState, action) => {
  return produce(state, (draft) => { 
      
    
  })
};
