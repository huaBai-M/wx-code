const app = getApp();
const globalData = app.globalData;
console.log(globalData)
export default class LastMayday {
  palette() {
    return ({
      width: '654rpx',
      height: '1000rpx',
      borderRadius:'5rpx',
      background: 'rgba(34, 26, 99, 1)',
      views: [
        _image(0, 654, 400, 0, 0, 5,'http://groverimagefile.test.upcdn.net//18913870.jpg'),
        _des(0, '成功的人都是相似的', '250', '40','38','#fff'),
        _des(0, '不成功的人各有各的劣根性', '300', '20', '38', '#fff'),
        _image(3, 100, 100, 450, 20, 50, 'http://groverimagefile.test.upcdn.net//18913870.jpg'),
        _desLeft(0, '姓名~公司名称', '550', '20', '24', '#fff'),
        _des(0, '一周小结', '450', '40', '28', '#fff'),
        _des(0, '03.18-03.24', '480', '40', '28', '#fff'),
        _image(0, 80, 80, 650, 10, 0, 'http://groverimagefile.test.upcdn.net//18913870.jpg'),
        _desLeft(0, '浏览量11次', '690', '100', '24', '#fff'),

        _image(0, 80, 80, 750, 10, 0, 'http://groverimagefile.test.upcdn.net//18913870.jpg'),
        _desLeft(0, '转发量3次', '790', '100', '24', '#fff'),

        _image(0, 80, 80, 850, 10, 0, 'http://groverimagefile.test.upcdn.net//18913870.jpg'),
        _desLeft(0, '转发量3次', '890', '100', '24', '#fff'),

        _imageRight(0, 150, 150, 750, 10, 0, 'http://groverimagefile.test.upcdn.net//18913870.jpg'),
        _des(0, '查看我的名片', '910', '0', '28', '#fff'),
      ],
    });
  }
}

function _image(index, win, hei, top, left, borderRadius,url) {
  return (
    {
      type: 'image',
      url: url,
      css: {
        width: `${win}rpx`,
        height: `${hei}rpx`,
        top: `${top}rpx`,
        left: `${left}rpx`,
        borderRadius: `${borderRadius}rpx`,
      },
    }
  );
}
function _imageRight(index, win, hei, top, right, borderRadius,url) {
  return (
    {
      type: 'image',
      url: url,
      css: {
        width: `${win}rpx`,
        height: `${hei}rpx`,
        top: `${top}rpx`,
        right: `${right}rpx`,
        borderRadius: `${borderRadius}rpx`,
      },
    }
  );
}
function _des(index, content, top, right, fontsize, color) {
  const des = {
    type: 'text',
    text: content,
    css: {
      fontSize: `${fontsize}rpx`,
      color: color,
      top: `${top}rpx`,
      right: `${right}rpx`
    },
  };
  return des;
}
function _desLeft(index, content, top, left, fontsize, color) {
  const des = {
    type: 'text',
    text: content,
    css: {
      fontSize: `${fontsize}rpx`,
      color: color,
      top: `${top}rpx`,
      left: `${left}rpx`
    },
  };

  return des;
}