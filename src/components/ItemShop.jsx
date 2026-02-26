import { ShoppingBag, Zap, TrendingUp, Layout, CheckCircle2 } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function ItemShop() {
    const { points, shopItems, ownedUpgrades, buyItem } = useGameStore()

    const getIcon = (id) => {
        switch (id) {
            case 'exp_boost': return <Zap size={32} color="#ffcc00" />
            case 'income_boost': return <TrendingUp size={32} color="#34c759" />
            case 'esc_custom': return <Layout size={32} color="#0071e3" />
            default: return <ShoppingBag size={32} />
        }
    }

    return (
        <div className="item-shop container">
            <header className="shop-header">
                <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>루팡 전용 상점</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>포인트로 업무 효율과 위장을 한 단계 더 업그레이드하세요.</p>
            </header>

            <div className="items-grid">
                {shopItems.map(item => {
                    const isOwned = item.type === 'unlock' && ownedUpgrades.includes(item.id)
                    const isCurrentBuff = item.type === 'buff' && ownedUpgrades.includes(item.id)

                    return (
                        <div key={item.id} className={`shop-card glass ${isOwned ? 'owned' : ''}`}>
                            <div className="card-top">
                                <div className="icon-circle">
                                    {getIcon(item.id)}
                                </div>
                                {isOwned && <span className="badge owned-badge"><CheckCircle2 size={14} /> 보유 중</span>}
                                {isCurrentBuff && <span className="badge buff-badge">적용 중</span>}
                            </div>

                            <div className="card-body">
                                <h3 className="item-name">{item.name}</h3>
                                <p className="item-desc">{item.desc}</p>
                            </div>

                            <div className="card-footer">
                                <div className="price-tag">
                                    <span className="price-val">{item.price.toLocaleString()}</span>
                                    <span className="price-unit">FP</span>
                                </div>
                                <button
                                    className={`btn ${isOwned ? 'btn-disabled' : 'btn-primary'}`}
                                    onClick={() => buyItem(item.id)}
                                    disabled={isOwned}
                                >
                                    {isOwned ? '이미 보유' : '구매하기'}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="shop-notices glass">
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    * '경험치 비약'과 '업무 자동화 툴'은 구매 즉시 1시간 동안 효력이 지속됩니다 (중첩 구매 가능).<br />
                    * '위장 테마 패키지'는 한 번 구매하면 영구적으로 위장 모드 설정에서 사용 가능합니다.
                </p>
            </div>

            <style>{`
        .item-shop {
          text-align: left;
          padding-top: 20px;
          padding-bottom: 60px;
        }
        .shop-header {
          margin-bottom: 40px;
        }
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }
        .shop-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: var(--transition-smooth);
        }
        .shop-card:not(.owned):hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          background: white;
        }
        .shop-card.owned {
          opacity: 0.8;
          border-color: rgba(0,0,0,0.05);
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .icon-circle {
          width: 64px;
          height: 64px;
          background: #f5f5f7;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .owned-badge { background: #e8f0fe; color: var(--accent-blue); }
        .buff-badge { background: #e6f7ed; color: #34c759; }

        .item-name {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .item-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          min-height: 42px;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .price-tag {
          display: flex;
          flex-direction: column;
        }
        .price-val {
          font-size: 18px;
          font-weight: 800;
        }
        .price-unit {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .btn-disabled {
          background: #eee;
          color: #999;
          cursor: not-allowed;
        }
        .shop-notices {
          padding: 20px;
          border-radius: 12px;
          text-align: left;
        }
      `}</style>
        </div>
    )
}

export default ItemShop
