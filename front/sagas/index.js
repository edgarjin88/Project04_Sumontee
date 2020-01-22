import { all, fork } from 'redux-saga/effects';
import axios from 'axios';
import user from './user';
import post from './post';
import {URL} from '../config/config'

axios.defaults.baseURL = `${URL}/api`;
// 어차피 실행되는건 여기서 실행되는 거기 때문에 axios.default 등을 여기에 설정해도 됨.
//굳이 여기 있을 필요는 없다. from import 로 불러온 것은 node에서 캐싱을 해 버리기 때문. 
//이뿌분 좀더 조사. 말이 되나? 그럼 왜 매 파일마다 import 하는 거지?
//사용을 위해 import는 해도, object 자체는 하나이기 때문에?
// 그러다면 socketio랑 certificate 부분도 해결가능할지도? \
// 브라우져는 그게 ssl 불가.<
// 왜 이런일이 일어나는가 
//

export default function* rootSaga() {
  yield all([
    fork(user),
    fork(post),
  ]);
}
