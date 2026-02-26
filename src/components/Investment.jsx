import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Wallet, PieChart, Info, ArrowRightLeft } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function Investment() {
    const { points, stocks, portfolio, updateStockPrices, buyStock, sellStock } = useGameStore()
    const [selectedStockId, setSelectedStockId] = useState(stocks[0].id)
    const [buyAmount, setBuyAmount] = useState(1)

    // 15초마다 가격 변동 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            updateStockPrices()
        }, 15000)
        return () => clearInterval(timer)
    }, [updateStockPrices])

    const selectedStock = stocks.find(s => s.id === selectedStockId)
    const myPosition = portfolio.find(p => p.stockId === selectedStockId) || { amount: 0, avgPrice: 0 }

    const profitLoss = myPosition.amount > 0
        ? ((selectedStock.price - myPosition.avgPrice) * myPosition.amount).toFixed(0)
        : 0
    const profitRate = myPosition.amount > 0
        ? (((selectedStock.price - myPosition.avgPrice) / myPosition.avgPrice) * 100).toFixed(2)
        : 0

    return (
        <div className="investment-container">
            <header className="invest-header">
                <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>루팡 재테크 센터</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>포인트는 모으는 것이 아니라 불리는 것입니다.</p>
            </header>

            <div className="invest-grid">
                {/* Stock List */}
                <div className="stock-list glass">
                    <h3 className="section-title"><TrendingUp size={20} /> 실시간 시장 현황</h3>
                    <div className="stocks">
                        {stocks.map(stock => (
                            <div
                                key={stock.id}
                                className={`stock-item ${selectedStockId === stock.id ? 'active' : ''}`}
                                onClick={() => setSelectedStockId(stock.id)}
                            >
                                <div className="stock-info">
                                    <span className="stock-name">{stock.name}</span>
                                    <span className="stock-price">{stock.price.toLocaleString()} FP</span>
                                </div>
                                <div className={`stock-trend ${stock.trend >= 0 ? 'up' : 'down'}`}>
                                    {stock.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {Math.abs(stock.trend).toFixed(0)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trade Area */}
                <div className="trade-area glass">
                    <div className="trade-header">
                        <h3 className="selected-name">{selectedStock.name}</h3>
                        <div className="price-now">
                            <span className="label">현재가</span>
                            <span className="value">{selectedStock.price.toLocaleString()} FP</span>
                        </div>
                    </div>

                    <div className="chart-placeholder">
                        <div className="chart-bars">
                            {selectedStock.history.map((h, i) => (
                                <div
                                    key={i}
                                    className="bar"
                                    style={{ height: `${(h / 2000) * 100}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    <div className="my-stats">
                        <div className="stat">
                            <span className="label">보유 수량</span>
                            <span className="value">{myPosition.amount} 주</span>
                        </div>
                        <div className="stat">
                            <span className="label">평균 단가</span>
                            <span className="value">{myPosition.avgPrice.toFixed(0)} FP</span>
                        </div>
                        <div className={`stat ${Number(profitLoss) >= 0 ? 'profit' : 'loss'}`}>
                            <span className="label">손익 (수익률)</span>
                            <span className="value">
                                {Number(profitLoss) >= 0 ? '+' : ''}{profitLoss} FP ({profitRate}%)
                            </span>
                        </div>
                    </div>

                    <div className="trade-controls">
                        <div className="input-group">
                            <input
                                type="number"
                                value={buyAmount}
                                onChange={(e) => setBuyAmount(Math.max(1, parseInt(e.target.value) || 0))}
                                className="amount-input"
                            />
                            <span className="unit">주</span>
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-primary buy-btn" onClick={() => buyStock(selectedStockId, buyAmount)}>매수</button>
                            <button className="btn btn-outline sell-btn" onClick={() => sellStock(selectedStockId, buyAmount)}>매도</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="portfolio-summary glass">
                <h3 className="section-title"><PieChart size={20} /> 나의 포트폴리오 요약</h3>
                <div className="p-grid">
                    <div className="p-item">
                        <span className="label">가용 포인트</span>
                        <span className="value">{points.toLocaleString()} FP</span>
                    </div>
                    <div className="p-item">
                        <span className="label">총 자산 가치</span>
                        <span className="value">
                            {(points + portfolio.reduce((acc, p) => acc + (stocks.find(s => s.id === p.stockId).price * p.amount), 0)).toLocaleString()} FP
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
        .investment-container { text-align: left; padding-bottom: 60px; }
        .invest-header { margin-bottom: 40px; }
        .invest-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 24px; margin-bottom: 24px; }
        .section-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; display: flex; alignItems: center; gap: 8px; }
        
        .stock-list { padding: 24px; }
        .stocks { display: flex; flex-direction: column; gap: 12px; }
        .stock-item { 
          padding: 16px; border-radius: 12px; cursor: pointer; display: flex; justify-content: space-between; 
          align-items: center; transition: all 0.2s; border: 1px solid transparent; background: rgba(0,0,0,0.02);
        }
        .stock-item:hover { background: rgba(0,0,0,0.05); }
        .stock-item.active { background: white; border-color: var(--accent-blue); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .stock-name { font-weight: 700; display: block; }
        .stock-price { font-size: 13px; color: var(--text-secondary); }
        .stock-trend { font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 8px; }
        .stock-trend.up { color: #ff3b30; background: #ffebeb; }
        .stock-trend.down { color: #0071e3; background: #e8f0fe; }

        .trade-area { padding: 30px; display: flex; flex-direction: column; gap: 24px; }
        .trade-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .selected-name { font-size: 24px; font-weight: 800; }
        .price-now .label { display: block; font-size: 12px; color: var(--text-secondary); }
        .price-now .value { font-size: 24px; font-weight: 800; color: var(--accent-blue); }

        .chart-placeholder { height: 120px; background: rgba(0,0,0,0.02); border-radius: 12px; position: relative; display: flex; align-items: flex-end; padding: 0 10px; }
        .chart-bars { display: flex; gap: 4px; width: 100%; align-items: flex-end; height: 100%; }
        .bar { flex: 1; background: var(--accent-blue); opacity: 0.3; border-radius: 4px 4px 0 0; transition: height 0.3s ease; }

        .my-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .my-stats .stat .label { display: block; font-size: 11px; color: var(--text-secondary); margin-bottom: 4px; }
        .my-stats .stat .value { font-weight: 700; }
        .stat.profit .value { color: #ff3b30; }
        .stat.loss .value { color: #0071e3; }

        .trade-controls { display: flex; gap: 16px; align-items: center; padding-top: 20px; border-top: 1px solid #eee; }
        .amount-input { width: 100px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-weight: 700; text-align: center; }
        .btn-group { display: flex; gap: 8px; flex: 1; }
        .buy-btn { flex: 1; }
        .sell-btn { flex: 1; color: #ff3b30; border-color: #ff3b30; }
        .sell-btn:hover { background: #ffebeb; }

        .portfolio-summary { padding: 24px; }
        .p-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .p-item .label { display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 4px; }
        .p-item .value { font-size: 24px; font-weight: 800; color: #333; }
      `}</style>
        </div>
    )
}

export default Investment
