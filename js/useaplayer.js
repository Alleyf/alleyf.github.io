/*
 * @Author: Alleyf 3035581811@qq.com
 * @Github: https://github.com/Alleyf
 * @QQ: 3035581811
 * @Signature: You know more，you know less
 * @Date: 2023-04-29 01:01:06
 * @LastEditors: Alleyf 3035581811@qq.com
 * @LastEditTime: 2023-04-29 01:01:35
 * @FilePath: \undefinedd:\GH_Repos\myblog\themes\fluid\source\js\useaplayer.js
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
const ap = new APlayer({
  container: document.getElementById('aplayer'),
  fixed: true,
  lrcType: 3,
  audio: [
      {
          name: '花の塔',
          artist: 'さユり',
          url: 'http://music.163.com/song/media/outer/url?id=1956534872.mp3',
          cover: 'https://p2.music.126.net/fS_5RbP_4qg-RYreqp2tGg==/109951167558017839.jpg?param=130y130',
          lrc: 'https://moechun.fun/music/lrc/さユり - 花の塔.lrc'
      },
      {
          name: '花の塔',
          artist: 'さユり',
          url: 'http://music.163.com/song/media/outer/url?id=1956534872.mp3',
          cover: 'https://p2.music.126.net/fS_5RbP_4qg-RYreqp2tGg==/109951167558017839.jpg?param=130y130',
          lrc: 'https://moechun.fun/music/lrc/さユり - 花の塔.lrc'
      },
  ]
});
