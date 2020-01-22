import React from 'react';
import Helmet from 'react-helmet';
import Document, { Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components'; //for styled components

class MyDocument extends Document { 
  static getInitialProps(context) { // static
    const sheet = new ServerStyleSheet(); //ServerStleSheet의 인스탄스다. 
    const page = context.renderPage((App) => (props) => sheet.collectStyles(<App {...props} />));
  //sheet.collectStyles(<App {...props})



    const styleTags = sheet.getStyleElement(); 
    return { ...page, helmet: Helmet.renderStatic(), styleTags };
  }

  render() {
    const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
 
    const htmlAttrs = htmlAttributes.toComponent(); //
    const bodyAttrs = bodyAttributes.toComponent();

    return (
      <html {...htmlAttrs}> 
        <head>
          {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"/> */}
          {this.props.styleTags} 
          {/* styled serversiderendering */}
          {Object.values(helmet).map(el => el.toComponent())} 

          {/* Insde the helmet vlues, toComponent(). but why Object.values? because Keys would directly rende the 
          key names only */}
          {/* toComponent 하면 react component가 된다.  */}
          {/* <script src="https://rtcmulticonnection.herokuapp.com/dist/RTCMultiConnection.min.js"></script> */}
          {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script> */}
          <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
          {/* { <link rel="stylesheet" href='../node_modules/antd/dist/result.css'/>} */}
        </head>
        <body {...bodyAttrs}>
          <Main />
          {process.env.NODE_ENV === 'production' && <script src="
          https://polyfill.io/v3/polyfill.min.js?features=es5%2Ces6%2Ces2015%2Ces2016%2Ces2017%2Cdefault%2Ces7%2CNodeList.prototype.%40%40iterator%2CNodeList.prototype.forEach%2CRegExp.prototype.flags%2CNode.prototype.contains" />}
          <NextScript />
        </body>
      </html>
    );
  }
}


export default MyDocument;
