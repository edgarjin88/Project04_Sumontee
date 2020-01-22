import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Card, Icon } from 'antd';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';
import PostCard from '../containers/PostCard';
import ProfileImage from '../components/ProfileImage'
import {URL} from '../config/config'


const User =  () => {  
  const { mainPosts } = useSelector(state => state.post);
  const { userInfo } = useSelector(state => state.user);
  // const {profilePhoto} = userInfo
  // useEffect(()=>{
  //   alert(
  //     console.log('state chhanged', userInfo.profilePhoto)
  //   )
  // }, [userInfo])
  // console.log('this is userinfo', userInfo)
 
  // console.log('profilePhoto!', profilePhoto)
  

  return (
    <div>
      {userInfo
        ? (
          <Card
          title={<div><Icon style={{fontSize:"1.25rem"}}type="user" /> : {userInfo.nickname}'s posts</div> }
          cover={<ProfileImage images={process.env.NODE_ENV ==="development" ? `${URL}/${userInfo.profilePhoto}`
          : `${userInfo.profilePhoto}`}/>}
            actions={[
              <div key="twit">
                Post
                <br />
                {userInfo.Posts}
              </div>,
              <div key="following">
                Following
                <br />
                {userInfo.Followings}
              </div>,
              <div key="follower">
                Follower
                <br />
                {userInfo.Followers}
              </div>,
            ]}
          >
        
          </Card>
        )
        : null}
      {mainPosts.map(c => (
        <PostCard key={c.id} post={c} />
      ))}
    </div>
  );
};

//dispatch
//getInitialProps 이게 서버사이드 랜더링의 핵심이된다. 
User.getInitialProps = async (context) => { // 이렇게 하면 서버 쪽에서 받아서 다시 프론트로 props로 전달 가능 server -> getinitila propa -> User component
//넥스트가 주는 기능이다. 
  //서버 쪽에서 getInitialPorps가 실행되기 때문에 서버저 쪽에서 데이터를 받아올 수 있다. 
  //여기서 dispatch 하면 서버쪽에서 미리 완성되어 프론트로 전달.  axios도 사용 가능 필요하면 action을 여기서 dispatch 할 수 있다. 
  const id = parseInt(context.query.id, 10);  // 처음에만데이터를 서버에서 불러오기 위해. 
  // console.log('this is user getInitialProps', id);
   context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: id,
  });
   context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: id,
  });

  return { id }; //여기서 아이디는 어디로 가는가. 
};

export default User;

