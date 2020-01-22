import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import ImagesZoom from './ImagesZoom';
import {URL} from '../config/config'

const PostImages = ({ images }) => {
  
  const [showImagesZoom, setShowImagesZoom] = useState(false); // default value is false

  // export const URL = process.env.NODE_ENV === 'production' ? 'http://api.sumontee.com' : 'http://localhost:3065'

  const srcAddress = process.env.NODE_ENV ==="development" ? `${URL}/${images[0].src}` : images[0].src

  const onZoom = useCallback(() => {
    setShowImagesZoom(true); // 이 포스트 카드 state를 트루로 한다. setState!
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        <img src={srcAddress} onClick={onZoom} />
        {/* 기존의 localhost 부분은 전부 url로 변경 */}
        {/* image 클릭시 imagezoom component를 로딩 */}
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
        {/* showImagesZoom 이 트루라고 해서 이미지가 보이나? 일종의 삼항연산으로 생각하자.  */}
        {/* 또한 onClose 부분은 props로 넘어간 부분에 주목하자. */}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <div>
          <img src={srcAddress} width="50%" onClick={onZoom} /> 
          {/* images[0].src로 나중에 바꾼다 s3 설정 때문에 */}
          <img src={srcAddress} width="50%" onClick={onZoom} />
        </div>
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  return ( // 이미지가 세장일 때는 다르게 바꾸기. 더보기 버튼 추가. 
    <>
      <div>
        <img src={srcAddress} width="50%" onClick={onZoom} />
        <div
          style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
          onClick={onZoom}
        >
          <Icon type="plus" />
          <br />
          {images.length - 1}
          more pictures
        </div>
      </div>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};



export default PostImages;
