---
title: gallery
date: 2022-09-08 17:31:10
layout: gallery
---
<style>  

/* 设置图片样式 */
img {
  border-radius: 10px; /* 添加圆角边框 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

/* 设置图片悬停效果 */
img:hover {
  transform: scale(1.1); /* 图片放大1.1倍 */
}

/* 设置图片动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0; /* 初始透明度为0 */
    transform: translateY(20px); /* 初始位置向下偏移20像素 */
  }
  
  to {
    opacity: 1; /* 最终透明度为1 */
    transform: translateY(0); /* 最终位置恢复原始位置 */
  }
}

/* 应用动画效果到图片上 */
img.animated {
  animation-name: fadeIn; /* 使用fadeIn动画效果 */
  animation-duration: .5s; /* 动画持续时间为0.5秒 */
}

.ImageGrid {  
width: 100%;  
max-width: 1040px;  
margin: 0 auto;  
text-align: center;  
}  
.card {  
overflow: hidden;  
transition: .3s ease-in-out;  
border-radius: 8px;  
background-color: rgba(180,180,180,0.2);  
padding: 1.4px;  
}  
.ImageInCard img {  
padding: 0;  
border-radius: 8px;  
width:100%;  
height:100%;  
}  
@media (prefers-color-scheme: dark) {  
.card {background-color: rgba(180,180,180,0.2);}  

}  
</style>  
<div id="imageTab"></div>  
<div class="ImageGrid"></div>
<script>
const images = document.querySelectorAll("img");
images.forEach(image => {
  image.classList.add("animated");
});
</script>