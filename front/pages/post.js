import React from 'react';
import { useSelector } from 'react-redux';
import Helmet from 'react-helmet';
import { LOAD_POST_REQUEST } from '../reducers/post';
import {URL} from '../config/config'


// const srcAddress = process.env.NODE_ENV ==="development" ? `${URL}/${v.src}` : v.src

const Post = ({ id }) => {
  const { singlePost } = useSelector(state => state.post);
  return (
    <> 
      <Helmet 
        title={`${singlePost.User.nickname}'s post`}
        description={singlePost.content}
        meta={[{
          name: 'description', content: singlePost.content,
        }, {
          property: 'og:title', content: `${singlePost.User.nickname}'s post`,
        }, {
          property: 'og:description', content: singlePost.content,
        }, {
          property: 'og:image', content: singlePost.Images[0] ? singlePost.Images[0].src : 'https://sumontee.com/favicon.ico'
        }, {
          property: 'og:url', content: `https://sumontee.com/post/${id}`,
        }]}
      /> 
      <div itemScope="content">{singlePost.content}</div>
      <div itemScope="author">{singlePost.User.nickname}</div>
      <div>
        {singlePost.Images[0] && <img src={singlePost.Images[0].src} />}
      </div>
    </>
  );
};

Post.getInitialProps = async (context) => {
   context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.query.id,
  });
  return { id: parseInt(context.query.id, 10) };
};



export default Post;
