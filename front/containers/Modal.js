import React from 'react'
import { Modal, Icon, Card, Row, Col } from 'antd';
import {connect} from 'react-redux'; 
import {socket} from '../pages/index'
import Chatting from '../components/Chatting'

class Video extends React.Component {
  constructor(props){
    super(props)

    // this.modalRoot = typeof window !== 'undefined' ? document.getElementById('modal-root') : null
    this.myVideoArea = React.createRef(); 
    this.theirVideoArea = React.createRef();

    this.state = {
      ModalText: null,
      visible: false,
      confirmLoading: false,
      room: this.props.postId+"room",
      signalRoom:this.props.postId+"signalRoom",
      allState: this.props.allState,
      localUser: 'LOCAL USER',
      remoteUser: 'REMOTE USER'
    
    }

  }



  startSignaling = () => {
    this.displaySignalMessage("starting signaling...");
    
    this.rtcPeerConn = new RTCPeerConnection(this.configuration);
    
    this.rtcPeerConn.onicecandidate =  (evt) => {
      if (evt.candidate)

      this.socket.emit('signal',{"type":"ice candidate", "message": JSON.stringify({ 'candidate': evt.candidate }), "room":this.state.signalRoom}); //evt.candidate object 이 오직 하나 정해진 by rtc object
      this.displaySignalMessage("completed that ice candidate...");
    };
    
    this.rtcPeerConn.onnegotiationneeded =  () =>{
      this.displaySignalMessage("on negotiation called");
      this.rtcPeerConn.createOffer(this.sendLocalDesc, this.logError); 
    }
    
    this.rtcPeerConn.ontrack = (evt) => {
      this.displaySignalMessage("going to add their stream...");
      this.theirVideoArea.current.srcObject = evt.streams[0];
    };
    navigator.mediaDevices.getUserMedia({
      'audio': true,
      'video': true
    }).then((stream) => {
      this.displaySignalMessage("going to display my stream...");
      this.myVideoArea.current.srcObject = stream
      this.rtcPeerConn.addStream(stream);
    })
  }

  sendLocalDesc= (desc) =>{
    this.rtcPeerConn.setLocalDescription(desc,  () => {
      this.displaySignalMessage("sending local description");
      this.socket.emit('signal',{"type":"SDP", "message": JSON.stringify({ 'sdp': this.rtcPeerConn.localDescription }), "room":this.state.signalRoom}); //browser video codecs, resolution, and so on, in localdescription
    }, this.logError); 
  }
  
  logError =(error) => {
    this.displaySignalMessage(error.name + ': ' + error.message);
  }
  
  displaySignalMessage = (message) => {
    console.log(message);
  }
  
  handleMessage = (e) =>{
    e.preventDefault()
    this.socket.emit('send', {"author":myName.value, "message":myMessage.value, "room":this.state.room})
  }

  
///////////////////////////original modal//////////////////////////////////////
  handleOk = () => {
    this.handleClose()
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 100);
  };

  handleCancel = () => {
    this.handleClose()
    console.log('Clicked cancel button');
    this.setState({

      visible: false,
    });
  };

  
  showModal = async () => {
    await this.setState({
      id: this.props.id
    })
    if (!this.state.id) {
      return alert('Login required');
    }
    else{
      this.setState({
        ModalText: null,
        visible: true,
      });
    }
  };

  testSocket=()=>{

    this.socket = socket
    this.socket.on('connect', () => {
      // socket.emit('ready', 'haha')
      console.log('ready message fired');
    })
    this.socket.emit('ready', {
      "chat_room": this.state.room,
      "signal_room": this.state.signalRoom
    })

    this.configuration = {
      'iceServers': [{
        'url': 'stun:stun.l.google.com:19302'
      }]
    }




    this.socket.emit('signal', {
      "type": "user_here",
      "message": "Are you ready for a call?",
      "room": this.state.signalRoom
    });

    this.socket.on('signaling_message', (data) => {
      this.displaySignalMessage("Signal received: " + data.type);

      //Setup the RTC Peer Connection object
      if (!this.rtcPeerConn)
        this.startSignaling();

      if (data.type != "user_here") {
        var message = JSON.parse(data.message);
        if (message.sdp) {
          this.rtcPeerConn.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
            // if we received an offer, we need to answer
            if (this.rtcPeerConn.remoteDescription.type == 'offer') {
              this.rtcPeerConn.createAnswer(this.sendLocalDesc, this.logError);
            }
          }, this.logError);
        } else {
          this.rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
      }

    })
  }

  handleClick=()=>{
    this.showModal()
    this.testSocket()
  }
  vidOff() {

    let stream = this.myVideoArea.current.srcObject;
    let tracks = stream ? stream.getTracks() : undefined; 
    if(tracks){
      tracks.forEach((track)=>{
        track.stop();
    });
    }
 

    // this.myVideoArea.current.stop(); //혹은 srcObject
    this.myVideoArea.current.srcObject = null;
}

  leaveRoom=()=>{
    this.socket.emit('close', {room: this.state.room, signalRoom: this.state.signalRoom})
    console.log('leave room fired');
    
  }
  handleClose =() =>{
    this.leaveRoom()
    
    this.vidOff()
    if(this.rtcPeerConn){
      this.rtcPeerConn.close()
      this.rtcPeerConn= null
      
    }
   

}

/////////////////////////////original modal///////////////////////////////
  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <div >
        <Icon
          type="video-camera" key="video-camera" style={{color:"green"}} twoToneColor="#eb2f96" onClick={this.handleClick} />
        <Modal bodyStyle={{backgroundColor:"#dde0f056", padding:"0.5rem"}}
        title="Conference Call" visible={visible} onOk={this.handleOk} confirmLoading={confirmLoading} onCancel={this.handleCancel}>
          <div>
          
       
        {/* <div className="content"> */}
        <Row >
          <Col xs={12} md={12} xl={12}>
              <Card title={<Row type="flex" justify="center"><span><Icon type="camera" theme="filled" /> VIDEO 1 </span></Row> } cover={<video 
              style={{height:"15vh"}}
              ref={this.myVideoArea} autoPlay muted="muted"></video>}>
                <Card.Meta title={<Row type='flex' justify="center"><span>LOCAL <Icon type="user" /></span></Row>} 
                      />
                  
                  </Card>
          </Col>

            
          <Col xs={12} md={12} xl={12}>
          <Card title={<Row type="flex" justify="center" ><span><Icon type="camera" theme="filled" /> VIDEO 2 </span></Row> }  cover={<video style={{height:"15vh"}} ref={this.theirVideoArea} autoPlay></video>}>
                  <Card.Meta
                    title={<Row type='flex' justify="center"><span>REMOTE <Icon type="user" /></span></Row>} 
                      />
                </Card>
          </Col>
        </Row>

          {/* <p>{ModalText}</p> */}
          </div>
          <Chatting room={this.state.room} signalRoom={this.state.signalRoom}/>
          </Modal>
          
      </div>
    );


    }}

  const mapStateToProps = (state)=>{
    return {allState:state}
  }

  export default connect(mapStateToProps)(Video)


