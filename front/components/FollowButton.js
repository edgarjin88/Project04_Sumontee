import React, {memo} from 'react';
import {Button, Icon} from 'antd';
import {useSelector} from 'react-redux'; 

const FollowButton =memo(({post, onUnfollow, onFollow}) =>{
  const {me} = useSelector(state => state.user)

  return !me || post.User.id === me.id //로그인을 안했거나, 개시글이 내 개시글이면! null되기 
          ? null
          : me.Followings && me.Followings.find(v => v.id === post.User.id)
          // 결과적으로  && 뒷부분의 결과가 값이 된다. 
          // 로그인 했고 && 내 팔로우 목록에 그 사람이 들어있으면 
            ? <Button onClick={onUnfollow(post.User.id)}><Icon type="usergroup-delete" /> Unfollow</Button>
            // 언팔로우 버튼이 들어가고
            : <Button onClick={onFollow(post.User.id)}><Icon type="usergroup-add" />Follow</Button> 
            // 그게 아니면 팔로우 버튼이 들어간다. 
            //모두는 high order function

})

FollowButton.defaultProps ={
  me: null,
}

export default FollowButton;