import {Button, Card, Icon, List} from 'antd';
import React from 'react';


const FollowList = ({
  header, 
  hasMore,
  onClickMore,
  onClickStop,
  data

}) =>{
  return(
    <List
    style={{ marginBottom: '20px' }}
    grid={{ gutter: 4, xs: 2, md: 3 }}
    size="small"
    header={<div>{header}</div>}
    loadMore={hasMore && <Button style={{ width: '100%' }} onClick={onClickMore}>Read more</Button>}
    // hasMoreFollowing 같은 부분이 트루일 경우에는 더보기 버튼이 보이게 되는 것이다. 
    //일단 데이터를 먼저 불러오고, 그다음 불러올 데이터가 트루니까 더보기도 트루. 
    // 하나라도 남아있으면 여전히 트루니까 더보기도 트루. 
    // 아무것도 안 남으면 더보기는 안보인다. 즉, Read More 하기 전에 이미 데이터가 불러와 있어야 한다 . 
    bordered
    dataSource={data}            // number of datasource를 가지고 맵을 돌린다.  안트디자인 소성
  
    renderItem={item => (  //이 item 관한 것들이 반복되서 들어간다. 
      //반복문 돌린 결과들이 renderItem에 들어간다. item은 참고로 antd 속성
      <List.Item style={{ marginTop: '20px' }}>
        <Card actions={[<Icon key="stop" type="stop" onClick={onClickStop(item.id)} />]}>
          <Card.Meta description={item.nickname} />
        </Card>
      </List.Item>
    )}
  />
  )

}

export default FollowList