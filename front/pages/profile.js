import React, { useCallback } from 'react';
import { Button, List, Card, Icon } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import NicknameEditForm from '../containers/NicknameEditForm'; 
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  REMOVE_FOLLOWER_REQUEST,
  UNFOLLOW_USER_REQUEST,
 
} from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';
import FollowList from '../components/FollowList'
// import ProfilePhotos from '../components/ProfilePhotos'
import ProfilePhotoForm from '../containers/ProfilePhotoForm'
const Profile = () => {
  const dispatch = useDispatch();
  const { followingList, followerList, hasMoreFollower, hasMoreFollowing } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post); 

  // console.log('mainposts', mainPosts)
  const onUnfollow = useCallback(userId => () => { 
    dispatch({
      type: UNFOLLOW_USER_REQUEST,
      data: userId,
    });
  }, []);

  const onRemoveFollower = useCallback(userId => () => {
    dispatch({
      type: REMOVE_FOLLOWER_REQUEST,
      data: userId, 
    });
  }, []);

  const loadMoreFollowings = useCallback(() => {   
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
      offset: followingList.length,
    });
  }, [followingList.length]);

  const loadMoreFollowers = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
      offset: followerList.length,
    });
  }, [followerList.length]);

  return (
    <div>
      <NicknameEditForm />
      <ProfilePhotoForm />

        <FollowList 
        header ="Following List" 
        hasMore ={hasMoreFollowing} 
        onClickMore={loadMoreFollowings}
        onClickStop={onUnfollow} 
        data={followingList}
        />



        <FollowList 
        header ="Follower List" 
        hasMore ={hasMoreFollower} 
        onClickMore={loadMoreFollowers}
        onClickStop={onRemoveFollower} 
        data={followerList}
        />    
      <div>
      {mainPosts.map((c) => {
        return (
          <PostCard key={c.id} post={c} />
        );
      })}
      </div>
    </div>
  );
};

Profile.getInitialProps = async (context) => { 

  const state =  context.store.getState();  
 
   context.store.dispatch({
    type: LOAD_FOLLOWERS_REQUEST,
    data: state.user.me && state.user.me.id,  
  });
  // console.log('this is store', context.store);
   context.store.dispatch({
    type: LOAD_FOLLOWINGS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
   context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  

};

export default Profile;

//mapstate props는 page 에서 필요 없고, getInitialprops가 그 역할을 한다. 
//getinitialprops, mapstatetoprops, mapdispatchprops 등을 비교 검색 해 보자. 
//싸이클 순서는 component -> actioncreator -> dispatch -> middleware -> reducer -> component 순서이다. 
// 일반적으로 dispatch -> thunk, saga -> component. 
//next의 경우 mapstatetoprops는 못쓰는듯? 일단 가능한지 예를 한번 찾아보자. 
//단순 dispatch 때문이라면, actioncreator로 빼서 실행 가능할거 같은데? 
