import React, { useCallback, useEffect, useState, memo, useRef } from 'react';
import { Avatar, Button, Card, Comment, Form, Icon, Input, List, Popover, Row, Col } from 'antd';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import FollowButton from '../components/FollowButton'
import PostEditForm from '../containers/PostEditForm'

import Video from './Modal'

import {
  LIKE_POST_REQUEST,
  LOAD_COMMENTS_REQUEST, REMOVE_POST_REQUEST, EDIT_START_REQUEST,
  RETWEET_REQUEST,
  UNLIKE_POST_REQUEST,
} from '../reducers/post';
import PostImages from '../components/PostImages';
import PostCardContent from '../components/PostCardContent';
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';
import moment from 'moment'
import CommentForm from './CommentForm'
import {URL} from '../config/config.js'
moment.locale('en') //날짜마다 다국어를지원하기에 설정 가능. 

const CardWrapper = styled.div`
  margin-bottom: 20px;
`;


const PostCard = memo(({ post }) => { //memo를 통해 rerendering을 막을 수 있다. 그러나 이거... not useMemo? 
  //문제는 shallow 비교만 하기 때문에 너무 복잡한 구조의 객체는 리렌더링이 되야 되는 상황에서 안될수 있기 때문에 주의
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [editFormOpened, setEditFormOpened] = useState(false)
  const openEditForm = useCallback(()=>{
    setEditFormOpened(true)
  }, [editFormOpened])

  const closeEditForm =useCallback(()=>{
    setEditFormOpened(false)
  }, [editFormOpened])


  // console.log('socket', socket);
  const id = useSelector(state => state.user.me && state.user.me.id);
  

  const dispatch = useDispatch(); 

  const liked = id && post.Likers && post.Likers.find(v => v.id === id); 
  //누가 좋아요를 눌렀는지 정보가 최종적으로 liked 안에 들어간다. 내 아이디가 배열안에 있으면 나는 좋아요를 누른 거고
  // 아니면 안 우른 상태. 
  // 이 변수로 뺀 녀석을 계속 사용하자. 
  //지금 중복적으로 쓰고 있는 "post" 이것들은 전부 프랍스로 전달되었다. 

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, []);

useEffect(()=>{
  // console.log('meuseEffect', idMemory.current, id); //이렇게 하면 처음 포스트와 그다음 포스트 비교가능
}, [id]) // 이렇게 해서 만약 파이어가 안되면 이친구가 범인인건 아닌게 된다. useEffect로 해서 리렌더링을 찾아라. 

  const onToggleLike = useCallback(() => {
    if (!id) {
      return alert('Login required');
    }
    if (liked) { // 좋아요 누른 상태
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      });
    } else { // 좋아요 안 누른 상태
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      });
    }
  }, [id, post && post.id, liked]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('Login required');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id, post && post.id]);

  const onFollow = useCallback(userId => () => {
    dispatch({
      type: FOLLOW_USER_REQUEST,
      data: userId,
    });
  }, []);

  const onUnfollow = useCallback(userId => () => { 
    dispatch({
      type: UNFOLLOW_USER_REQUEST,
      data: userId,
    });
  }, []);

  const onRemovePost = useCallback(postId => () => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: postId,
    });
  });

  // const onEditPost = useCallback(postId=>() =>{
  //   dispatch({
  //     type:EDIT_START_REQUEST, 
  //     data:postId
  //   })
  // })

  return (
    <CardWrapper>
      <Card
        cover={post.Images && post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <Icon type="retweet" key="retweet" onClick={onRetweet}
          style={{color:"black"}} 
          // twoToneColor="black"
          />, 
          <Video postId={post.id} id={useSelector(state => state.user.me && state.user.me.id)}/>,
          //처음에 렌더링 할 때 아이디가 업데이트가 안되서 이렇게 해줘야 할듯. 
          <Icon
            type="like"
            key="like"
            theme={liked ? 'twoTone' : 'outlined'}
            twoToneColor="red"
            onClick={onToggleLike}
          />,

          <Icon type="message" key="message" style={{color:"#FF5733"}} 
            onClick={onToggleComment} />,
          <Popover
            key="ellipsis"

            content={(
              <Button.Group>
                {id && post.UserId === id
                  ? (
                    <>
                      <Button onClick={openEditForm}>Edit</Button>
                      <Button>Set as a Profile Photo</Button>
                      <Button type="danger" onClick={onRemovePost(post.id)}>Delete</Button>
                    </>
                  )
                  : <Button>Report</Button>}
              </Button.Group>
            )} 
          >
            <Icon type="ellipsis" />
          </Popover>,
        ]}
        title={post.RetweetId ? `${post.User.nickname} retweeted this post` : null}
        extra={<FollowButton post={post} onUnfollow={onUnfollow} onFollow={onFollow}/>}
      >
        {/* below is card contents */}
        {post.RetweetId && post.Retweet //retweet  한경우 카드 안에 다른 카드, 아니면 그냥 본인 카드
          ? (
            <Card
              cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
            >
  
              <Card.Meta
                avatar={(
                  <Link
                    href={{ pathname: '/user', query: { id: post.Retweet.User.id } }}
                    as={`/user/${post.Retweet.User.id}`}><a><Avatar shape={"square"} size={100} src={process.env.NODE_ENV ==="development" ? `${URL}/${post.User.profilePhoto}` 
                    : post.User.profilePhoto}></Avatar></a>
                  </Link>
                )} 
                title={post.Retweet.User.nickname+":  "+ moment(post.createdAt).format('DD.MM.YYYY')}
                // description={} // a tag x -> Link  리트윗 된거면 리트윈 컨텐츠로!
              />
              
              <PostCardContent postData={post.Retweet.content} />
              {/* {moment(post.createdAt).format('DD.MM.YYYY')} */}
            </Card>
          )
          : (
      
            <Card.Meta
              avatar={(
                <Link href={{ pathname: '/user', query: { id: post.User.id } }} as={`/user/${post.User.id}`}>
                  <a><Avatar shape={"square"} size={55} src={process.env.NODE_ENV ==="development" ? `${URL}/${post.User.profilePhoto}` 
                  : post.User.profilePhoto}></Avatar></a>
                </Link> 
                  
              )}
              title={post.User.nickname+":  "+ moment(post.createdAt).format('DD.MM.YYYY')}
              // description={"tetsdfasd;flkj"} // 나중에 서명 추가. 
            />
          )}
        {/* {moment(post.createdAt).format('DD.MM.YYYY')} */}
        <div style={{whiteSpace:"wrap", wordWrap: "break-word"}}>{editFormOpened ? <PostEditForm closeEditForm={closeEditForm} postId={post.id} postContent={post.content} ></PostEditForm>
        :<PostCardContent postData={post.content} />
         }</div>

        
       
      </Card>

      {/* End of Card */}
      {commentFormOpened && (
        <>
         <Row gutter={16}>
         <Col>

         <List
            header={`${post.Comments ? post.Comments.length : 0} comment`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={item => (
              
                <Comment style={{minHeight:"3rem"}}
                  author={item.User.nickname}
                  avatar={(
                    <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                      {/* 위와 같이 pathname 옵션으로 /user 하고, query 부분으로 객처를 넣어줘야 서버쪽 부분을 나눠줘야 새로고침 안 일어남 
                       as로 하면 그 부분이 주소로 나온다. 
                      */}
                      <a><Avatar shape={"square"} size={50} src={process.env.NODE_ENV ==="development" ? `${URL}/${item.User.profilePhoto}` 
                    : item.User.profilePhoto}></Avatar></a>
                    </Link>
                  )}
                  content={item.content} 
                /> 
              
            )}
          />
         
         </Col>

         </Row>



           <CommentForm post={post}/>
        </>
      )}
    </CardWrapper>
  );
});



export default PostCard;
