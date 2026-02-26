import { useState } from 'react'
import { MessageSquare, Heart, Send, ShieldCheck, Clock } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function CommunityLounge() {
  const { posts, addPost, likePost } = useGameStore()
  const [newPostContent, setNewPostContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newPostContent.trim()) return
    addPost(newPostContent)
    setNewPostContent('')
  }

  return (
    <div className="lounge-container">
      {/* 1. Header & Status */}
      <div className="lounge-header">
        <div className="header-text">
          <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>비밀 라운지</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            검증된 루팡들만 참여할 수 있는 보안 뉴스피드입니다.
          </p>
        </div>
        <div className="security-badge">
          <ShieldCheck size={16} />
          <span>보안 연결됨</span>
        </div>
      </div>

      {/* 2. New Post Input */}
      <div className="input-section glass">
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <textarea
            placeholder="당신의 비밀스러운 업무 팁을 공유해보세요..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="lounge-textarea"
          />
          <div className="input-footer">
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              글을 작성하면 <span style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>5 FP</span> + <span style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>2 EXP</span>를 획득합니다.
            </span>
            <button className="btn btn-primary" type="submit" disabled={!newPostContent.trim()}>
              <Send size={16} style={{ marginRight: '8px' }} />
              게시하기
            </button>
          </div>
        </form>
      </div>

      {/* 3. Post Feed */}
      <div className="post-feed">
        {posts.map(post => (
          <div key={post.id} className="post-card glass">
            <div className="post-header">
              <div className="author-info">
                <div className="author-avatar">{post.author[0]}</div>
                <div>
                  <div className="author-name">{post.author}</div>
                  <div className="post-time">
                    <Clock size={10} />
                    {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>

            <p className="post-content">{post.content}</p>

            <div className="post-footer">
              <button
                className="like-btn"
                onClick={() => likePost(post.id)}
              >
                <Heart size={16} fill={post.likes > 10 ? 'var(--status-error)' : 'none'} color={post.likes > 10 ? 'var(--status-error)' : 'currentColor'} />
                <span>좋아요 {post.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .lounge-container {
          max-width: 700px;
          margin: 0 auto;
          text-align: left;
          padding-bottom: 80px;
        }

        .lounge-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(52, 199, 89, 0.1);
          color: var(--status-success);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .input-section {
          padding: 24px;
          margin-bottom: 40px;
          border-radius: var(--radius-lg);
        }

        .lounge-textarea {
          width: 100%;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 16px;
          resize: none;
          min-height: 80px;
          outline: none;
          color: var(--text-primary);
        }

        .input-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .post-feed {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .post-card {
          padding: 24px;
          transition: var(--transition-smooth);
        }

        .post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .author-avatar {
          width: 32px;
          height: 32px;
          background: #e1e1e3;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .author-name {
          font-weight: 600;
          font-size: 14px;
        }

        .post-time {
          font-size: 11px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .post-content {
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-primary);
          margin-bottom: 20px;
          white-space: pre-wrap;
          word-break: keep-all;
        }

        .post-footer {
          display: flex;
          gap: 20px;
          border-top: 1px solid rgba(0,0,0,0.03);
          padding-top: 15px;
        }

        .like-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 13px;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .like-btn:hover {
          background: rgba(255, 59, 48, 0.05);
          color: var(--status-error);
        }
      `}</style>
    </div>
  )
}

export default CommunityLounge
