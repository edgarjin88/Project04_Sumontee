import React from 'react';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga'; 
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import axios from 'axios';
import Helmet from 'react-helmet';
import { Container } from 'next/app';
// import '../node_modules/antd/dist/antd'
import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas';
import { LOAD_USER_REQUEST } from '../reducers/user';
// import '../static/result.css'
// import '../node_modules/antd/dist/result.css'


const Front = ({ Component, store, pageProps }) => { 

  return (
    <Container>
      <Provider store={store}> 
    
        <Helmet 
          title="Sumontee"
          htmlAttributes={{ lang: 'en' }}
          meta={[{
            charset: 'UTF-8',
          }, {
            name: 'viewport',
            content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
          }, {
            'http-equiv': 'X-UA-Compatible', content: 'IE=edge',
     
          }, {
            name: 'description', content: 'Sumontee',
          }, {
            name: 'og:title', content: 'Sumontee',
          }, {
            name: 'og:description', content: 'Sumontee',
          }, {
            property: 'og:type', content: 'website',
            //open graph 
          }, {
            property: 'og:image', content: 'https://sumontee.com/favicon.ico',
        
          }]}
          link={[{
            rel: 'shortcut icon', href: '/favicon.ico',
          },
           {
             rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css',
            //  rel: 'stylesheet', href: '../static/result.css',
          }
          , {
            rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
          }, {
            rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
          }]}
          script={[{
            src: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js',
          }]}
        />
        <AppLayout>
          <Component {...pageProps} /> 
        </AppLayout>
      </Provider>
    </Container>
  );
};


Front.getInitialProps = async (context) => {  
  
  const { ctx, Component } = context;
  // console.log('thisis ctx', ctx);
  let pageProps = {}; 
  const state = ctx.store.getState(); // 
  const cookie = ctx.isServer ? ctx.req.headers.cookie : '';  //cookies는 여기 들어 있다. 근데 이 req 는 프론트로 들어오는 req?
  axios.defaults.headers.Cookie = ''
  if (ctx.isServer && cookie) {
    axios.defaults.headers.Cookie = cookie; 
  }



  if (!state.user.me) {
    // console.log('getinitialprops fired');
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,  
    });
  }
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx) || {};
  }
  // console.log('this is pageProps result', pageProps);
  return { pageProps }; //
};



const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : compose(
      applyMiddleware(...middlewares),
      !options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    );
  const store = createStore(reducer, initialState, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export default withRedux(configureStore)(withReduxSaga(Front));


