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
  profilePhoto:null, 
  seledtedPost:null,
  isEditingPost: false,
  edittingPost: false,
  editingPostErrorReason:''
};


export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE'; // only one. because we don't need async req. 

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LOAD_COMMENTS_REQUEST = 'LOAD_COMMENTS_REQUEST';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';
export const LOAD_COMMENTS_FAILURE = 'LOAD_COMMENTS_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const EDIT_POST_REQUEST = 'EDIT_POST_REQUEST';
export const EDIT_POST_SUCCESS = 'EDIT_POST_SUCCESS';
export const EDIT_POST_FAILURE = 'EDIT_POST_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';
export const UPLOAD_PROFILE_REQUEST ='UPLOAD_PROFILE_REQUEST'
export const UPLOAD_PROFILE_FAILURE ='UPLOAD_PROFILE_FAILURE'
export const UPLOAD_PROFILE_SUCCESS ='UPLOAD_PROFILE_SUCCESS'

export const EDIT_START_REQUEST = "EDIT_START_REQUEST"


 
export default (state = initialState, action) => {
  return produce(state, (draft) => { 
    // 이 문법으로 produce 만든다음 전부 안에다집어 넣어 버린다. 
    switch (action.type) {


      case UPLOAD_PROFILE_REQUEST: {
        break; // 아무것도 안하면 스위치를 끊어 버린다. 
        // 기존에는 ...state 였다. 
      }
      // draft.me.Followings
      case UPLOAD_PROFILE_SUCCESS: {
 

        draft.profilePhoto = action.data

        break;
      }
      case UPLOAD_PROFILE_FAILURE: {
        break; 
      }


      case UPLOAD_IMAGES_REQUEST: {
        break; 
      }
      case UPLOAD_IMAGES_SUCCESS: {
        action.data.forEach((p) => {
          draft.imagePaths.push(p);  
        });
       
        break;
      }
      case UPLOAD_IMAGES_FAILURE: {
        break; 
      }
      case REMOVE_IMAGE: {
        const index = draft.imagePaths.findIndex((v, i) => i === action.index); 

        draft.imagePaths.splice(index, 1); 
        break;
      }
      case ADD_POST_REQUEST: {
        draft.isAddingPost = true;
        draft.addingPostErrorReason = '';
        draft.postAdded = false;
        break;
      }
      case ADD_POST_SUCCESS: {
        draft.isAddingPost = false;
        draft.mainPosts.unshift(action.data);
        draft.postAdded = true;
        draft.imagePaths = [];
        break;
      }
      case ADD_POST_FAILURE: {
        draft.isAddingPost = false;
        draft.addPostErrorReason = action.error;
        break;
      }
      case ADD_COMMENT_REQUEST: {
        draft.isAddingComment = true;
        draft.addCommentErrorReason = '';
        draft.commentAdded = false;
        break;
      }
      case ADD_COMMENT_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
        //index찾는건 그대로 가야한다. 
        //postIndex는  action.data에 있는 postindx만 담아서 리스트. 
        draft.mainPosts[postIndex].Comments.push(action.data.comment);
        draft.isAddingComment = false;
        draft.commentAdded = true;
        break;
      }
      case ADD_COMMENT_FAILURE: {
        draft.isAddingComment = false;
        draft.addingPostErrorReason = action.error;
        break;
      }
      case LOAD_COMMENTS_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
        draft.mainPosts[postIndex].Comments = action.data.comments;
        break;
      }
      case LOAD_MAIN_POSTS_REQUEST:  
      case LOAD_HASHTAG_POSTS_REQUEST:
      case LOAD_USER_POSTS_REQUEST: {
        draft.mainPosts = !action.lastId ? [] : draft.mainPosts;  
      
        draft.hasMorePost = action.lastId ? draft.hasMorePost : true;

  
        break;
      }
      case LOAD_MAIN_POSTS_SUCCESS:
      case LOAD_HASHTAG_POSTS_SUCCESS:
      case LOAD_USER_POSTS_SUCCESS: {
        action.data.forEach((d) => { //concat 없으로 하면 덮어 쓰는듯? 
          draft.mainPosts.push(d);
        });
        draft.hasMorePost = action.data.length === 10;
        break;
      }
      case LOAD_MAIN_POSTS_FAILURE:
      case LOAD_HASHTAG_POSTS_FAILURE:
      case LOAD_USER_POSTS_FAILURE: {
        break;
      }
      case LIKE_POST_REQUEST: {
        break;
      }
      case LIKE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
        draft.mainPosts[postIndex].Likers.unshift({ id: action.data.userId });
        break;
      }
      case LIKE_POST_FAILURE: {
        break;
      }
      case UNLIKE_POST_REQUEST: {
        break;
      }
      case UNLIKE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId); // currentpost idex
        const likeIndex = draft.mainPosts[postIndex].Likers.findIndex(v => v.id === action.data.userId);
        draft.mainPosts[postIndex].Likers.splice(likeIndex, 1);
        break;
      }
      case UNLIKE_POST_FAILURE: {
        break;
      }
      case RETWEET_REQUEST: {
        break;
      }
      case RETWEET_SUCCESS: {
        draft.mainPosts.unshift(action.data);
        break;
      }
      case RETWEET_FAILURE: {
        break;
      }
      case REMOVE_POST_REQUEST: {    
        break;
      }
      case REMOVE_POST_SUCCESS: {
        const index = draft.mainPosts.findIndex(v => v.id === action.data);
        draft.mainPosts.splice(index, 1);
        break;
      }
      case REMOVE_POST_FAILURE: {
        break;
      }
      case LOAD_POST_SUCCESS: {
        draft.singlePost = action.data;
        break;
      }

      case EDIT_POST_REQUEST: {
        draft.isEditingPost = false;  
        draft.seledtedPost = action.data
        draft.editingCompleted=false
        draft.editingPostErrorReason = '';
        break;
      }
      case EDIT_POST_SUCCESS: {
        const index = draft.mainPosts.findIndex( v => v.id ===action.postId)
        draft.mainPosts[index].content = action.data.content
        draft.editingCompleted = true
        console.log('data type', action.data);
        break;

  
      }
      case EDIT_POST_FAILURE: {
        draft.editingCompleted = false;
        draft.editingPostErrorReason = action.error;
        console.log(action.error);
        break;
      }

      case EDIT_START_REQUEST: {
        draft.editingCompleted = false;
        draft.edittingPostErrorReason = action.error;
        break;
      }


      default: {
        break;
      }
    }
  });
};
