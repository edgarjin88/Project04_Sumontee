const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE ==='true'
})
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')

const withCSS = require('@zeit/next-css')
module.exports = withCSS(); 

module.exports = withBundleAnalyzer({  // 이걸로 감싸면 쓸 수 있다. 
  
  // next에 대한 설정을 하는 파일. 
  distDir: '.next',  //등으로 빌드 아웃풋 폴더를 바꿀 수 있다. 
  analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE), // Bundle_analyze의 환경 변수를 both로 만들어 주면 프론트와 서버 쪽 양쪽을 분석해 준다. 
  analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    }
  },
  // webpack: (config, {buildId, dev, isServer, defaultLoaders}) => {
  //   config.node = {
  //   fs: "empty"
  //   };
  //   return config;
  //   }
  //   }

  
  webpack(config){
    // console.log('confg',config);
    const prod = process.env.NODE_ENV === 'production'; 
    const plugins =[
      ...config.plugins,
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/en$/),
    
    ]; 
    config.node ={
      fs:"empty"
    }
    if(prod){
      plugins.push(prod&& new CompressionPlugin())
      //이친구가  index.js.gz 같은 식으로 이름을 바꾸고, 파일 용량은 삼분의 1 정도로 줄어든다. 
     //서버에서 gz 파일을 보내면 브라우져에서 바꾼다. 
    } // 참고로 여기로 뺀 이유는 그냥 바로 넣으면 개발화경에서 에러가 나기 때문에 변수 설정 밖으로. 

    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod? 'hidden-source-map' : 'eval', 
      plugins,
    }
  }
})

// package.json 등에 다음과 같은 부분을 추가해 준다. 그러나 윈도우에서는 안됨. 
// 윈도우에서는 cross-env를 설치해 줘야 한다.  "build": "cross-env BUNDLE_ANALYZE=both next build",
// "scripts": {
//   "dev": "nodemon",
//   "build": "BUNDLE_ANALYZE=both next build",
//   "start": "NODE_ENV=production next start"
// },


