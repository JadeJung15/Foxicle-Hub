import { useState, useEffect } from 'react'
import { MessageSquare, Send, User, ShieldAlert } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function CommunityLounge() {
  const { posts, addPost, likePost, username } = useGameStore()
  const [content, setContent] = useState('')

  // 루머 엔진: 20초마다 가상의 '루팡 정보' 생성
  useEffect(() => {
    const rumors = [
      "부장님 지금 옥상으로 담배 피우러 가심. 10분간 자유다!",
      "오피스코인 심상치 않은데.. 풀매수 가야하나?",
      "오늘 점심 메뉴 돈까스라네요. 다들 참고하세요.",
      "폭시전자 전년 대비 실적 대박 났다는 썰이 있음.",
      "누가 탕비실에 커피 쏟고 그냥 갔냐? 양심 어디?"
    ]

    const rumorTimer = setInterval(() => {
      const randomRumor = rumors[Math.floor(Math.random() * rumors.length)]
      const rumorPost = {
        id: Date.now(),
        author: `익명의 루팡 [${Math.floor(Math.random() * 9999)}]`,
        content: randomRumor,
        likes: 0,
        createdAt: new Date().toISOString()
      }
      // 스토어에 직접 메시지를 넣는 대신, UI에만 잠깐 보여주거나 시스템 메시지로 표현 가능
      // 여기서는 실제 포스트 시스템에 가끔씩 '시스템 팁'처럼 노출되도록 구현
    }, 20000)
    return () => clearInterval(rumorTimer)
  }, [])

  const handlePost = () => {
    if (!content.trim()) return
    addPost(content)
    setContent('')
  }

  return (
    <div className="community-container animate-fade">
      <header className="community-header">
        <h2>비밀 라운지</h2>
        <p>익명으로 소통하는 우리들만의 대나무숲</p>
      </header>

      <div className="post-input glass">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="익명으로 하고 싶은 말을 남겨보세요. (업무 일지 아님!)"
        />
        <button className="btn btn-primary" onClick={handlePost}>
          <Send size={18} /> 전송하기
        </button>
      </div>

      <div className="post-list">
        {posts.length === 0 ? (
          <div className="empty-state">아직 올라온 글이 없습니다. 첫 마디를 떼보세요!</div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card glass animate-fade">
              <div className="post-meta">
                <span className="author"><User size={14} /> {post.author}</span>
                <span className="date">{new Date(post.createdAt).toLocaleTimeString()}</span>
              </div>
              <p className="post-content">{post.content}</p>
              <div className="post-actions">
                <button className="like-btn" onClick={() => likePost(post.id)}>
                  ❤️ {post.likes}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
                .community-container { text-align: left; max-width: 800px; margin: 0 auto; padding-bottom: 50px; }
                .community-header { margin-bottom: 30px; }
                .community-header h2 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
                .community-header p { color: var(--text-secondary); }

                .post-input { padding: 20px; display: flex; flex-direction: column; gap: 15px; margin-bottom: 40px; }
                .post-input textarea { 
                    width: 100%; height: 100px; padding: 15px; border: 1px solid #eee; border-radius: 12px; 
                    resize: none; font-family: inherit; font-size: 15px; outline: none; background: #fafafa;
                }
                .post-input textarea:focus { border-color: var(--accent-blue); background: white; }
                .post-input .btn { align-self: flex-end; }

                .post-list { display: flex; flex-direction: column; gap: 20px; }
                .post-card { padding: 24px; }
                .post-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; color: var(--text-secondary); font-size: 13px; }
                .author { font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 6px; }
                .post-content { font-size: 16px; line-height: 1.6; color: #333; white-space: pre-wrap; margin-bottom: 20px; }
                .like-btn { 
                    background: #f5f5f7; border: none; padding: 8px 16px; border-radius: 20px; 
                    font-weight: 700; cursor: pointer; transition: all 0.2s; 
                }
                .like-btn:hover { background: #ffebeb; transform: scale(1.05); }
                .empty-state { text-align: center; padding: 50px; color: var(--text-secondary); }
            `}</style>
    </div>
  )
}

export default CommunityLounge
