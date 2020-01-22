import { Avatar, Button, Card, Row, Col, Icon } from 'antd';
import React, { useCallback } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user';
import {URL} from '../config/config'
import ProfileImage from '../components/ProfileImage';


const UserProfile = () => {


  return (
    <Row>

      <Col xs={24}>


      <Card title={"Sponsored"} headStyle={{fontSize:"0.7rem", height:"0.5rem"}} style={{marginTop:"1rem", borderRadius:"0.5rem"}}
      cover={<ProfileImage images={`https://images2.minutemediacdn.com/image/upload/c_crop,h_843,w_1500,x_0,y_70/f_auto,q_auto,w_1100/v1555172501/shape/mentalfloss/iStock-487787108.jpg`} />}>
      <Card.Meta
  
      />Dummy Ads
    
    </Card>
    <Card title={"Sponsored"} headStyle={{fontSize:"0.7rem", height:"0.5rem"}} style={{marginTop:"1rem", borderRadius:"0.5rem"}}
      cover={<ProfileImage images={`https://amp.businessinsider.com/images/53a9d02becad04fd3af8649a-750-562.jpg`} />}>
      <Card.Meta
  
      />Dummy Ads
      
    </Card>
      
      
      
      </Col>
    </Row>

  );
};

export default UserProfile;
