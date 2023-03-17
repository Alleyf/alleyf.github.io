// /*
//  * @Author: Alleyf 3035581811@qq.com
//  * @Github: https://github.com/Alleyf
//  * @QQ: 3035581811
//  * @Signature: You know more，you know less
//  * @Date: 2022-11-20 14:05:22
//  * @LastEditors: Alleyf 3035581811@qq.com
//  * @LastEditTime: 2022-11-20 14:34:56
//  * @FilePath: \undefinedd:\GH_Repos\myblog\source\js\addMusic.js
//  * Copyright (c) 2022 by Alleyf 3035581811@qq.com, All Rights Reserved. 
//  */
// //       window.onload = function (){
// //         let mycenter = document.createElement('center');
// //         let myiframe = document.createElement('iframe');
// //         myiframe.setAttribute('src','//music.163.com/outchain/player?type=2&id=475479888&auto=1&height=66');
// //         myiframe.setAttribute('style','frameborder:no; border:0; marginwidth:0; marginheight:0; width:400; height:86')
// //             //把div添加到body作为他的子元素
// //             mycenter.appendChild(myiframe);
// //             document.body.appendChild(mycenter);
// // }

// <meting-js metin="meting" auto="https://y.qq.com/n/ryqq/song/003kIhRR4Vr0cV.html" autoplay="true">
// <div class="aplayer aplayer-withlrc">
// <div class="aplayer-body">
//     <div class="aplayer-pic" style="background-image: url(&quot;https://api.i-meto.com/meting/api?server=tencent&amp;type=pic&amp;id=0044qCTG0ydXTP&amp;auth=6365174942e5f7e1a07f3b7c94b1eda74c8b2489&quot;);background-color: #b7daff;">
//         <div class="aplayer-button aplayer-pause"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 17 32"><path d="M14.080 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048zM2.88 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048z"></path></svg></div>
//     </div>
//     <div class="aplayer-info">
//         <div class="aplayer-music">
//             <span class="aplayer-title">Memories</span>
//             <span class="aplayer-author"> - MOZIYU</span>
//         </div>
//         <div class="aplayer-lrc">
//             <div class="aplayer-lrc-contents" style="transform: translateY(0); -webkit-transform: translateY(0);"></div>
//         </div>
//         <div class="aplayer-controller">
//             <div class="aplayer-bar-wrap">
//                 <div class="aplayer-bar">
//                     <div class="aplayer-loaded" style="width: 100%;"></div>
//                     <div class="aplayer-played" style="width: 70.8081%; background: rgb(183, 218, 255);">
//                         <span class="aplayer-thumb" style="background: #b7daff;">
//                             <span class="aplayer-loading-icon"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M4 16c0-6.6 5.4-12 12-12s12 5.4 12 12c0 1.2-0.8 2-2 2s-2-0.8-2-2c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8c1.2 0 2 0.8 2 2s-0.8 2-2 2c-6.6 0-12-5.4-12-12z"></path></svg></span>
//                         </span>
//                     </div>
//                 </div>
//             </div>
//             <div class="aplayer-time">
//                 <span class="aplayer-time-inner">
//                     <span class="aplayer-ptime">01:54</span> / <span class="aplayer-dtime">02:41</span>
//                 </span>
//                 <span class="aplayer-icon aplayer-icon-back">
//                     <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z"></path></svg>
//                 </span>
//                 <span class="aplayer-icon aplayer-icon-play"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 17 32"><path d="M14.080 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048zM2.88 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048z"></path></svg></span>
//                 <span class="aplayer-icon aplayer-icon-forward">
//                     <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z"></path></svg>
//                 </span>
//                 <div class="aplayer-volume-wrap">
//                     <button type="button" class="aplayer-icon aplayer-icon-volume-down"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 28 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528z"></path></svg></button>
//                     <div class="aplayer-volume-bar-wrap">
//                         <div class="aplayer-volume-bar">
//                             <div class="aplayer-volume" style="height: 70%; background: rgb(183, 218, 255);"></div>
//                         </div>
//                     </div>
//                 </div>
//                 <button type="button" class="aplayer-icon aplayer-icon-order">
//                     <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M0.622 18.334h19.54v7.55l11.052-9.412-11.052-9.413v7.549h-19.54v3.725z"></path></svg>
//                 </button>
//                 <button type="button" class="aplayer-icon aplayer-icon-loop">
//                     <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 29 32"><path d="M9.333 9.333h13.333v4l5.333-5.333-5.333-5.333v4h-16v8h2.667v-5.333zM22.667 22.667h-13.333v-4l-5.333 5.333 5.333 5.333v-4h16v-8h-2.667v5.333z"></path></svg>
//                 </button>
//                 <button type="button" class="aplayer-icon aplayer-icon-menu">
//                     <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 22 32"><path d="M20.8 14.4q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2zM1.6 11.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2zM20.8 20.8q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2z"></path></svg>
//                 </button>
//                 <button type="button" class="aplayer-icon aplayer-icon-lrc">
//                     <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M26.667 5.333h-21.333c-0 0-0.001 0-0.001 0-1.472 0-2.666 1.194-2.666 2.666 0 0 0 0.001 0 0.001v-0 16c0 0 0 0.001 0 0.001 0 1.472 1.194 2.666 2.666 2.666 0 0 0.001 0 0.001 0h21.333c0 0 0.001 0 0.001 0 1.472 0 2.666-1.194 2.666-2.666 0-0 0-0.001 0-0.001v0-16c0-0 0-0.001 0-0.001 0-1.472-1.194-2.666-2.666-2.666-0 0-0.001 0-0.001 0h0zM5.333 16h5.333v2.667h-5.333v-2.667zM18.667 24h-13.333v-2.667h13.333v2.667zM26.667 24h-5.333v-2.667h5.333v2.667zM26.667 18.667h-13.333v-2.667h13.333v2.667z"></path></svg>
//                 </button>
//             </div>
//         </div>
//     </div>
//     <div class="aplayer-notice"></div>
//     <div class="aplayer-miniswitcher"><button class="aplayer-icon"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M22 16l-10.105-10.6-1.895 1.987 8.211 8.613-8.211 8.612 1.895 1.988 8.211-8.613z"></path></svg></button></div>
// </div>
// <div class="aplayer-list" style="max-height: 250px">
//     <ol style="max-height: 250px">
        
// <li class="aplayer-list-light">
//     <span class="aplayer-list-cur" style="background-color: #b7daff;"></span>
//     <span class="aplayer-list-index">1</span>
//     <span class="aplayer-list-title">Memories</span>
//     <span class="aplayer-list-author">MOZIYU</span>
// </li>

//     </ol>
// </div>
// </div>
// </meting-js>