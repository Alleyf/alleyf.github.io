const BaseAdapter = require('./BaseAdapter');
const FormData = require('form-data');
const { marked } = require('marked');
const matter = require('gray-matter');

/**
 * CSDN 博客适配器
 */
class CsdnAdapter extends BaseAdapter {
  constructor() {
    super();
    this.name = 'csdn';
    this.displayName = 'CSDN';
    this.icon = '📝';
    this.supportedTypes = ['markdown', 'html'];
  }

  /**
   * 检查认证状态
   */
  async checkAuth() {
    try {
      // 检查 Cookie 中是否有关键字段
      const hasUserCookie = this.cookie && (
        this.cookie.includes('UserName=') ||
        this.cookie.includes('UserToken=') ||
        this.cookie.includes('dc_session_id=')
      );
      
      // 如果没有关键 Cookie，直接返回 false
      if (!hasUserCookie) {
        console.log('CSDN checkAuth - no user cookie found');
        return false;
      }
      
      // 尝试访问个人中心
      const response = await this.httpClient.get('https://mp.csdn.net/');
      
      // 检查是否是登录页面（重定向到登录页）
      const isLoginPage = response.request?.path?.includes('/login') || 
                         response.request?.res?.responseUrl?.includes('/login');
      
      // 检查页面是否包含"请登录"、"立即登录"等明确的登录提示
      const needLogin = response.data.includes('请登录') || 
                       response.data.includes('立即登录') ||
                       response.data.includes('未登录');
      
      console.log('CSDN checkAuth - status:', response.status, 'isLoginPage:', isLoginPage, 'needLogin:', needLogin, 'hasUserCookie:', hasUserCookie);
      
      // 如果有用户 Cookie，且不是登录页，且没有明确的登录提示，认为已认证
      return response.status === 200 && hasUserCookie && !isLoginPage && !needLogin;
    } catch (error) {
      console.error('CSDN checkAuth error:', error.message);
      return false;
    }
  }

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    try {
      // 优先从 Cookie 中提取（最可靠）
      let username = '';
      let uid = '';
      
      if (this.cookie) {
        const userNameMatch = this.cookie.match(/UserName=([^;]+)/);
        if (userNameMatch) {
          username = decodeURIComponent(userNameMatch[1]);
        }
        
        const userIdMatch = this.cookie.match(/UserId=([^;]+)/);
        if (userIdMatch) {
          uid = userIdMatch[1];
        }
      }
      
      // 如果 Cookie 中没有，尝试从页面提取
      if (!username || !uid) {
        try {
          const response = await this.httpClient.get('https://mp.csdn.net/');
          const $ = this.parseHtml(response.data);
          
          // 方法1: 从页面中的用户信息区域提取
          if (!username) {
            const userNameEl = $('.user-name, .username, [class*="username"]');
            if (userNameEl.length) {
              username = userNameEl.first().text().trim();
            }
          }
          
          // 方法2: 从 JavaScript 变量中提取
          const scripts = $('script');
          for (let i = 0; i < scripts.length; i++) {
            const scriptContent = $(scripts[i]).html();
            if (scriptContent && scriptContent.includes('UserName')) {
              if (!username) {
                const userNameMatch = scriptContent.match(/UserName["\s:]+["']([^"']+)["']/);
                if (userNameMatch) {
                  username = userNameMatch[1];
                }
              }
              
              if (!uid) {
                const userIdMatch = scriptContent.match(/UserId["\s:]+["']?(\d+)["']?/);
                if (userIdMatch) {
                  uid = userIdMatch[1];
                }
              }
            }
          }
        } catch (error) {
          console.error('Failed to fetch user info from page:', error.message);
        }
      }
      
      console.log('CSDN user info:', username, uid);
      
      // 如果还是没有用户名，说明 Cookie 可能无效
      if (!username && !uid) {
        throw new Error('无法获取用户信息，Cookie 可能已过期，请重新登录 CSDN');
      }
      
      // 至少要有一个标识
      if (!username) {
        username = 'CSDN用户';
      }
      if (!uid) {
        uid = 'unknown';
      }
      
      return {
        uid: uid,
        username: username,
        avatar: '',
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
      console.log('CSDN metadata:', metadata);

      // 使用元数据中的标题（如果有）
      const title = metadata.title || post.title;
      
      // 提取标签
      const tags = metadata.tags || [];
      const tagsStr = Array.isArray(tags) ? tags.join(',') : tags;
      
      // 提取分类
      const categories = metadata.categories || metadata.category || '';
      const categoryStr = Array.isArray(categories) ? categories[0] : categories;
      
      // 提取摘要
      const description = metadata.description || post.summary || '';

      // CSDN 支持 Markdown，不需要转换
      let markdownContent = content;

      // 提取封面图
      const coverImageUrl = this.extractCoverImage(content, metadata);
      let coverImages = [];
      
      // 如果有封面图，上传到 CSDN
      if (coverImageUrl) {
        try {
          console.log('Uploading cover image to CSDN:', coverImageUrl);
          const uploadResult = await this.uploadCoverImageByUrl(coverImageUrl);
          coverImages = [uploadResult.url];
          console.log('✅ Cover uploaded:', uploadResult.url);
          
          // 在内容开头添加封面图
          const coverImageMd = `![封面](${uploadResult.url})\n\n`;
          if (!markdownContent.includes(uploadResult.url)) {
            markdownContent = coverImageMd + markdownContent;
          }
        } catch (error) {
          console.error('❌ Upload cover failed:', error.message);
          // 封面上传失败，使用原图 URL
          if (coverImageUrl.startsWith('http')) {
            const coverImageMd = `![封面](${coverImageUrl})\n\n`;
            if (!markdownContent.includes(coverImageUrl)) {
              markdownContent = coverImageMd + markdownContent;
            }
          }
        }
      }

      // 转换 Markdown 为 HTML（CSDN 需要两种格式）
      const htmlContent = marked.parse(markdownContent);

      // 构造 CSDN API 请求数据（根据你提供的真实请求）
      const postData = {
        // 文章 ID（新建时不传或传空字符串）
        // id: '',  // 创建新文章时不传 id 字段
        
        // 基本信息
        title: title,
        markdowncontent: markdownContent,
        content: htmlContent,
        
        // 元数据
        Description: description,
        tags: tagsStr,
        categories: categoryStr,
        
        // 封面图
        cover_images: coverImages,
        cover_type: coverImages.length > 0 ? 1 : 0,
        
        // 文章设置
        type: 'original', // 原创
        original_link: '',
        authorized_status: false,
        
        // 发布设置
        status: 0, // 0=草稿
        pubStatus: 'draft', // draft=草稿, publish=发布
        readType: 'public', // public=公开
        
        // 其他字段
        not_auto_saved: '1',
        source: 'pc_mdeditor',
        level: 0,
        is_new: 1,
        resource_id: '',
        creator_activity_id: '',
        vote_id: 0,
        sync_git_code: 0,
      };

      console.log('CSDN createDraft data:', {
        title: postData.title,
        tags: postData.tags,
        categories: postData.categories,
        contentLength: postData.markdowncontent.length,
        hasCover: coverImages.length > 0,
      });

      // CSDN API 需要特殊的认证（X-Ca-Key），暂时无法直接调用
      // 返回格式化的内容，让用户手动创建
      console.log('⚠️  CSDN API requires X-Ca-Key authentication, returning formatted content');

      const editorUrl = 'https://editor.csdn.net/md/?not_checkout=1';
      const tempId = Date.now().toString();

      return {
        success: true,
        postId: tempId,
        draftLink: editorUrl,
        message: `CSDN API 需要特殊认证，请手动创建文章：\n\n1. 访问：${editorUrl}\n2. 标题：${title}\n3. 标签：${tagsStr}\n4. 分类：${categoryStr}\n5. 内容已准备好，请复制粘贴`,
        content: markdownContent,
        metadata: {
          title,
          tags: tagsStr,
          categories: categoryStr,
          description,
          coverImages,
        },
      };
    } catch (error) {
      console.error('CSDN createDraft error:', error);
      throw new Error(`创建草稿失败: ${error.message}`);
    }
  }

  /**
   * 通过 URL 上传封面图到 CSDN
   */
  async uploadCoverImageByUrl(imageUrl) {
    try {
      // 下载图片
      const axios = require('axios');
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        timeout: 30000,
      });

      const imageBuffer = Buffer.from(imageResponse.data);
      const imageName = imageUrl.split('/').pop() || 'cover.jpg';

      // 上传到 CSDN
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('file', imageBuffer, imageName);

      const uploadResponse = await this.httpClient.post(
        'https://img-blog.csdnimg.cn/direct/upload',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Referer': 'https://editor.csdn.net/',
          },
        }
      );

      if (!uploadResponse.data || !uploadResponse.data.url) {
        throw new Error('CSDN 图片上传失败');
      }

      return {
        success: true,
        url: uploadResponse.data.url,
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
      const formData = new FormData();
      const blob = Buffer.from(image.bits);
      formData.append('file', blob, image.name);

      const response = await this.httpClient.post(
        'https://img-blog.csdnimg.cn/direct/upload',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      if (!response.data || !response.data.url) {
        throw new Error('图片上传失败');
      }

      return {
        success: true,
        url: response.data.url,
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
      const { metadata, content } = this.parseFrontMatter(post.content);
      const title = metadata.title || post.title;
      
      const postData = {
        id: postId,
        title: title,
        markdowncontent: content,
        content: marked.parse(content),
        description: metadata.description || post.summary || '',
        tags: metadata.tags ? (Array.isArray(metadata.tags) ? metadata.tags.join(',') : metadata.tags) : '',
        categories: metadata.categories || metadata.category || '',
        type: 'original',
        status: 0, // 保持草稿状态
        articleedittype: 1,
      };

      const response = await this.httpClient.post(
        'https://mp.csdn.net/mp_blog/creation/editor/article/save',
        postData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data || response.data.code !== 200) {
        throw new Error(response.data?.msg || '更新文章失败');
      }

      return {
        success: true,
        draftLink: `https://mp.csdn.net/mp_blog/creation/editor/${postId}`,
      };
    } catch (error) {
      throw new Error(`更新文章失败: ${error.message}`);
    }
  }

  /**
   * 发布文章
   */
  async publishPost(postId) {
    // CSDN 需要手动在后台发布，API 不支持直接发布
    console.log('⚠️  CSDN requires manual publishing in the backend');
    
    return {
      success: true,
      postId,
      draftLink: `https://editor.csdn.net/md/?articleId=${postId}`,
      message: 'CSDN 需要手动在后台发布文章',
    };
  }

  /**
   * 删除文章
   */
  async deletePost(postId) {
    try {
      const response = await this.httpClient.post(
        'https://mp.csdn.net/mp_blog/creation/editor/article/delete',
        {
          id: postId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data || response.data.code !== 200) {
        throw new Error(response.data?.msg || '删除文章失败');
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
    // CSDN 支持 Markdown，不需要特殊处理
    return content;
  }
}

module.exports = CsdnAdapter;
