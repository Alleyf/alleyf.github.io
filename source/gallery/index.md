---
title: 画廊
date: 2022-09-08 17:31:10
layout: gallery
---

<style>
        /* 基础样式重置 */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --gap-size: 1.5rem;
            --card-radius: 12px;
            --transition-speed: 0.3s;
        }

        /* 响应式网格布局 */
        .ImageGrid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* 最小单元格 300px */
            gap: var(--gap-size);
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            background: #f9fafb ;
            border-radius: var(--card-radius);
        }

        /* 卡片容器 */
        .card {
            background: #fff ;
            border-radius: var(--card-radius);
            overflow: hidden;
            transition: transform var(--transition-speed) ease, 
                        box-shadow var(--transition-speed) ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        /* 悬停效果 */
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        /* 图片容器 */
        .ImageInCard {
            position: relative;
            aspect-ratio: 16 / 9; /* 固定宽高比（16:9）*/
            background: #f3f4f6 ; /* 占位背景色 */
            overflow: hidden;
        }

        /* 图片样式 */
        .ImageInCard img {
            width: 100%;
            height: 100%;
            object-fit: cover; /* 关键：统一裁剪显示 [[5]] [[8]] */
            border-radius: var(--card-radius) var(--card-radius) 0 0;
            transition: transform calc(var(--transition-speed) * 1.5) ease;
        }

        /* 悬停叠加效果 */
        .ImageInCard::after {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: linear-gradient(to top, rgba(0,0,0,0.4), transparent 40%);
            opacity: 0;
            transition: opacity var(--transition-speed) ease;
        }

        .card:hover .ImageInCard::after {
            opacity: 1;
        }

        .card:hover .ImageInCard img {
            transform: scale(1.05); /* 微型放大效果 */
        }

        /* 动画效果 */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .animated {
            animation: fadeIn 0.6s ease-out forwards;
        }

        /* 暗色模式 */
        @media (prefers-color-scheme: dark) {
            .ImageGrid {
                background: #111827 ;
            }
            .card {
                background: #1f2937 ;
            }
            .ImageInCard {
                background: #1f2937 ;
            }
        }

        /* 移动端优化 */
        @media (max-width: 640px) {
            .ImageGrid {
                grid-template-columns: 1fr; /* 单列显示 */
                padding: 1rem;
            }
        }
    </style>
<div id="imageTab"></div>  
<div class="ImageGrid"></div>
<script>
        // 初始化动画
        document.addEventListener('DOMContentLoaded', () => {
            const images = document.querySelectorAll('.ImageInCard img');
            images.forEach(img => {
                img.classList.add('animated');
            });
        });
</script>