import { Comment, Avatar, Form, Button, List, Input, Card, Col, Row  } from 'antd';
import {connect} from 'react-redux'
import {createRef} from 'react'
import {socket} from '../pages/index'
import {URL} from '../config/config.js'

const { TextArea } = Input;



const CommentList = ({ comments }) => {

return (
  // if(comments.author === this.props.nickName)

    <div> 
    <Row gutter={16}>
    <Col   >
        <List 
            dataSource={comments}
            locale={{emptyText:"No Message yet."}}
            itemLayout="horizontal"
            renderItem={props => <Comment style={{padding:"1px", marginLeft:"-1rem", marginBottom:"-2rem"}} onChange={scroll} {...props}  />}
          />
      </Col>

    </Row>

  </div>
)
}

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Row gutter={8}>
      <Col xs={18} md={20} xl={20}>
        <Form.Item>
          <TextArea rows={2} onChange={onChange} value={value} onPressEnter={onSubmit} />
        </Form.Item>
      </Col>

      <Col xs={2} md={4} xl={4} >
        <Form.Item>
        <Button htmlType="submit" loading={submitting} onClick={onSubmit}  type="primary">
          Send
        </Button>
        </Form.Item>
      </Col>
  

    </Row>

  </div>
);

////////////////


class Chatting extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      comments: [],
      submitting: false,
      value: '',
      room:this.props.room,
      nickName:this.props.nickName,
      signalRoom:this.props.signalRoom,
      allState:this.props.allState,
      profilePhoto:this.props.profilePhoto

    }
    this.divRef = createRef()
    this.socket = socket


  }

  // this.socket.on('messageFromServer', (msg)=>{
  //   console.log('msg from server', msg);
  // })

  scrollBottom = () =>{
    // console.log(this.divRef.current);
    const scrollHeight = this.divRef.current.scrollHeight;
    const height = this.divRef.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.divRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  componentDidMount= ()=>{
    
    this.socket.on('messageFromServer', (msg)=>{
      // console.log('msg from server', msg);
      

      this.setState({comments: [ ...this.state.comments,
        {
          author: msg.nickName,
          avatar: process.env.NODE_ENV ==="development" ? `${URL}/${msg.profilePhoto}` 
          : msg.profilePhoto,
          content: <p>{msg.message}</p>,
          // datetime: moment().fromNow(),
          //여기다가 다이나믹 링크 정해주면 되겠네. 
        }
      ]
    })

      // this.setState({message:msg})
      })



  }

  ///unmount 시에 socket을 클로징 하는 것도 해야할듯? 
  // webrtc가 아니라 socket 단위에서 클로징. 


  componentDidUpdate= () =>{// did update시에 해야 했었나? 
    this.scrollBottom()
  }

  // <Chatting room={this.state.room} signalRoom={this.state.signalRoom}/>



  handleSubmit = () => {
    // console.log(this.state.allState);
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true,
    });

    
    this.socket.emit('messageToServer', ({
      message:this.state.value, 
      nickName:this.props.nickName,
      room:this.state.room,
      profilePhoto:this.state.profilePhoto,
      signalRoom:this.state.signalRoom

    }))

  
    setTimeout(() => {
      this.setState({
        submitting: false,
        value: '',
        comments: [ ...this.state.comments,
          {
            author: this.props.nickName,
            avatar: process.env.NODE_ENV ==="development" ? `${URL}/${this.state.profilePhoto}` 
            : this.state.profilePhoto,
            content: <p>{this.state.value}</p>,
            // datetime: moment().fromNow(),
          }
        ],
      });
    }, 500);
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { comments, submitting, value } = this.state;

    return (
      <div >
        <Row > 
          <Col xs={24} md={24} lg={24}>
            <div  ref={this.divRef} 
            style={{ backgroundColor: "white", padding: '8px', height:"40vh", marginTop:"0.2rem", 
                    overflowY:'auto', borderRadius:"0.5rem", 
                    border:'solid 1px grey'
            }}> 
              <CommentList comments={comments} />
            </div>
          </Col>
        </Row>
        <Comment style={{marginBottom:"-1.5rem", padding:"1px"}}
          avatar={
            <Avatar
              author={this.props.nickName}
              src={process.env.NODE_ENV ==="development" ? `${URL}/${this.state.profilePhoto}` 
              : this.state.profilePhoto}
              alt={this.props.nickName}
              // shape={"square"}
            />
          }   
          content={
            <Editor 
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />


      </div>
    );
  }
}


const mapStateToProps = (state)=>{
  return {nickName: state.user.me.nickname, 
    profilePhoto: state.post.profilePhoto || state.user.me.profilePhoto,
  allState: state}
}

export default connect(mapStateToProps)(Chatting)

//comment에 데이터 내것과 상대방 구분해서 넣기. 
// 상대방에게 데이터 보내기. 
//상대방으로 부터 데이터 받기. 