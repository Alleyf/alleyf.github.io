const BaseAdapter = require('./BaseAdapter');
const FormData = require('form-data');
const { marked } = require('marked');
const matter = require('gray-matter');

/**
 * 知乎专栏适配器
 * 基于 Wechatsync 项目的实现
 */
class ZhihuAdapter extends BaseAdapter {
  constructor() {
    super();
    this.name = 'zhihu';
    this.displayName = '知乎';
    this.icon = '🔵';
    this.supportedTypes = ['html'];
  }

  /**
   * 检查认证状态
   */
  async checkAuth() {
    try {
      const response = await this.httpClient.get(
        'https://www.zhihu.com/api/v4/me?include=account_status'
      );
      return response.status === 200 && response.data.id;
    } catch (error) {
      console.error('Zhihu checkAuth error:', error.message);
      return false;
    }
  }

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    try {
      const response = await this.httpClient.get(
        'https://www.zhihu.com/api/v4/me?include=account_status,is_bind_phone,email'
      );

      console.log('Zhihu user info:', response.data.name);

      return {
        uid: response.data.id,
        username: response.data.name,
        avatar: response.data.avatar_url,
        email: response.data.email || '',
      };
    } catch (error) {
      throw new Error(`获取用户信息失败: ${error.message}`);
    }
  }

  /**
   * 解析 Front Matter 并提取元数据
   */
  parseFrontMatter(content) {
    try {
      const parsed = matter(content);
      return {
        metadata: parsed.data,
        content: parsed.content,
      };
    } catch (error) {
      console.error('Parse front matter error:', error);
      return {
        metadata: {},
        content: content,
      };
    }
  }

  /**
   * 提取封面图
   */
  extractCoverImage(content, metadata) {
    // 1. 优先使用元数据中的 image
    if (metadata.image) {
      return metadata.image;
    }

    // 2. 从文章内容中提取第一张图片
    const mdImageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (mdImageMatch) {
      return mdImageMatch[2];
    }

    const htmlImageMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
    if (htmlImageMatch) {
      return htmlImageMatch[1];
    }

    return null;
  }

  /**
   * 创建草稿
   */
  async createDraft(post) {
    try {
      // 解析 Front Matter
      const { metadata, content } = this.parseFrontMatter(post.content);
      console.log('Zhihu metadata:', metadata);

      // 使用元数据中的标题（如果有）
      const title = metadata.title || post.title;

      // 1. 创建草稿（只需要标题）
      console.log('Creating Zhihu draft with title:', title);
      const draftResponse = await this.httpClient.post(
        'https://zhuanlan.zhihu.com/api/articles/drafts',
        {
          title: title,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const postId = draftResponse.data.id.toString();
      console.log('✅ Draft created with ID:', postId);

      // 2. 上传 Markdown 中的图片并替换 URL
      const contentWithUploadedImages = await this.uploadMarkdownImages(content);

      // 3. 转换 Markdown 为知乎 HTML
      let htmlContent = this.markdownToZhihuHtml(contentWithUploadedImages);

      // 4. 提取封面图
      const coverImageUrl = this.extractCoverImage(content, metadata);
      let titleImage = '';
      let coverImageSrc = '';
      
      if (coverImageUrl) {
        try {
          console.log('📸 Uploading cover image to Zhihu:', coverImageUrl);
          const coverResult = await this.uploadCoverImage(coverImageUrl);
          titleImage = coverResult.url; // 使用完整的图片 URL
          coverImageSrc = coverResult.url;
          console.log('✅ Cover uploaded successfully');
          console.log('   - Image ID:', coverResult.imageId);
          console.log('   - URL:', coverImageSrc);

          // 在内容开头添加封面图
          // 直接使用原图 URL，让知乎自动处理
          console.log('Using original image URL in content:', coverImageUrl);
          
          const coverImageHtml = `<figure><img src="${coverImageUrl}" data-caption="" data-size="normal" data-rawwidth="1200" data-rawheight="675" class="origin_image zh-lightbox-thumb" width="1200" data-original="${coverImageUrl}"></figure>`;
          htmlContent = coverImageHtml + htmlContent;
          console.log('✅ Cover image added to content');
        } catch (error) {
          console.error('❌ Upload cover failed:', error.message);
          // 封面上传失败，尝试直接使用原图 URL
          if (coverImageUrl.startsWith('http')) {
            console.log('⚠️  Using original cover URL in content');
            const coverImageHtml = `<p><img src="${coverImageUrl}" data-caption="" data-size="normal" data-rawwidth="1200" data-rawheight="675" class="origin_image zh-lightbox-thumb" width="1200" data-original="${coverImageUrl}"></p><p><br></p>`;
            htmlContent = coverImageHtml + htmlContent;
          }
        }
      }

      // 5. 更新草稿内容
      console.log('Updating draft content...');
      const updateData = {
        title: title,
        content: htmlContent,
      };
      
      // 不设置 titleImage，让知乎自动从内容中识别封面
      // 知乎会自动将第一张图片作为封面
      console.log('⚠️  Not setting titleImage, let Zhihu auto-detect from content');
      
      await this.updatePost(postId, updateData);

      return {
        success: true,
        postId: postId,
        draftLink: `https://zhuanlan.zhihu.com/p/${postId}/edit`,
        message: '草稿创建成功！请在知乎专栏后台查看并发布',
      };
    } catch (error) {
      console.error('Zhihu createDraft error:', error);
      throw new Error(`创建草稿失败: ${error.message}`);
    }
  }

  /**
   * 上传 Markdown 中的图片并替换 URL
   */
  async uploadMarkdownImages(markdown) {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const matches = [...markdown.matchAll(imageRegex)];

    console.log(`Found ${matches.length} images in markdown`);

    let processedMarkdown = markdown;

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const fullMatch = match[0];
      const alt = match[1];
      const originalUrl = match[2];

      // 跳过已经是知乎 CDN 的图片
      if (originalUrl.includes('zhimg.com')) {
        continue;
      }

      try {
        console.log(`Uploading markdown image ${i + 1}/${matches.length}:`, originalUrl);

        // 上传图片（通过 URL）
        const uploadResult = await this.uploadImageByUrl(originalUrl);

        // 替换 Markdown 中的图片 URL
        const newMarkdownImage = `![${alt}](${uploadResult.url})`;
        processedMarkdown = processedMarkdown.replace(fullMatch, newMarkdownImage);

        console.log(`Markdown image ${i + 1} uploaded successfully:`, uploadResult.url);
      } catch (error) {
        console.error(`Upload markdown image ${i + 1} failed:`, error.message);
        // 上传失败保留原 URL
      }
    }

    return processedMarkdown;
  }

  /**
   * 通过 URL 上传图片到知乎（复用 uploadCoverImage 的逻辑）
   */
  async uploadImageByUrl(imageUrl) {
    try {
      // 直接调用 uploadCoverImage，它已经实现了完整的上传逻辑
      return await this.uploadCoverImage(imageUrl);
    } catch (error) {
      console.error('Upload image by URL error:', error.message);
      throw new Error(`上传图片失败: ${error.message}`);
    }
  }

  /**
   * 上传封面图到知乎（真正上传图片文件）
   */
  async uploadCoverImage(imageUrl) {
    try {
      console.log('Uploading cover image to Zhihu:', imageUrl);
      
      const axios = require('axios');
      const FormData = require('form-data');
      
      // 1. 下载图片
      console.log('Downloading image...');
      let imageResponse;
      try {
        imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          },
          timeout: 30000,
        });
      } catch (downloadError) {
        console.error('❌ Download failed:', downloadError.message);
        // 如果下载失败，尝试从文件名提取 hash
        const urlParts = imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const filenameWithoutExt = filename.split('.')[0];
        
        if (/^[a-f0-9]{32}$/i.test(filenameWithoutExt)) {
          const imageHash = filenameWithoutExt.toLowerCase();
          const zhihuUrl = `https://pic1.zhimg.com/v2-${imageHash}.jpg`;
          console.log('⚠️  Using hash-based URL:', zhihuUrl);
          return { success: true, url: zhihuUrl, hash: imageHash };
        }
        
        throw downloadError;
      }

      const imageBuffer = Buffer.from(imageResponse.data);
      console.log('✅ Image downloaded, size:', imageBuffer.length, 'bytes');

      // 2. 准备上传表单
      const formData = new FormData();
      
      // 从 URL 提取文件扩展名
      const urlParts = imageUrl.split('.');
      const ext = urlParts[urlParts.length - 1].split('?')[0] || 'jpg';
      const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
      
      // 尝试使用 'picture' 字段名（知乎可能使用这个）
      formData.append('picture', imageBuffer, {
        filename: `image.${ext}`,
        contentType: contentType,
      });
      
      // 添加 source 参数
      formData.append('source', 'article');

      // 3. 上传到知乎（使用 httpClient 以保持 cookies）
      console.log('Uploading to Zhihu...');
      try {
        const uploadResponse = await this.httpClient.post(
          'https://api.zhihu.com/images',
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'Referer': 'https://zhuanlan.zhihu.com/',
              'Origin': 'https://zhuanlan.zhihu.com',
              'Accept': 'application/json, text/plain, */*',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'x-requested-with': 'XMLHttpRequest',
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );

        console.log('✅ Upload response:', JSON.stringify(uploadResponse.data));
        
        // 获取 image_id
        const imageId = uploadResponse.data.image_id || uploadResponse.data.id;
        
        if (imageId) {
          // 获取图片信息
          console.log('Getting image info for ID:', imageId);
          try {
            const imageInfoResponse = await this.httpClient.get(
              `https://api.zhihu.com/images/${imageId}`,
              {
                headers: {
                  'Referer': 'https://zhuanlan.zhihu.com/',
                  'Origin': 'https://zhuanlan.zhihu.com',
                },
              }
            );
            
            console.log('Image info:', JSON.stringify(imageInfoResponse.data));
            const finalUrl = imageInfoResponse.data.url;
            console.log('✅ Final image URL:', finalUrl);
            
            return {
              success: true,
              url: finalUrl,
              imageId: imageId,
            };
          } catch (infoError) {
            console.warn('⚠️  Failed to get image info:', infoError.message);
            // 使用上传响应中的 URL
            const uploadedUrl = uploadResponse.data.url || uploadResponse.data.src;
            if (uploadedUrl) {
              return { success: true, url: uploadedUrl, imageId: imageId };
            }
          }
        }
        
        // 如果有直接返回的 URL
        if (uploadResponse.data.url || uploadResponse.data.src) {
          const uploadedUrl = uploadResponse.data.url || uploadResponse.data.src;
          console.log('✅ Using uploaded URL:', uploadedUrl);
          return { success: true, url: uploadedUrl };
        }
        
        throw new Error('No image URL in response');
      } catch (uploadError) {
        console.error('❌ Upload failed:', uploadError.message);
        if (uploadError.response) {
          console.error('Response status:', uploadError.response.status);
          console.error('Response data:', JSON.stringify(uploadError.response.data).substring(0, 500));
        }
        throw uploadError;
      }
    } catch (error) {
      console.error('Upload cover image error:', error.message);
      
      // 降级：尝试从文件名提取 hash
      const urlParts = imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      const filenameWithoutExt = filename.split('.')[0];
      
      if (/^[a-f0-9]{32}$/i.test(filenameWithoutExt)) {
        const imageHash = filenameWithoutExt.toLowerCase();
        const zhihuUrl = `https://pic1.zhimg.com/v2-${imageHash}.jpg`;
        console.log('⚠️  Extracted hash from filename, using Zhihu CDN URL:', zhihuUrl);
        return {
          success: true,
          url: zhihuUrl,
          hash: imageHash,
        };
      }
      
      // 最终降级：直接使用原图 URL
      console.log('⚠️  Fallback to original URL');
      return {
        success: true,
        url: imageUrl,
      };
    }
  }

  /**
   * Markdown 转知乎 HTML
   */
  markdownToZhihuHtml(markdown) {
    // 配置 marked
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // 转换为 HTML
    let html = marked.parse(markdown);

    // 知乎样式优化
    const cheerio = require('cheerio');
    const $ = cheerio.load(`<div>${html}</div>`);
    const doc = $('div').first();

    // 段落样式
    doc.find('p').each((i, el) => {
      const $p = $(el);
      // 知乎不需要太多内联样式，保持简洁
      if (!$p.text().trim()) {
        $p.remove(); // 移除空段落
      }
    });

    // 代码块样式
    doc.find('pre').each((i, el) => {
      const $pre = $(el);
      const $code = $pre.find('code');
      if ($code.length) {
        // 知乎代码块格式
        $code.each((j, codeEl) => {
          const $c = $(codeEl);
          const codeText = $c.text();
          const lines = codeText.split('\n');
          const codeHtml = lines.map(line => `<code>${this.escapeHtml(line)}</code>`).join('\n');
          $c.html(codeHtml);
        });
      }
    });

    // 图片样式
    doc.find('img').each((i, el) => {
      const $img = $(el);
      const src = $img.attr('src');
      
      // 知乎图片格式
      const figure = `<figure><img src="${src}" data-rawwidth="900" data-rawheight="383" class="origin_image zh-lightbox-thumb" width="900" data-original="${src}"></figure>`;
      $img.replaceWith(figure);
    });

    // 移除空的 div 和 section
    doc.find('div, section').each((i, el) => {
      const $el = $(el);
      if (!$el.text().trim() && !$el.find('img').length) {
        $el.remove();
      }
    });

    return doc.html();
  }

  /**
   * HTML 转义
   */
  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * 上传图片（通用方法，已废弃）
   */
  async uploadImage(image) {
    try {
      const formData = new FormData();
      formData.append('file', image.bits, {
        filename: image.name,
        contentType: image.type,
      });

      const response = await this.httpClient.post(
        'https://zhuanlan.zhihu.com/api/uploaded_images',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      return {
        success: true,
        url: response.data.src,
      };
    } catch (error) {
      throw new Error(`上传图片失败: ${error.message}`);
    }
  }

  /**
   * 更新文章
   */
  async updatePost(postId, post) {
    try {
      const updateData = {
        title: post.title,
        content: post.content,
        isTitleImageFullScreen: false,
      };

      // 如果有封面图，添加到更新数据中
      if (post.titleImage) {
        updateData.titleImage = post.titleImage;
        console.log('Setting title image:', post.titleImage);
      }

      console.log('Updating draft with data:', JSON.stringify(updateData).substring(0, 200));

      const response = await this.httpClient.patch(
        `https://zhuanlan.zhihu.com/api/articles/${postId}/draft`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Draft updated successfully');

      return {
        success: true,
        draftLink: `https://zhuanlan.zhihu.com/p/${postId}/edit`,
      };
    } catch (error) {
      throw new Error(`更新文章失败: ${error.message}`);
    }
  }

  /**
   * 发布文章
   */
  async publishPost(postId) {
    try {
      const response = await this.httpClient.put(
        `https://zhuanlan.zhihu.com/api/articles/${postId}/publish`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        postId,
        url: `https://zhuanlan.zhihu.com/p/${postId}`,
      };
    } catch (error) {
      throw new Error(`发布文章失败: ${this.extractError(error.response)}`);
    }
  }

  /**
   * 删除文章
   */
  async deletePost(postId) {
    try {
      await this.httpClient.delete(
        `https://zhuanlan.zhihu.com/api/articles/${postId}`
      );

      return {
        success: true,
      };
    } catch (error) {
      throw new Error(`删除文章失败: ${this.extractError(error.response)}`);
    }
  }

  /**
   * 内容预处理
   */
  preprocessContent(content) {
    // 知乎支持标准 HTML
    // 处理代码块
    content = content.replace(
      /<pre><code class="language-(\w+)">/g,
      '<pre><code class="language-$1">'
    );

    return content;
  }
}

module.exports = ZhihuAdapter;
