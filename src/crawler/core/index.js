console.log(".....核心.....");

import fs from 'fs';
import request from 'request-promise';
import cheerio from 'cheerio';
import mkdirp from 'mkdirp';

async function download(ctx,next){

  // 创建目录
  const dir ='downloadImagesFile';
  mkdirp(dir);

  // 图片链接地址
  let linkArr=[];
  let urlArr=[];
  let taskArr=[];
  let downloadTaskArr=[];
  let url=config.url;

  for (let i = 1; i <= config.size; i++) {
    let link = url + '_' + i + '.html';
    if (i == 1) {
       link = url + '.html';
    }
    taskArr.push(getResLink(i, link))
  }

  linkArr = await Promise.all(taskArr)
  console.log('连接数： ', linkArr.length);

  for (var i = 0; i < linkArr.length; i++) {
      let item = linkArr[i];
      let index = item.split('___')[0];
      let src = item.split('___')[1];
      downloadTaskArr.push(downloadImg(src, dir, index + linkArr[i].substr(-4, 4)));
  }

  await Promise.all(downloadTaskArr);

}

async function downloadImg(url, dir, filename) {
    console.log('download begin---', url);
    request.get(url).pipe(fs.createWriteStream(dir + "/" + filename)).on('close', function() {
        console.log('download success', url);
    });
}

async function getResLink(index, url) {
    const body = await request(url);
    let urls = [];
    var $ = cheerio.load(body);
    $(config.rule).each(function() {
        var src = $(this).attr('src');
        urls.push(src);
    });
    return index + '___' + urls[0];
}

export default
