import React, { useEffect, useCallback, useRef } from 'react'; //userRef!
import { useSelector, useDispatch } from 'react-redux';
import PostForm from '../containers/PostForm';
import PostCard from '../containers/PostCard';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';
import socketIOClient from "socket.io-client";
import {URL} from '../config/config'


    // connectSocket = () => {
    //   const ROOM = "chat"
    //   const SIGNAL_ROOM = "signal_room"
    //   const configuration = {
    //     'iceServers': [{
    //       'url': 'stun:stun.l.google.com:19302'
    //     }]
    //   }

  const endpoint = URL
  export const socket = socketIOClient(endpoint, {secure: true, rejectUnauthorized: false}) 
  // socket.on('connect', (roomSocket) => {
  //   console.log('ready socket message fired');


  // })



const Home = () => {
  const { me } = useSelector(state => state.user);
  const { mainPosts, hasMorePost } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const countRef = useRef([]);  //last id record

  const onScroll = useCallback(() => {  //action creator 
    if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 350) {

      if (hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1].id; // 
        if (!countRef.current.includes(lastId)) { // dispatch, if no current id
          dispatch({
            type: LOAD_MAIN_POSTS_REQUEST, 
            lastId, // lastid : lastId
          });
          countRef.current.push(lastId); 
        }
      }
    }
  }, [hasMorePost, mainPosts.length]); 
  

  useEffect(() => {
    window.addEventListener('scroll', onScroll); 
    return () => {
      window.removeEventListener('scroll', onScroll); 
    };
  }, [mainPosts.length]);

  return (
    <div>

      {me && <PostForm />}
      {mainPosts.map((c) => {
        return (
          <PostCard key={c.id} post={c} />
        );
      })}
    </div>
  );
};

Home.getInitialProps = async (context) => { 
   context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST, 
  });
};

export default Home;
