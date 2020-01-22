import React from 'react';
import Link from 'next/link';
import { Col, Input, Menu, Row, Icon } from 'antd';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';
import {Sticky} from '../components/ImagesZoom/style'
import Ads from '../containers/Ads'
const AppLayout = ({ children }) => {
  //children도 next 가 준다. 
  const { me } = useSelector(state => state.user);

  const onSearch = (value) => {
    Router.push({ pathname: '/hashtag', query: { tag: value } }, `/hashtag/${value}`);
    //내부적으로는 '/hashtag', query: { tag: value } 처음 주소로 가고, 그다음 외부적으로는 `/hashtag/${value}`로 보인다. 
    //서버쪽 주소랑 프론트 주소랑 다르기 때문ㅇ. 
    //component 적으로 바꾸는게 Link
    //programming 적으로 바꾸는게 Router
  };

  const handleSearchBar =(e)=>{
    // console.log('for stop propagation', e);
    e.stopPropagation()
  }
  
  return (
    <div style={{backgroundColor:"#dde0f056"}}>
      <Row style={{height:"3rem"}}>
      </Row>
      <Sticky>
      <Row style={{backgroundColor:"white", borderBottom:"1px grey solid", marginBottom:"0.5em"}}  type="flex" justify="center">
        <Col xs={24} md={21} xl={15} onClick={handleSearchBar}>
            <Menu style={{borderBottom:"none", backgroundColor:"white"}} mode="horizontal" >

            <Menu.Item key="home"><Link href="/" prefetch><a><strong><Icon type="bulb" />News Feed</strong></a></Link></Menu.Item>
            
            
            <Menu.Item key="profile"><Link href="/profile" prefetch><a><strong><Icon type="profile" />Profile</strong></a></Link></Menu.Item>

            <Menu.Item key="message"><Link href="/" prefetch><a><strong><Icon type="message" />Message</strong></a></Link></Menu.Item>
            <Menu.Item key="notification"><Link href="/profile" prefetch><a><strong><Icon type="notification" />Notifications</strong></a></Link></Menu.Item>
            
            <Menu.Item key="setting"><Link href="/" prefetch><a><strong><Icon type="setting" />Settings</strong></a></Link></Menu.Item>

              
            <Menu.Item key="searching"  >
            <a onClick={handleSearchBar}> 
              
            <Input.Search  placeholder={"#seach #hashtags"}
              
              enterButton
              style={{ verticalAlign: 'middle'}}
              onSearch={onSearch}
            />
            </a>
          </Menu.Item>
  
          </Menu>
        </Col>
      </Row>
      </Sticky>

      
   

      
      
      <Row type='flex' justify="center" gutter={8}>
        
        <Col xs={24} md={4} style={{marginTop:"1rem"}}>
          {me
            ? <UserProfile />
            : <LoginForm />}
        </Col>
        <Col xs={24} md={8}>
          {children}
        </Col>
        <Col xs={24} md={4}>
          <Ads></Ads>
          {/* app ads to be updated */}
        </Col>
      </Row>
    </div>
  );
};


export default AppLayout;
