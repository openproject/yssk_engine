var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request) {
  return 'pppp';
});

AV.Cloud.beforeSave('zdata_news', function(request) {

  var news = request.object;

   console.log('zdata_news:' + news.title);
});
