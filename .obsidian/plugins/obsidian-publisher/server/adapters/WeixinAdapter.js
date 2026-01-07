const BaseAdapter = require('./BaseAdapter');
const FormData = require('form-data');
const { marked } = require('marked');
const matter = require('gray-matter');
const sharp = require('sharp');

/**
 * 微信公众号适配器
 * 基于 Wechatsync 项目的实现
 */
class WeixinAdapter extends BaseAdapter {
  constructor() {
    super();
    this.name = 'weixin';
    this.displayName = '微信公众号';
    this.icon = '📱';
    this.supportedTypes = ['html'];
    this.token = '';
    this.commonData = null;
  }

  /**
   * 设置 Cookie 并提取 token
   */
  setCookie(cookie) {
    super.setCookie(cookie);
    // token 会在 getUserInfo 时提取
  }

  /**
   * 检查认证状态
   */
  async checkAuth() {
    try {
      const response = await this.httpClient.get('https://mp.weixin.qq.com/');
      return response.status === 200 && response.data.includes('window.wx');
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取用户信息和 token
   */
  async getUserInfo() {
    const response = await this.httpClient.get('https://mp.weixin.qq.com/');
    const $ = this.parseHtml(response.data);

    // 检查是否需要登录
    if (response.data.includes('login') && !response.data.includes('window.wx.commonData')) {
      throw new Error('Cookie 已过期，请重新登录');
    }

    // 提取 JavaScript 中的用户信息
    // 微信的 commonData 不是标准 JSON，需要用正则提取关键字段
    const scripts = $('script');
    let token = null;
    let ticket = null;
    let userName = null;
    let nickName = null;
    let uin = null;

    for (let i = 0; i < scripts.length; i++) {
      const scriptContent = $(scripts[i]).html();
      if (scriptContent && scriptContent.includes('window.wx.commonData')) {
        // 提取 token
        const tokenMatch = scriptContent.match(/t:\s*"(\d+)"/);
        if (tokenMatch) {
          token = tokenMatch[1];
        }

        // 提取 ticket
        const ticketMatch = scriptContent.match(/ticket:\s*"([^"]+)"/);
        if (ticketMatch) {
          ticket = ticketMatch[1];
        }

        // 提取 user_name
        const userNameMatch = scriptContent.match(/user_name:\s*"([^"]+)"/);
        if (userNameMatch) {
          userName = userNameMatch[1];
        }

        // 提取 nick_name
        const nickNameMatch = scriptContent.match(/nick_name:\s*"([^"]+)"/);
        if (nickNameMatch) {
          nickName = nickNameMatch[1];
        }

        // 提取 uin
        const uinMatch = scriptContent.match(/uin:\s*"(\d+)"/);
        if (uinMatch) {
          uin = uinMatch[1];
        }

        break;
      }
    }

    if (!token || !userName) {
      console.error('Failed to extract token or userName from page');
      console.log('Token:', token, 'UserName:', userName);
      throw new Error('未能获取用户信息，Cookie 可能已过期，请重新登录微信公众平台');
    }

    this.token = token;
    this.commonData = {
      data: {
        t: token,
        ticket: ticket,
        user_name: userName,
        nick_name: nickName,
        uin: uin,
      },
    };

    console.log('Weixin user info extracted:', nickName || userName);

    return {
      uid: userName,
      username: nickName || userName,
      avatar: $('.weui-desktop-account__thumb').attr('src') || '',
    };
  }

  /**
   * 移除 emoji 和特殊字符
   */
  removeEmoji(text) {
    // 移除 emoji
    return text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
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
   * 优先级：元数据中的 image > 文章中的第一张图片
   */
  extractCoverImage(content, metadata) {
    // 1. 优先使用元数据中的 image
    if (metadata.image) {
      return metadata.image;
    }

    // 2. 从文章内容中提取第一张图片
    // 匹配 Markdown 图片语法 ![alt](url)
    const mdImageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (mdImageMatch) {
      return mdImageMatch[2];
    }

    // 匹配 HTML img 标签
    const htmlImageMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
    if (htmlImageMatch) {
      return htmlImageMatch[1];
    }

    return null;
  }

  /**
   * 处理文章图片（如果超过配置大小则压缩）
   */
  async processContentImage(imageBuffer) {
    try {
      const config = require('../config');
      const maxSizeMB = config.get('image.maxSizeMB');
      const quality = config.get('image.quality');
      const maxWidth = config.get('image.maxWidth');
      
      const sizeInMB = imageBuffer.length / (1024 * 1024);
      
      // 如果小于最大限制，直接返回
      if (sizeInMB <= maxSizeMB) {
        return imageBuffer;
      }

      console.log(`Image size ${sizeInMB.toFixed(2)}MB > ${maxSizeMB}MB, compressing...`);

      // 压缩图片
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      // 如果宽度超过最大宽度，调整宽度
      let processedImage = image;
      if (metadata.width > maxWidth) {
        processedImage = processedImage.resize(maxWidth, null, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // 压缩质量
      const processedBuffer = await processedImage
        .jpeg({ quality })
        .toBuffer();

      const newSizeInMB = processedBuffer.length / (1024 * 1024);
      console.log(`Compressed to ${newSizeInMB.toFixed(2)}MB`);

      return processedBuffer;
    } catch (error) {
      console.error('Process content image error:', error);
      // 如果处理失败，返回原图
      return imageBuffer;
    }
  }

  /**
   * 上传 Markdown 中的图片并替换 URL
   */
  async uploadMarkdownImages(markdown) {
    // 匹配 Markdown 图片语法：![alt](url)
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const matches = [...markdown.matchAll(imageRegex)];

    console.log(`Found ${matches.length} images in markdown`);

    let processedMarkdown = markdown;

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const fullMatch = match[0]; // 完整的 ![alt](url)
      const alt = match[1];
      const originalUrl = match[2];

      // 跳过已经是微信 CDN 的图片
      if (originalUrl.includes('mmbiz.qpic.cn')) {
        continue;
      }

      try {
        console.log(`Uploading markdown image ${i + 1}/${matches.length}:`, originalUrl);

        // 下载图片（带重试）
        let imageResponse;
        let retries = 3;
        while (retries > 0) {
          try {
            imageResponse = await this.httpClient.get(originalUrl, {
              responseType: 'arraybuffer',
              headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Referer': originalUrl.split('/').slice(0, 3).join('/'),
              },
              timeout: 60000,
              maxRedirects: 5,
            });
            break;
          } catch (error) {
            retries--;
            if (retries === 0) throw error;
            console.log(`Download failed, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }

        let imageBuffer = Buffer.from(imageResponse.data);

        // 处理图片（如果超过 2MB 则压缩）
        imageBuffer = await this.processContentImage(imageBuffer);

        const imageName = originalUrl.split('/').pop() || `image_${i}.jpg`;

        // 上传到微信
        const uploadResult = await this.uploadImageToWeixin(imageBuffer, imageName);

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
   * 上传文章中的图片并替换 URL（HTML 格式，已废弃）
   */
  async uploadAndReplaceImages(html) {
    const $ = this.parseHtml(`<div>${html}</div>`);
    const doc = $('div').first();
    const images = doc.find('img');

    console.log(`Found ${images.length} images in content`);

    for (let i = 0; i < images.length; i++) {
      const img = $(images[i]);
      const originalSrc = img.attr('src');

      // 跳过已经是微信 CDN 的图片
      if (!originalSrc || originalSrc.includes('mmbiz.qpic.cn')) {
        continue;
      }

      try {
        console.log(`Uploading image ${i + 1}/${images.length}:`, originalSrc);
        
        // 下载图片
        const imageResponse = await this.httpClient.get(originalSrc, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Referer': originalSrc.split('/').slice(0, 3).join('/'),
          },
          timeout: 30000,
          maxRedirects: 5,
        });

        let imageBuffer = Buffer.from(imageResponse.data);
        
        // 处理图片（如果超过 2MB 则压缩）
        imageBuffer = await this.processContentImage(imageBuffer);
        
        const imageName = originalSrc.split('/').pop() || `image_${i}.jpg`;

        // 上传到微信
        const uploadResult = await this.uploadImageToWeixin(imageBuffer, imageName);
        
        // 替换为微信 CDN URL
        img.attr('src', uploadResult.url);
        console.log(`Image ${i + 1} uploaded successfully:`, uploadResult.url);
      } catch (error) {
        console.error(`Upload image ${i + 1} failed:`, error.message);
        // 上传失败保留原 URL
      }
    }

    return doc.html();
  }

  /**
   * 上传图片到微信（通用方法）
   */
  async uploadImageToWeixin(imageBuffer, imageName) {
    if (!this.token || !this.commonData) {
      await this.getUserInfo();
    }

    const formData = new FormData();
    formData.append('type', 'image');
    formData.append('id', Date.now().toString());
    formData.append('name', imageName);
    formData.append('lastModifiedDate', new Date().toString());
    formData.append('size', imageBuffer.length);
    formData.append('file', imageBuffer, imageName);

    const ticket_id = this.commonData.data.user_name;
    const ticket = this.commonData.data.ticket;
    const svr_time = this.commonData.data.time;
    const seq = Date.now();

    const response = await this.httpClient.post(
      `https://mp.weixin.qq.com/cgi-bin/filetransfer?action=upload_material&f=json&scene=1&writetype=doublewrite&groupid=1&ticket_id=${ticket_id}&ticket=${ticket}&svr_time=${svr_time}&token=${this.token}&lang=zh_CN&seq=${seq}&t=${Math.random()}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    if (response.data.base_resp.err_msg !== 'ok') {
      throw new Error('图片上传失败');
    }

    return {
      success: true,
      media_id: response.data.content,
      url: response.data.cdn_url,
    };
  }

  /**
   * Markdown 转微信富文本
   */
  markdownToWeixinHtml(markdown, coverImageUrl = null) {
    // 配置 marked
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // 转换为 HTML
    let html = marked.parse(markdown);

    // 微信样式优化
    const $ = this.parseHtml(`<div>${html}</div>`);
    const doc = $('div').first();

    // 段落样式
    doc.find('p').each((i, el) => {
      const $p = $(el);
      $p.attr('style', 'margin: 1em 0; line-height: 1.75; color: rgb(51, 51, 51); font-size: 15px;');
    });

    // 标题样式
    doc.find('h1').each((i, el) => {
      $(el).attr('style', 'font-size: 1.5em; font-weight: bold; margin: 1.2em 0 0.8em; color: rgb(51, 51, 51);');
    });

    doc.find('h2').each((i, el) => {
      $(el).attr('style', 'font-size: 1.3em; font-weight: bold; margin: 1.2em 0 0.8em; color: rgb(51, 51, 51);');
    });

    doc.find('h3').each((i, el) => {
      $(el).attr('style', 'font-size: 1.1em; font-weight: bold; margin: 1em 0 0.6em; color: rgb(51, 51, 51);');
    });

    // 代码块样式
    doc.find('pre').each((i, el) => {
      $(el).attr('style', 'background: #f5f5f5; padding: 1em; border-radius: 4px; overflow-x: auto; margin: 1em 0;');
    });

    doc.find('code').each((i, el) => {
      const $code = $(el);
      if (!$code.parent('pre').length) {
        $code.attr('style', 'font-family: Consolas, Monaco, monospace; background: #f0f0f0; padding: 0.2em 0.4em; border-radius: 3px; color: #e83e8c;');
      } else {
        $code.attr('style', 'font-family: Consolas, Monaco, monospace; color: #333;');
      }
    });

    // 引用样式
    doc.find('blockquote').each((i, el) => {
      $(el).attr('style', 'border-left: 4px solid #ddd; padding-left: 1em; margin: 1em 0; color: #666; font-style: italic;');
    });

    // 列表样式
    doc.find('ul, ol').each((i, el) => {
      $(el).attr('style', 'margin: 1em 0; padding-left: 2em;');
    });

    doc.find('li').each((i, el) => {
      $(el).attr('style', 'margin: 0.5em 0; line-height: 1.75;');
    });

    // 链接样式（微信不支持外链，显示为文本）
    doc.find('a').each((i, el) => {
      const $a = $(el);
      const href = $a.attr('href');
      const text = $a.text();
      $a.replaceWith(`<span style="color: #576b95;">${text}</span>`);
    });

    // 图片样式
    doc.find('img').each((i, el) => {
      $(el).attr('style', 'max-width: 100%; height: auto; display: block; margin: 1em auto;');
    });

    // 包装在 section 中
    const wrappedContent = `<section style="margin-left: 6px; margin-right: 6px; line-height: 1.75em;">${doc.html()}</section>`;

    return wrappedContent;
  }

  /**
   * 创建草稿
   */
  async createDraft(post) {
    try {
      // 确保有 token
      if (!this.token) {
        await this.getUserInfo();
      }

      // 解析 Front Matter
      const { metadata, content } = this.parseFrontMatter(post.content);
      console.log('Metadata:', metadata);

      // 使用元数据中的标题（如果有），否则使用传入的标题
      const title = metadata.title || post.title;
      
      // 清理标题中的 emoji（微信标题不支持 emoji）
      const cleanTitle = this.removeEmoji(title).trim();

      // 使用元数据中的描述作为摘要（微信限制 120 字）
      let summary = metadata.description || post.summary || cleanTitle;
      if (summary.length > 120) {
        summary = summary.substring(0, 117) + '...';
      }

      // 提取封面图（优先使用元数据中的 image）
      const coverImageUrl = this.extractCoverImage(content, metadata);
      console.log('Cover image URL:', coverImageUrl);

      // 上传封面图到微信（头条和次条）
      let coverMediaId = '';
      let secondaryCoverMediaId = '';
      let weixinCoverUrl = null;
      if (coverImageUrl) {
        try {
          console.log('Uploading cover images (main + secondary)...');
          const uploadResult = await this.uploadCoverImage(coverImageUrl);
          coverMediaId = uploadResult.media_id;
          secondaryCoverMediaId = uploadResult.secondary_media_id;
          weixinCoverUrl = uploadResult.url; // 微信 CDN URL（头条封面）
          console.log('✅ Covers uploaded successfully!');
          console.log('   Main (2.35:1) media_id:', coverMediaId);
          console.log('   Secondary (1:1) media_id:', secondaryCoverMediaId);
        } catch (error) {
          console.error('❌ Upload cover images failed:', error.message);
          console.log('⚠️  Article will be created without cover images');
          // 封面上传失败不影响文章创建，继续执行
        }
      } else {
        console.log('ℹ️  No cover image specified in metadata');
      }

      // 1. 先上传文章中的所有图片（Markdown 格式）
      const contentWithUploadedImages = await this.uploadMarkdownImages(content);
      
      // 2. 转换 Markdown 为微信富文本
      let htmlContent = this.markdownToWeixinHtml(contentWithUploadedImages, null);
      
      // 3. 在开头添加封面图（使用微信 CDN URL）
      if (weixinCoverUrl) {
        const coverImageHtml = `<p style="text-align: center; margin: 1em 0;"><img src="${weixinCoverUrl}" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" /></p>`;
        htmlContent = coverImageHtml + htmlContent;
      }

      // 微信公众号的草稿创建比较复杂，需要构造完整的表单数据
      const formParams = {
        token: this.token,
        lang: 'zh_CN',
        f: 'json',
        ajax: '1',
        random: Math.random(),
        AppMsgId: '',
        count: '1',
        data_seq: '0',
        operate_from: 'Chrome',
        isnew: '0',
        ad_video_transition0: '',
        can_reward0: '0',
        related_video0: '',
        is_video_recommend0: '-1',
        title0: cleanTitle,
        author0: '',
        writerid0: '0',
        fileid0: coverMediaId,
        digest0: this.removeEmoji(summary),
        auto_gen_digest0: '0',
        content0: htmlContent,
        sourceurl0: '',
        need_open_comment0: '1',
        only_fans_can_comment0: '0',
        cdn_url0: '',
        cdn_235_1_url0: '',
        cdn_1_1_url0: '',
        cdn_url_back0: '',
        crop_list0: '',
        music_id0: '',
        video_id0: '',
        voteid0: '',
        voteismlt0: '',
        supervoteid0: '',
        cardid0: '',
        cardquantity0: '',
        cardlimit0: '',
        vid_type0: '',
        show_cover_pic0: '0',
        shortvideofileid0: '',
        copyright_type0: '0',
        releasefirst0: '',
        platform0: '',
        reprint_permit_type0: '',
        allow_reprint0: '',
        allow_reprint_modify0: '',
        original_article_type0: '',
        ori_white_list0: '',
        free_content0: '',
        fee0: '0',
        ad_id0: '',
        guide_words0: '',
        is_share_copyright0: '0',
        share_copyright_url0: '',
        source_article_type0: '',
        reprint_recommend_title0: '',
        reprint_recommend_content0: '',
        share_page_type0: '0',
        share_imageinfo0: '{"list":[]}',
        share_video_id0: '',
        dot0: '{}',
        share_voice_id0: '',
        insert_ad_mode0: '',
        categories_list0: '[]',
      };

      // 如果有次条封面，添加到表单参数中
      if (secondaryCoverMediaId) {
        formParams.digest_fileid0 = secondaryCoverMediaId;
        console.log('Added secondary cover (1:1) to form params');
      }

      const response = await this.httpClient.post(
        `https://mp.weixin.qq.com/cgi-bin/operate_appmsg?t=ajax-response&sub=create&type=77&token=${this.token}&lang=zh_CN`,
        new URLSearchParams(formParams),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'https://mp.weixin.qq.com/',
            'Origin': 'https://mp.weixin.qq.com',
          },
        }
      );

      console.log('Weixin createDraft response:', JSON.stringify(response.data).substring(0, 500));
      
      if (!response.data.appMsgId) {
        const error = this.formatWeixinError(response.data);
        console.error('Weixin createDraft error:', error);
        throw new Error(error.errmsg || '创建草稿失败');
      }

      const postId = response.data.appMsgId.toString();
      const draftLink = `https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77&appmsgid=${postId}&token=${this.token}&lang=zh_CN`;

      return {
        success: true,
        postId: postId,
        draftLink: draftLink,
        message: '草稿创建成功！请在微信公众平台后台手动发布',
      };
    } catch (error) {
      throw new Error(`创建草稿失败: ${error.message}`);
    }
  }

  /**
   * 处理头条封面图（2.35:1 比例）
   */
  async processMainCoverImage(imageBuffer) {
    try {
      const config = require('../config');
      const quality = config.get('image.quality');
      
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();
      
      console.log('Processing main cover (2.35:1)...');
      console.log('Original size:', metadata.width, 'x', metadata.height);

      // 头条封面：900x383 (2.35:1)
      const processedBuffer = await image
        .resize(900, 383, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality })
        .toBuffer();

      console.log('✅ Main cover processed: 900x383 (2.35:1)');
      return processedBuffer;
    } catch (error) {
      console.error('Process main cover error:', error);
      return imageBuffer;
    }
  }

  /**
   * 处理次条封面图（1:1 比例）
   */
  async processSecondaryCoverImage(imageBuffer) {
    try {
      const config = require('../config');
      const quality = config.get('image.quality');
      
      const image = sharp(imageBuffer);
      
      console.log('Processing secondary cover (1:1)...');

      // 次条封面：900x900 (1:1)
      const processedBuffer = await image
        .resize(900, 900, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality })
        .toBuffer();

      console.log('✅ Secondary cover processed: 900x900 (1:1)');
      return processedBuffer;
    } catch (error) {
      console.error('Process secondary cover error:', error);
      return imageBuffer;
    }
  }

  /**
   * 上传封面图（从 URL 下载后上传）
   */
  async uploadCoverImage(imageUrl) {
    try {
      if (!this.token || !this.commonData) {
        await this.getUserInfo();
      }

      // 使用统一的下载方法
      const config = require('../config');
      const downloadImage = async (url) => {
        const cleanClient = this.createCleanHttpClient();
        const proxy = config.getProxy();
        
        if (proxy) {
          console.log('📡 Using proxy:', proxy);
        } else {
          console.log('🔗 Direct connection (no proxy)');
        }
        
        const response = await cleanClient.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
          },
          maxRedirects: 5,
        });
        
        const buffer = Buffer.from(response.data);
        console.log('✅ Image downloaded successfully, size:', buffer.length, 'bytes');
        return buffer;
      };

      // 重试下载（使用配置）
      let originalBuffer;
      const maxRetries = config.get('retry.maxAttempts');
      const retryDelay = config.get('retry.delay');
      let retries = maxRetries;
      
      while (retries > 0) {
        try {
          originalBuffer = await downloadImage(imageUrl);
          break;
        } catch (error) {
          retries--;
          console.error(`Download attempt ${maxRetries - retries} failed: ${error.message}`);
          if (retries === 0) {
            console.error(`All ${maxRetries} download attempts failed for: ${imageUrl}`);
            throw error;
          }
          const waitTime = (maxRetries - retries) * retryDelay;
          console.log(`Waiting ${waitTime/1000}s before retry... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
      
      // 处理两种封面图
      const mainCoverBuffer = await this.processMainCoverImage(originalBuffer);
      const secondaryCoverBuffer = await this.processSecondaryCoverImage(originalBuffer);
      
      const imageName = imageUrl.split('/').pop().split('?')[0] || 'cover.jpg';

      // 上传头条封面（2.35:1）
      const mainCoverResult = await this.uploadImageToWeixin(mainCoverBuffer, `main_${imageName}`);
      console.log('Main cover uploaded:', mainCoverResult.url);

      // 上传次条封面（1:1）
      const secondaryCoverResult = await this.uploadImageToWeixin(secondaryCoverBuffer, `secondary_${imageName}`);
      console.log('Secondary cover uploaded:', secondaryCoverResult.url);

      return {
        success: true,
        media_id: mainCoverResult.media_id,
        url: mainCoverResult.url,
        secondary_media_id: secondaryCoverResult.media_id,
        secondary_url: secondaryCoverResult.url,
      };
    } catch (error) {
      throw new Error(`上传封面图失败: ${error.message}`);
    }
  }

  /**
   * 上传图片
   */
  async uploadImage(image) {
    try {
      if (!this.token || !this.commonData) {
        await this.getUserInfo();
      }

      const formData = new FormData();
      const blob = Buffer.from(image.bits);

      formData.append('type', image.type);
      formData.append('id', Date.now().toString());
      formData.append('name', image.name);
      formData.append('lastModifiedDate', new Date().toString());
      formData.append('size', blob.length);
      formData.append('file', blob, image.name);

      const ticket_id = this.commonData.data.user_name;
      const ticket = this.commonData.data.ticket;
      const svr_time = this.commonData.data.time;
      const seq = Date.now();

      const response = await this.httpClient.post(
        `https://mp.weixin.qq.com/cgi-bin/filetransfer?action=upload_material&f=json&scene=8&writetype=doublewrite&groupid=1&ticket_id=${ticket_id}&ticket=${ticket}&svr_time=${svr_time}&token=${this.token}&lang=zh_CN&seq=${seq}&t=${Math.random()}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      if (response.data.base_resp.err_msg !== 'ok') {
        throw new Error('图片上传失败');
      }

      return {
        success: true,
        url: response.data.cdn_url,
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
      if (!this.token) {
        await this.getUserInfo();
      }

      const response = await this.httpClient.post(
        `https://mp.weixin.qq.com/cgi-bin/operate_appmsg?t=ajax-response&sub=update&type=77&token=${this.token}&lang=zh_CN`,
        {
          token: this.token,
          lang: 'zh_CN',
          f: 'json',
          ajax: '1',
          AppMsgId: postId,
          count: '1',
          data_seq: '0',
          title0: post.title,
          content0: post.content,
          digest0: post.summary || post.title,
          // ... 其他字段与创建时相同
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return {
        success: true,
        draftLink: `https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77&appmsgid=${postId}&token=${this.token}&lang=zh_CN`,
      };
    } catch (error) {
      throw new Error(`更新文章失败: ${error.message}`);
    }
  }

  /**
   * 发布文章（微信公众号不支持直接发布，只能保存为草稿）
   */
  async publishPost(postId) {
    // 微信公众号需要手动在后台发布
    return {
      success: true,
      postId,
      draftLink: `https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=77&appmsgid=${postId}&token=${this.token}&lang=zh_CN`,
      message: '草稿已保存，请在微信公众号后台手动发布',
    };
  }

  /**
   * 删除文章
   */
  async deletePost(postId) {
    try {
      if (!this.token) {
        await this.getUserInfo();
      }

      await this.httpClient.post(
        `https://mp.weixin.qq.com/cgi-bin/operate_appmsg?sub=del&token=${this.token}`,
        {
          AppMsgId: postId,
        }
      );

      return {
        success: true,
      };
    } catch (error) {
      throw new Error(`删除文章失败: ${error.message}`);
    }
  }

  /**
   * 内容预处理 - 微信公众号需要特殊的格式
   */
  preprocessContent(content) {
    const $ = this.parseHtml(`<div>${content}</div>`);
    const doc = $('div').first();

    // 为段落添加样式
    doc.find('p').each((i, el) => {
      const $p = $(el);
      if (!$p.attr('style')) {
        $p.attr('style', 'margin: 1em 0; line-height: 1.75; color: rgb(51, 51, 51); font-size: 15px;');
      }
    });

    // 为标题添加样式
    doc.find('h1').each((i, el) => {
      $(el).attr('style', 'font-size: 1.5em; font-weight: bold; margin: 1em 0;');
    });

    doc.find('h2').each((i, el) => {
      $(el).attr('style', 'font-size: 1.3em; font-weight: bold; margin: 1em 0;');
    });

    doc.find('h3').each((i, el) => {
      $(el).attr('style', 'font-size: 1.1em; font-weight: bold; margin: 1em 0;');
    });

    // 代码块样式
    doc.find('pre').each((i, el) => {
      $(el).attr('style', 'background: #f5f5f5; padding: 1em; border-radius: 4px; overflow-x: auto;');
    });

    doc.find('code').each((i, el) => {
      const $code = $(el);
      if (!$code.parent('pre').length) {
        $code.attr('style', 'font-family: monospace; background: #f0f0f0; padding: 0.2em 0.4em; border-radius: 3px;');
      }
    });

    // 移除链接（微信不支持外链）
    doc.find('a').each((i, el) => {
      const $a = $(el);
      $a.replaceWith($a.text());
    });

    // 包装在 section 中
    const wrappedContent = `<section style="margin-left: 6px; margin-right: 6px; line-height: 1.75em;">${doc.html()}</section>`;

    return wrappedContent;
  }

  /**
   * 格式化微信错误信息
   */
  formatWeixinError(response) {
    const ret = response.ret || response.base_resp?.ret;
    const err_msg = response.err_msg || response.base_resp?.err_msg;
    
    const errorMap = {
      '-6': '请输入验证码',
      '62752': '可能含有具备安全风险的链接，请检查',
      '64505': '发送预览失败，请稍后再试',
      '64504': '保存图文消息发送错误，请稍后再试',
      '10801': '标题不能有违反公众平台协议、相关法律法规和政策的内容',
      '10806': '正文不能有违反公众平台协议、相关法律法规和政策的内容',
      '200003': '登录态超时，请重新登录',
      '200047': '标题中不能含有特殊字符（如 emoji）',
      '200051': '摘要超出120字长度限制',
      '64513': '封面必须存在正文中，请检查封面',
      '-1': '系统错误，请注意备份内容后重试',
    };

    return {
      errmsg: errorMap[ret] || err_msg || response.errmsg || '未知错误',
    };
  }
}

module.exports = WeixinAdapter;
