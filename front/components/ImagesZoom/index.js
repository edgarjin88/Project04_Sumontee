import React, { useState} from 'react';
import Slick from 'react-slick'; // image slider 역할
import { Overlay, Header, CloseBtn, SlickWrapper, ImgWrapper, Indicator } from './style';
import {URL} from '../../config/config'

// const Overlay  = styled.div`
//   position: fixed;
//   z-index: 500;
//   top:0;
//   left:0; 
// `  이렇게 하면 Overlay 라는 styled component가 생긴다. header 면 styled.header`` 으로 간다. 

//slick 관련 css 를 _app.js에 넣어줘야 한다. 그래야만 react-slick이 잘 작동됨
// let v =''
// let srcAddress = process.env.NODE_ENV ==="development" ? `${URL}/${v.src}` : v.src 
// 이런식으로 안되는듯. 다이나믹해

const ImagesZoom = ({ images, onClose }) => {  //onClose는 부모로 붙어 받은 props
  const [currentSlide, setCurrentSlide] = useState(0);

  // console.log('this is images', images);
  return (
    <Overlay>
      <Header>
        <h1>Images</h1>
        <CloseBtn type="close" onClick={onClose} />
      </Header>
      <SlickWrapper>
        <div>
          <Slick  
            initialSlide={0}  //initialSlide 
            afterChange={slide => setCurrentSlide(slide)} //change index for current slider. 
            infinite={false}
            arrows
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map((v) => { //each slider
              return (
                <ImgWrapper>
                  <img key={v.id} src={process.env.NODE_ENV ==="development" ? `${URL}/${v.src}` : v.src} />
                </ImgWrapper>
              );
            })}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length} 
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};


export default ImagesZoom;
