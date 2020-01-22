import React from 'react';
import Link from 'next/link';


const PostCardContent = ({ postData }) => {
  return (
    <div style={{fontSize:"1.1rem" }}>
      {postData.split(/(#[^\s]+)/g).map((v) => { // 해쉬테그 찾아내기 
        if (v.match(/#[^\s]+/)) {
          return (
            <Link
              href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }} //링크로 바꿈 
              as={`/hashtag/${v.slice(1)}`} //동적라우팅 
              key={v}
            >
              <a>{v}</a>
            </Link>
          );
        }
        return v;
      })}
    </div>
  );
};



export default PostCardContent;
