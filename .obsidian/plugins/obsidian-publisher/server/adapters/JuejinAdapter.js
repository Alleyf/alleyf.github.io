const BaseAdapter = require('./BaseAdapter');

class JuejinAdapter extends BaseAdapter {
  constructor() {
    super();
    this.name = 'juejin';
    this.displayName = '掘金';
    this.icon = '💎';
    this.supportedTypes = ['markdown'];
  }

  /**
   * 检查认证状态
   */
  async checkAuth() {
    try {
      const response = await this.httpClient.get(
        'https://api.juejin.cn/user_api/v1/user/get'
      );
      return response.status === 200 && response.data.data;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    const response = await this.httpClient.get(
      'https://api.juejin.cn/user_api/v1/user/get'
    );

    const user = response.data.data;

    return {
      uid: user.user_id,
      username: user.user_name,
      avatar: user.avatar_large,
    };
  }

  /**
   * 创建草稿
   */
  async createDraft(post) {
    try {
      const response = await this.httpClient.post(
        'https://api.juejin.cn/content_api/v1/article_draft/create',
        {
          title: post.title,
          brief_content: post.summary || '',
          content: post.content,
          mark_content: post.content,
          tag_ids: [],
          category_id: '0',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        postId: response.data.data.id,
      };
    } catch (error) {
      throw new Error(`创建草稿失败: ${this.extractError(error.response)}`);
    }
  }

  /**
   * 上传图片
   */
  async uploadImage(image) {
    try {
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('file', image.bits, {
        filename: image.name,
        contentType: image.type,
      });

      const response = await this.httpClient.post(
        'https://api.juejin.cn/upload_api/v1/upload',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      return {
        success: true,
        url: response.data.data.url,
      };
    } catch (error) {
      throw new Error(`上传图片失败: ${this.extractError(error.response)}`);
    }
  }

  /**
   * 更新文章
   */
  async updatePost(postId, post) {
    try {
      const response = await this.httpClient.post(
        'https://api.juejin.cn/content_api/v1/article_draft/update',
        {
          id: postId,
          title: post.title,
          brief_content: post.summary || '',
          content: post.content,
          mark_content: post.content,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        draftLink: `https://juejin.cn/editor/drafts/${postId}`,
      };
    } catch (error) {
      throw new Error(`更新文章失败: ${this.extractError(error.response)}`);
    }
  }

  /**
   * 发布文章
   */
  async publishPost(postId) {
    try {
      const response = await this.httpClient.post(
        'https://api.juejin.cn/content_api/v1/article/publish',
        {
          draft_id: postId,
          sync_to_org: false,
          column_ids: [],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const articleId = response.data.data.article_id;

      return {
        success: true,
        postId: articleId,
        url: `https://juejin.cn/post/${articleId}`,
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
      await this.httpClient.post(
        'https://api.juejin.cn/content_api/v1/article_draft/delete',
        {
          draft_id: postId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
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
    // 掘金支持 Markdown
    return content;
  }
}

module.exports = JuejinAdapter;
