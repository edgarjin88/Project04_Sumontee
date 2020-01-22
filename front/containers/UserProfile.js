import { Avatar, Button, Card, Row, Col, Icon } from 'antd';
import React, { useCallback } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user';
import {URL} from '../config/config'
import ProfileImage from '../components/ProfileImage';


const UserProfile = () => {
  const { me } = useSelector(state => state.user);
  const {profilePhoto} =useSelector(state=> state.post)
  const dispatch = useDispatch();
 //post.profilePhoto
 //post.User.profilePhoto
 
  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);

  return (
    <Row>

      <Col xs={24}>

      {/* // const srcAddress = process.env.NODE_ENV ==="development" ? `http://localhost:3065/${v}` : v */}
      {/* process.env.NODE_ENV ==="development" ? `${URL}/${profilePhoto || me.profilePhoto}`}
      :profilePhoto || me.profilePhoto */}

      {/* cover={<ProfileImage images={`${URL}/${profilePhoto || me.profilePhoto}`}  />} */}

      <Card 
      cover={<ProfileImage images={process.env.NODE_ENV ==="development" ? `${URL}/${profilePhoto || me.profilePhoto}`
      : profilePhoto || me.profilePhoto}/>}
      actions={[
        <Link href="/profile" prefetch key="twit">
          <a>
            <div>Post<br />{me.Posts.length}</div>
          </a>
        </Link>,
        <Link href="/profile"  prefetch key="following"> 
        {/* key 는 항상 상위에 있어야 한다. */}
          <a>
            <div>Following<br />{me.Followings.length}</div>
          </a>
        </Link>,
        <Link href="/profile"  prefetch key="follower">
          <a>
            <div>Follower<br />{me.Followers.length}</div>
          </a>
        </Link>,
        <Button onClick={onLogout}><strong><Icon type="logout"/></strong></Button>
      ]}
    >
      <Card.Meta
        // avatar={
        // <Avatar 
        // shape={"square"}
        // size={240} src={`${URL}/${profilePhoto || me.profilePhoto}`} 
        // //개 쑈를 다하는구먼 진짜. 이거 때문에. 
        // >{me.nickname[0]}</Avatar>}
        title={<div><Icon style={{fontSize:"1.25rem"}}type="user" /> : {me.nickname}</div>}
      />
      
    </Card>
      
      
      
      </Col>
    </Row>

  );
};

export default UserProfile;
