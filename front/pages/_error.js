import React from 'react';
import PropTypes from 'prop-types';
 //error 났을 때 실행되는 콤포넌트. 

//  class AA extends App{   // 이렇게 가는게 정석이다. 다른  App 같은 애들도 마찬가지. 
//    static getInitialProps(context){

//    }
//    render(){

//    }
//  }
const MyError = ({ statusCode }) => {
  return (
    <div>
      <h1>{statusCode} Error occured</h1>
    </div>
  );
};

MyError.propTypes = {
  statusCode: PropTypes.number,
};

MyError.defaultProps = {
  statusCode: 400,
};
 
MyError.getInitialProps = async (context) => {
  const statusCode = context.res ? context.res.statusCode : context.err ? context.err.statusCode : null;
  return { statusCode };
};

export default MyError;
