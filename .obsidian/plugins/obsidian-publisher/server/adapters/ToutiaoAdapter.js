const BaseAdapter = require('./BaseAdapter');
const FormData = require('form-data');

/**
 * 今日头条适配器
 */
class ToutiaoAdapter extends BaseAdapter {
  constructor() {
    super();
    this.name = 'toutiao';
    this.displayName = '今日头条';
    this.icon = '📰';
    this.supportedTypes = ['html'];
  }

  /**
   * 检查认证状态
   */
  async checkAuth() {
    // 尝试多个可能的 URL
    const urls = [
      'https://www.toutiao.com/c/user/token/MS4wLjABAAAA/',  // 主站
      'https://mp.toutiao.com/',  // 创作者平台
      'https://www.toutiao.com/',  // 主站首页
    ];

    for (const url of urls) {
      try {
        const response = await this.httpClient.get(url);
        
        // 检查是否包含登录相关的关键词
        const hasLogin = response.data.includes('login') || response.data.includes('登录');
        const hasCsrfToken = response.data.includes('csrfToken');
        const hasUserInfo = response.data.includes('userInfo') || response.data.includes('user_info');
        const hasSessionId = response.data.includes('sessionid') || this.cookie.includes('sessionid');
        
        console.log(`Toutiao checkAuth [${url}] - status:`, response.status, 'hasLogin:', hasLogin, 'hasCsrfToken:', hasCsrfToken, 'hasUserInfo:', hasUserInfo, 'hasSessionId:', hasSessionId);
        
        // 如果有 sessionid 在 cookie 中，认为已认证
        if (hasSessionId && !hasLogin) {
          return true;
        }
        
        // 如果有 csrfToken 或 userInfo，说明已认证
        if (hasCsrfToken || hasUserInfo) {
          return true;
        }
      } catch (error) {
        // 404 是正常的，不需要打印错误
        if (error.response && error.response.status === 404) {
          console.log(`Toutiao checkAuth [${url}] - 404, trying next URL...`);
        } else {
          console.error(`Toutiao checkAuth [${url}] error:`, error.message);
        }
        continue;
      }
    }
    
    return false;
  }

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    try {
      // 从 cookie 中提取 csrftoken
      const csrfMatch = this.cookie.match(/csrftoken=([^;]+)/);
      if (csrfMatch) {
        this.csrfToken = csrfMatch[1];
        console.log('Extracted csrfToken from cookie:', this.csrfToken);
      }

      // 优先尝试使用媒体信息 API（Wechatsync 使用的）
      try {
        const mediaResponse = await this.httpClient.get('https://mp.toutiao.com/mp/agw/media/get_media_info');
        if (mediaResponse.data && mediaResponse.data.data && mediaResponse.data.data.user) {
          const user = mediaResponse.data.data.user;
          console.log('Got user info from media API:', user.screen_name);
          return {
            uid: user.id || user.user_id,
            username: user.screen_name || user.name,
            avatar: user.https_avatar_url || user.avatar_url || '',
          };
        }
      } catch (error) {
        console.log('Media API failed, trying other APIs...');
      }

      // 尝试从其他 API 获取用户信息
      const apiUrls = [
        'https://mp.toutiao.com/profile_v4/user/info',
        'https://mp.toutiao.com/profile_v3/user/info',
        'https://www.toutiao.com/api/pc/user/info/',
      ];

      let userInfo = null;
      for (const apiUrl of apiUrls) {
        try {
          console.log('Trying API:', apiUrl);
          const apiResponse = await this.httpClient.get(apiUrl);
          console.log('API response:', JSON.stringify(apiResponse.data).substring(0, 200));
          
          // 检查不同的响应格式
          if (apiResponse.data) {
            if (apiResponse.data.data) {
              userInfo = apiResponse.data.data;
              break;
            } else if (apiResponse.data.user_id || apiResponse.data.name) {
              // 直接返回的用户信息（www.toutiao.com API）
              userInfo = apiResponse.data;
              break;
            }
          }
        } catch (apiError) {
          console.error(`API [${apiUrl}] error:`, apiError.message);
          continue;
        }
      }

      if (!userInfo) {
        // 如果 API 都失败了，尝试从 cookie 中提取基本信息
        const sessionMatch = this.cookie.match(/sessionid=([^;]+)/);
        const uid = sessionMatch ? sessionMatch[1].substring(0, 10) : null;
        
        if (!uid) {
          throw new Error('无法获取用户信息，Cookie 可能已过期，请重新登录今日头条');
        }
        
        console.warn('Toutiao: Using fallback user info from cookie');
        return {
          uid: uid,
          username: '今日头条用户',
          avatar: '',
        };
      }

      console.log('Toutiao user info:', userInfo.name || userInfo.screen_name || userInfo.nickname);

      return {
        uid: userInfo.id || userInfo.user_id || userInfo.uid || 'unknown',
        username: userInfo.name || userInfo.screen_name || userInfo.nickname || '今日头条用户',
        avatar: userInfo.avatar_url || userInfo.avatar || '',
      };
    } catch (error) {
      throw new Error(`获取用户信息失败: ${error.message}`);
    }
  }

  /**
   * 创建草稿
   */
  async createDraft(post) {
    try {
      if (!this.csrfToken) {
        await this.getUserInfo();
      }

      // 解析 Front Matter（提取元数据和内容）
      const matter = require('gray-matter');
      const { marked } = require('marked');
      
      const parsed = matter(post.content);
      const metadata = parsed.data;
      const contentWithoutFrontMatter = parsed.content;
      
      console.log('Toutiao metadata:', metadata);
      
      // 提取封面图 URL（从元数据中的 image 字段）
      const coverImageUrl = metadata.image;
      
      // 上传封面图并获取头条的图片信息
      let pgc_feed_covers = [];
      if (coverImageUrl) {
        try {
          console.log('📸 Uploading cover image to Toutiao:', coverImageUrl);
          const coverData = await this.uploadCoverImage(coverImageUrl);
          pgc_feed_covers.push(coverData);
          console.log('✅ Cover image uploaded successfully:', coverData.url);
        } catch (error) {
          console.error('❌ Upload cover image failed:', error.message);
          console.error('Error stack:', error.stack);
          // 封面上传失败不影响文章创建，继续执行
          console.warn('⚠️  Article will be created without cover image');
        }
      } else {
        console.log('ℹ️  No cover image specified in metadata (use "image:" in front matter)');
      }
      
      // 将 Markdown 转换为 HTML（头条需要 HTML 格式）
      marked.setOptions({
        breaks: true,
        gfm: true,
      });
      let htmlContent = marked.parse(contentWithoutFrontMatter);
      
      // 添加 data-track 属性到每个 p 标签（头条需要）
      const cheerio = require('cheerio');
      const $ = cheerio.load(htmlContent);
      let trackIndex = 1;
      $('p').each((i, el) => {
        $(el).attr('data-track', trackIndex.toString());
        trackIndex++;
      });
      htmlContent = $.html();
      
      // 在正文开头添加封面图（如果有）
      if (pgc_feed_covers.length > 0 && pgc_feed_covers[0].url) {
        const coverImageHtml = `<p data-track="0" style="text-align: center;"><img src="${pgc_feed_covers[0].url}" style="max-width: 100%; height: auto;" /></p>`;
        htmlContent = coverImageHtml + htmlContent;
        console.log('✅ Cover image added to content');
      }

      // 先访问发布页面（头条需要这个步骤）
      await this.httpClient.get('https://mp.toutiao.com/profile_v3/graphic/publish');

      // 使用 Form Data 格式（根据实际抓包数据）
      const formData = new URLSearchParams({
        source: '29',  // 实际值是 29，不是 mp
        type: 'article',
        aid: '1231',
        mp_publish_ab_val: '0',
        pgc_id: '0',  // 0 表示创建新草稿，不覆盖旧的
        title: post.title,
        content: htmlContent,
        article_ad_type: '3',
        article_type: '0',
        from_diagnosis: '0',
        origin_debut_check_pgc_normal: '0',
        tree_plan_article: '0',
        save: '1',  // 1=保存草稿
        pgc_feed_covers: JSON.stringify(pgc_feed_covers),
        timer_status: '0',
        timer_time: '',
        is_fans_article: '0',
        govern_forward: '0',
        praise: '0',
        disable_praise: '0',
        star_order_id: '',
        star_order_name: '',
        activity_tag: '0',
        trends_writing_tag: '0',
        claim_exclusive: '1',
        search_creation_info: JSON.stringify({
          searchTopOne: 0,
          abstract: '',
          clue_id: '',
        }),
        title_id: `${Date.now()}_${Math.floor(Math.random() * 10000000000000000)}`,
        ic_uri_list: '',
        appid_list: '',
        stock_ids: '',
        concern_list: '',
        mp_editor_stat: '{}',
        is_refute_rumor: '0',
        educluecard: '',
        draft_form_data: JSON.stringify({ coverType: 2 }),
        extra: JSON.stringify({
          content_source: 100000000402,
          content_word_cnt: htmlContent.length,
          is_multi_title: 0,
          sub_titles: [],
          gd_ext: {
            entrance: '',
            from_page: 'publisher_mp',
            enter_from: 'PC',
            device_platform: 'mp',
            is_message: 0,
          },
          tuwen_wtt_trans_flag: '2',
          info_source: {
            source_type: -1,
          },
        }),
      });

      console.log('Toutiao createDraft form data:', formData.toString().substring(0, 200));
      console.log('Toutiao pgc_feed_covers:', JSON.stringify(pgc_feed_covers, null, 2));

      const response = await this.httpClient.post(
        'https://mp.toutiao.com/mp/agw/article/publish?source=mp&type=article',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': this.csrfToken,
            'Referer': 'https://mp.toutiao.com/profile_v3/graphic/publish',
            'Origin': 'https://mp.toutiao.com',
          },
        }
      );

      console.log('Toutiao createDraft response:', JSON.stringify(response.data));

      // 检查响应
      if (response.data && (response.data.code !== 0 && response.data.err_no !== 0)) {
        const errorMsg = response.data.message || response.data.reason || '创建草稿失败';
        console.error('Toutiao API error:', response.data);
        
        // 提供更详细的错误信息
        let detailedError = `头条返回错误 (${response.data.code || response.data.err_no}): ${errorMsg}`;
        
        // 常见错误码说明
        if (response.data.code === 7050 || response.data.err_no === 7050) {
          detailedError += '\n\n可能的原因：';
          detailedError += '\n1. 账号未完成实名认证或资质审核';
          detailedError += '\n2. 账号被限制发布（违规或其他原因）';
          detailedError += '\n3. 内容包含敏感词或违规内容';
          detailedError += '\n4. Cookie 已过期，请重新导出';
          detailedError += '\n\n建议：请在头条号后台手动创建一篇文章，确认账号状态正常';
        }
        
        throw new Error(detailedError);
      }

      if (!response.data.data || !response.data.data.pgc_id) {
        throw new Error('头条未返回文章 ID');
      }

      const postId = response.data.data.pgc_id.toString();

      return {
        success: true,
        postId: postId,
        draftLink: `https://mp.toutiao.com/profile_v3/graphic/publish?pgc_id=${postId}`,
        message: '草稿创建成功！请在头条号后台查看并发布',
        status: 'draft',  // 标记为草稿状态
      };
    } catch (error) {
      // 打印详细的错误信息
      if (error.response) {
        console.error('Toutiao API error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
      }
      throw new Error(`创建草稿失败: ${error.message}`);
    }
  }

  /**
   * 上传封面图（从 URL 下载后上传到头条）
   */
  async uploadCoverImage(imageUrl) {
    try {
      if (!this.csrfToken) {
        await this.getUserInfo();
      }

      // 下载图片（带重试机制）
      console.log('Downloading cover image:', imageUrl);
      let imageResponse;
      const maxRetries = 3;
      let retries = maxRetries;
      
      while (retries > 0) {
        try {
          imageResponse = await this.httpClient.get(imageUrl, {
            responseType: 'arraybuffer',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
              'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
              'Referer': imageUrl.split('/').slice(0, 3).join('/'),
            },
            timeout: 60000,
          });
          break; // 成功则跳出循环
        } catch (error) {
          retries--;
          console.error(`Download attempt ${maxRetries - retries} failed: ${error.message}`);
          if (retries === 0) {
            throw error;
          }
          // 等待后重试
          const waitTime = (maxRetries - retries) * 2000;
          console.log(`Waiting ${waitTime/1000}s before retry... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }

      const imageBuffer = Buffer.from(imageResponse.data);
      const imageName = imageUrl.split('/').pop() || 'cover.jpg';

      // 上传到头条
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('upfile', imageBuffer, imageName);

      const uploadUrl = 'https://mp.toutiao.com/mp/agw/article_material/photo/upload_picture?type=ueditor&pgc_watermark=1&action=uploadimage&encode=utf-8';
      
      const response = await this.httpClient.post(uploadUrl, formData, {
        headers: {
          ...formData.getHeaders(),
          'X-CSRFToken': this.csrfToken,
        },
      });

      if (response.data.state !== 'SUCCESS') {
        throw new Error('头条图片上传失败: ' + (response.data.message || 'Unknown error'));
      }

      console.log('Toutiao cover upload response:', response.data);

      // 构造头条需要的封面数据格式（根据实际抓包数据）
      return {
        id: '',  // 空字符串，不是数字
        url: response.data.url,
        uri: response.data.origin_web_uri || response.data.web_uri,
        origin_uri: response.data.origin_web_uri || response.data.web_uri,  // 实际请求中没有这个字段
        ic_uri: '',
        thumb_width: response.data.width || 0,
        thumb_height: response.data.height || 0,
        extra: {
          from_content_uri: '',
          from_content: '0',
        },
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
      if (!this.csrfToken) {
        await this.getUserInfo();
      }

      const formData = new FormData();
      const blob = Buffer.from(image.bits);
      formData.append('image', blob, image.name);
      formData.append('type', 'image');

      const response = await this.httpClient.post(
        'https://mp.toutiao.com/upload_photo/',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'X-CSRFToken': this.csrfToken,
          },
        }
      );

      if (response.data.message !== 'success') {
        throw new Error(response.data.message || '图片上传失败');
      }

      return {
        success: true,
        url: response.data.web_uri,
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
      if (!this.csrfToken) {
        await this.getUserInfo();
      }

      const response = await this.httpClient.post(
        'https://mp.toutiao.com/core/article/edit_article_post/',
        {
          id: postId,
          title: post.title,
          content: post.content,
          abstract: post.summary || '',
          article_ad_type: 0,
          cover_images: [],
          tags: post.tags ? post.tags.join(',') : '',
          save: 1,
          original: 0,
          article_type: 0,
          pgc_feed_covers: [],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': this.csrfToken,
          },
        }
      );

      if (response.data.message !== 'success') {
        throw new Error(response.data.message || '更新文章失败');
      }

      return {
        success: true,
        draftLink: `https://mp.toutiao.com/profile_v3/graphic/publish?id=${postId}`,
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
      if (!this.csrfToken) {
        await this.getUserInfo();
      }

      // 先获取文章详情
      const detailResponse = await this.httpClient.get(
        `https://mp.toutiao.com/core/article/edit_content/?id=${postId}`
      );

      const article = detailResponse.data.data;

      // 发布文章
      const response = await this.httpClient.post(
        'https://mp.toutiao.com/core/article/edit_article_post/',
        {
          ...article,
          id: postId,
          save: 0, // 0=发布
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': this.csrfToken,
          },
        }
      );

      if (response.data.message !== 'success') {
        throw new Error(response.data.message || '发布文章失败');
      }

      return {
        success: true,
        postId,
        url: `https://www.toutiao.com/article/${postId}/`,
      };
    } catch (error) {
      throw new Error(`发布文章失败: ${error.message}`);
    }
  }

  /**
   * 删除文章
   */
  async deletePost(postId) {
    try {
      if (!this.csrfToken) {
        await this.getUserInfo();
      }

      const response = await this.httpClient.post(
        'https://mp.toutiao.com/core/article/delete/',
        {
          id: postId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': this.csrfToken,
          },
        }
      );

      if (response.data.message !== 'success') {
        throw new Error(response.data.message || '删除文章失败');
      }

      return {
        success: true,
      };
    } catch (error) {
      throw new Error(`删除文章失败: ${error.message}`);
    }
  }

  /**
   * 内容预处理
   */
  preprocessContent(content) {
    // 今日头条支持标准 HTML
    // 但需要移除一些不支持的标签和属性

    const $ = this.parseHtml(`<div>${content}</div>`);
    const doc = $('div').first();

    // 移除 style 属性（头条有自己的样式）
    doc.find('*').each((i, el) => {
      $(el).removeAttr('style');
      $(el).removeAttr('class');
    });

    // 处理代码块
    doc.find('pre code').each((i, el) => {
      const $code = $(el);
      const $pre = $code.parent();
      $pre.html(`<code>${$code.html()}</code>`);
    });

    return doc.html();
  }
}

module.exports = ToutiaoAdapter;
