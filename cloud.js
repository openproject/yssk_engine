var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request) {
  return 'pppp';
});

/**
 * 定时整理一些数据
 */
AV.Cloud.define('adjust_data_category', function(request) {
    return 'ddd';
});

/**
 * 同步 zdata_news 到正式 news 表中
 */
AV.Cloud.afterSave('zdata_news', function(request) {

  var zdata_news = request.object;
  zdata_news.set('sync', false);

  var objectId = zdata_news.get('objectId');

  var title = zdata_news.get('title');
  var time = zdata_news.get('time');
  var duration = zdata_news.get('duration');
  var author = zdata_news.get('author');
  var origin_url = zdata_news.get('origin_url');
  var type = zdata_news.get('type');
  var img = zdata_news.get('img');

  var ext_id = zdata_news.get("ext_id");
  var ext_content = zdata_news.get('ext_content');
  var ext_app = zdata_news.get('ext_app');
  var ext_category = zdata_news.get('ext_category');

  var category_id = 10000;
  if (ext_app == '天天快报') {
      if (ext_category == '社会') {
        category_id = 3;
      } else if (ext_category == '娱乐') {
        category_id = 4;
      } else if (ext_category == '科技') {
        category_id = 5;
      } else if (ext_category == '财经') {
        category_id = 6;
      } else if (ext_category == '汽车') {
        category_id = 7;
      } else if (ext_category == '体育') {
        category_id = 8;
      } else if (ext_category == '军事') {
        category_id = 9;
      } else if (ext_category == '搞笑') {
        category_id = 10;
      } else if (ext_category == '美女') {
        category_id = 11;
      } else if (ext_category == '健康') {
        category_id = 12;
      } else if (ext_category == '房产') {
        category_id = 13;
      } else if (ext_category == '旅游') {
        category_id = 14;
      } else if (ext_category == '时尚') {
        category_id = 15;
      } else if (ext_category == '文化') {
        category_id = 16;
      } else if (ext_category == '育儿') {
        category_id = 17;
      } else if (ext_category == '数码') {
        category_id = 18;
      } else if (ext_category == '美食') {
        category_id = 19;
      } else if (ext_category == '电影') {
        category_id = 20;
      } else if (ext_category == '情感') {
        category_id = 21;
      } else if (ext_category == '家居') {
        category_id = 22;
      } else if (ext_category == '教育') {
        category_id = 23;
      } else if (ext_category == '宠物') {
        category_id = 24;
      } else if (ext_category == '游戏') {
        category_id = 25;
      } else if (ext_category == '股票') {
        category_id = 26;
      } else if (ext_category == '动漫') {
        category_id = 27;
      } else if (ext_category == '故事') {
        category_id = 28;
      } else if (ext_category == '语录') {
        category_id = 29;
      } else if (ext_category == '星座') {
        category_id = 30;
      } else if (ext_category == '摄影') {
        category_id = 31;
      } else if (ext_category == '生活') {
        category_id = 32;
      } else if (ext_category == '运动') {
        category_id = 33;
      } else if (ext_category == '工作') {
        category_id = 34;
      } else if (ext_category == '其他') {
        category_id = 10000;
      }
  }

  var News = AV.Object.extend('news_list');
  var news = new News();
  news.set('title', title);
  news.set('time', time);
  news.set('duration', duration);
  news.set('author', author);
  news.set('origin_url', origin_url);
  news.set('type', type);
  news.set('ext_id', ext_id);
  news.set('category_id', category_id);

  var imgList = [];
  var imgArray = JSON.parse(img);
  var Image = AV.Object.extend('news_image');
  for (var pos in imgArray) {
    var img = new Image();
    img.set("origin_url", imgArray[pos].url);
    img.set("desc", imgArray[pos].desc);
    imgList.push(img);
  }
  AV.Object.saveAll(imgList).then(function() {
    // var albums = news.relation('albums'); // 创建 AV.Relation
    // imgList.map(albums.add.bind(albums));

    news.addUnique("albums", imgList);

    return news.save();// 保存到云端
  }).then(function(news) {

    var Content = AV.Object.extend('news_content');
    var content = new Content();
    content.set('content', ext_content);
    content.set('news', news.get("objectId"));
    content.save();

    zdata_news.set('sync', true);
  }, function(error) {
    console.log('news save error:' + error);
  });

  console.log('zdata_news:' + request.object);
});
