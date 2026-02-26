import { useState } from 'react'
import { Layout, TrendingUp, Laptop, ClipboardList, ShieldAlert, Mail } from 'lucide-react'
import DiceGame from './DiceGame'
import OfficeSlot from './OfficeSlot'
import WorkSorting from './WorkSorting'
import BossEscape from './BossEscape'
import EmailClean from './EmailClean'

function GameCenter() {
  const [activeGame, setActiveGame] = useState(null)

  const games = [
    {
      id: 'dice',
      title: '포인트 단타 거래소',
      desc: '포인트의 등락을 예측하여 고수익을 노리세요.',
      icon: <TrendingUp size={32} color="#0071e3" />,
      tag: '인기',
      component: <DiceGame />
    },
    {
      id: 'slot',
      title: '오피스 슬롯 머신',
      desc: '매일 아침 커피 한 잔의 행운. 잭팟을 노려보세요.',
      icon: <Laptop size={32} color="#ff9500" />,
      tag: '신규',
      component: <OfficeSlot />
    },
    {
      id: 'sorting',
      title: '서류 분류 속도전',
      desc: '떨어지는 서류를 정확하게 분류하여 보너스를 얻으세요.',
      icon: <ClipboardList size={32} color="#34c759" />,
      tag: '아케이드',
      component: <WorkSorting />
    },
    {
      id: 'escape',
      title: '상사 피하기',
      desc: '다가오는 상사와 보고서를 피해 최대한 오래 버티세요.',
      icon: <ShieldAlert size={32} color="#ff3b30" />,
      tag: '액션',
      component: <BossEscape />
    },
    {
      id: 'email',
      title: '스팸 메일 청소',
      desc: '쏟아지는 메일함에서 스팸만 골라 신속하게 삭제하세요.',
      icon: <Mail size={32} color="#5856d6" />,
      tag: '순발력',
      component: <EmailClean />
    }
  ]

  if (activeGame) {
    const game = games.find(g => g.id === activeGame)
    return (
      <div className="game-viewer">
        <button className="btn btn-outline back-btn" onClick={() => setActiveGame(null)}>
          ← 게임 센터로 돌아가기
        </button>
        <div className="active-game-container">
          {game.component}
        </div>
        <style>{`
          .game-viewer {
            animation: fadeIn 0.3s ease;
          }
          .back-btn {
            margin-bottom: 20px;
            font-size: 13px;
          }
          .active-game-container {
            max-width: 700px;
            margin: 0 auto;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="game-center">
      <div className="center-header">
        <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>게임 센터</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>효율적인 루팡을 위한 고성능 미니게임 컬렉션</p>
      </div>

      <div className="game-selection-grid">
        {games.map(game => (
          <div key={game.id} className="game-select-card glass" onClick={() => setActiveGame(game.id)}>
            <div className="card-top">
              {game.icon}
              <span className="game-tag">{game.tag}</span>
            </div>
            <div className="card-body">
              <h3 className="game-title">{game.title}</h3>
              <p className="game-desc">{game.desc}</p>
            </div>
            <div className="card-footer">
              <span className="play-hint">지금 플레이하기 →</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .game-center {
          text-align: left;
          padding-bottom: 60px;
        }
        .center-header {
          margin-bottom: 40px;
        }
        .game-selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        .game-select-card {
          padding: 30px;
          cursor: pointer;
          transition: var(--transition-smooth);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .game-select-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.1);
          background: white;
          border-color: var(--accent-blue);
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .game-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 4px 10px;
          background: rgba(0,0,0,0.05);
          border-radius: 20px;
          text-transform: uppercase;
        }
        .game-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .game-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .card-footer {
          margin-top: auto;
          font-size: 13px;
          font-weight: 600;
          color: var(--accent-blue);
          opacity: 0.8;
        }
      `}</style>
    </div>
  )
}

export default GameCenter
