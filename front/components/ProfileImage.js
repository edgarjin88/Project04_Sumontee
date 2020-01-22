import React from 'react';


const ProfileImage = ({ images }) => {
  

  return ( 
    <>
      <div>
        <img src={images} width="100%" />
{/* 아바타랑 같이 쉐어를 안하는 구나. 어느 컴퍼넌트 쓰는지 보자.  */}
      </div>
    </>
  );
};



export default ProfileImage;
