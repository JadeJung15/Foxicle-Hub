import { create } from 'zustand'

const useGameStore = create((set) => ({
    // Economy State
    points: 1000,
    level: 1,
    experience: 0,

    // Pet & Inventory State
    pets: [],
    inventory: {
        eggs: 0
    },

    // Community State
    posts: [
        { id: 1, author: '운영자_루팡', content: '비밀 라운지에 오신 것을 환영합니다. 오늘도 효율적인 근무 되세요!', likes: 12, createdAt: new Date().toISOString() },
        { id: 2, author: '김과장', content: '혹시 이번 분기 예산안 엑셀 양식 가진 분 있나요? "몰컴"용으로 부탁드려요.', likes: 5, createdAt: new Date().toISOString() }
    ],

    // UI State
    isWorkMode: false,
    activeTab: 'dashboard', // dashboard, games, shop, community
    workTemplate: 'excel', // excel, ppt, slack

    // User Profile
    username: '루팡_' + Math.floor(Math.random() * 1000),
    officePosition: '대리',
    leaderboard: [
        { name: '김부장(은퇴희망)', level: 42, title: '전설의 루팡' },
        { name: '재무팀 박대리', level: 35, title: '투명인간' },
        { name: '영업2팀 최과장', level: 28, title: '코인 중독' },
        { name: '인사팀 정사원', level: 12, title: '꿈나무' }
    ],
    shopItems: [
        { id: 'exp_boost', name: '경험치 비약', desc: '1시간 동안 펫 획득 경험치 2배', price: 500, type: 'buff' },
        { id: 'income_boost', name: '업무 자동화 툴', desc: '1시간 동안 자동 수익 1.5배', price: 1000, type: 'buff' },
        { id: 'esc_custom', name: '위장 테마 패키지', desc: '위장 모드 전용 다크 테마 잠금 해제', price: 2000, type: 'unlock' }
    ],
    ownedUpgrades: [],
    stocks: [
        { id: 'fox_electronics', name: '폭시전자', price: 1500, trend: 0, history: [1400, 1450, 1500] },
        { id: 'banana_tech', name: '바나나테크', price: 800, trend: 0, history: [850, 820, 800] },
        { id: 'office_coin', name: '오피스코인', price: 100, trend: 0, history: [90, 110, 100] }
    ],
    portfolio: [], // { stockId: string, amount: number, avgPrice: number }

    // Actions
    setPoints: (amount) => set((state) => ({ points: state.points + amount })),

    // 펫 시스템 액션
    buyEgg: () => set((state) => {
        const eggPrice = 500 // 반하자 가격: 500 FP
        if (state.points < eggPrice) {
            alert('포인트가 부족합니다! (필요: 500 FP)')
            return {}
        }
        return {
            points: state.points - eggPrice,
            inventory: { ...state.inventory, eggs: state.inventory.eggs + 1 }
        }
    }),

    hatchEgg: () => set((state) => {
        if (state.inventory.eggs <= 0) return {}

        const rarities = [
            { name: '일반', chance: 0.70, color: '#86868b' },
            { name: '희귀', chance: 0.25, color: '#0071e3' },
            { name: '전설', chance: 0.05, color: '#ff9500' }
        ]

        // 확률 기반 부화 로직
        const rand = Math.random()
        let cumulative = 0
        let selectedRarity = rarities[0]

        for (const r of rarities) {
            cumulative += r.chance
            if (rand < cumulative) {
                selectedRarity = r
                break
            }
        }

        const petTypes = ['폭시클', '루팡냥이', '오피스독', '구름여우']
        const newPet = {
            id: Date.now(),
            name: `${selectedRarity.name} ${petTypes[Math.floor(Math.random() * petTypes.length)]}`,
            rarity: selectedRarity.name,
            color: selectedRarity.color,
            level: 1,
            experience: 0,
            happiness: 100,
            createdAt: new Date().toISOString()
        }

        return {
            inventory: { ...state.inventory, eggs: state.inventory.eggs - 1 },
            pets: [...state.pets, newPet]
        }
    }),

    feedPet: (id) => set((state) => {
        const foodPrice = 50 // 먹이 가격
        if (state.points < foodPrice) {
            alert('포인트가 부족합니다!')
            return {}
        }
        return {
            points: state.points - foodPrice,
            pets: state.pets.map(pet => {
                if (pet.id === id) {
                    const newExp = pet.experience + 20
                    const neededExp = pet.level * 50
                    if (newExp >= neededExp) {
                        return { ...pet, level: pet.level + 1, experience: newExp - neededExp, happiness: Math.min(100, pet.happiness + 10) }
                    }
                    return { ...pet, experience: newExp, happiness: Math.min(100, pet.happiness + 5) }
                }
                return pet
            })
        }
    }),

    trainPet: (id) => set((state) => {
        const trainPrice = 100 // 훈련 가격
        if (state.points < trainPrice) {
            alert('포인트가 부족합니다!')
            return {}
        }
        return {
            points: state.points - trainPrice,
            pets: state.pets.map(pet => {
                if (pet.id === id) {
                    return { ...pet, experience: pet.experience + 50, happiness: Math.max(0, pet.happiness - 10) }
                }
                return pet
            })
        }
    }),

    autoEarnPoints: () => set((state) => {
        if (state.pets.length === 0) return {}

        // 펫들의 레벨 합에 비례하여 포인트 생성 (반하자 밸런스: 레벨당 1 FP)
        const totalLevel = state.pets.reduce((sum, pet) => sum + pet.level, 0)

        // 상점 버프 적용: 업무 자동화 툴 (1.5배)
        const hasBoost = state.ownedUpgrades.includes('income_boost')
        const bonusPoints = Math.floor(totalLevel * (hasBoost ? 1.5 : 1))

        return {
            points: state.points + bonusPoints
        }
    }),

    buyItem: (itemId) => set((state) => {
        const item = state.shopItems.find(i => i.id === itemId)
        if (!item || state.points < item.price) {
            alert('구매할 수 없습니다! (포인트 부족 혹은 아이템 정보 없음)')
            return {}
        }

        // 이미 보유한 영구 해금 아이템인지 체크
        if (item.type === 'unlock' && state.ownedUpgrades.includes(itemId)) {
            alert('이미 보유하고 있는 아이템입니다.')
            return {}
        }

        return {
            points: state.points - item.price,
            ownedUpgrades: [...state.ownedUpgrades, itemId]
        }
    }),

    addPost: (content) => set((state) => {
        const newPost = {
            id: Date.now(),
            author: state.username,
            content,
            likes: 0,
            createdAt: new Date().toISOString()
        }
        // 게시글 작성 시 포인트 및 경험치 보상 (활동 유도)
        setTimeout(() => state.earnPoints('chat'), 0)
        return { posts: [newPost, ...state.posts] }
    }),

    likePost: (id) => set((state) => ({
        posts: state.posts.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post)
    })),

    addExperience: (exp) => set((state) => {
        const newExp = state.experience + exp
        const levelUpThreshold = state.level * 100
        if (newExp >= levelUpThreshold) {
            return {
                level: state.level + 1,
                experience: newExp - levelUpThreshold
            }
        }
        return { experience: newExp }
    }),

    toggleWorkMode: () => set((state) => ({ isWorkMode: !state.isWorkMode })),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setWorkTemplate: (template) => set({ workTemplate: template }),

    // Semi-Hard Economy Logic: 포인트 지급 함수 (난이도 조절)
    earnPoints: (type) => set((state) => {
        let baseAmount = 0
        let expGain = 0

        switch (type) {
            case 'checkin':
                baseAmount = 50
                expGain = 10
                break
            case 'chat':
                baseAmount = 5
                expGain = 2
                break
            case 'game_win_small':
                baseAmount = 20
                expGain = 5
                break
            default:
                baseAmount = 0
        }

        return {
            points: state.points + baseAmount,
            experience: state.experience + expGain
        }
    }),

    // 투자 시스템 액션
    updateStockPrices: () => set((state) => ({
        stocks: state.stocks.map(s => {
            const change = (Math.random() - 0.5) * (s.id === 'office_coin' ? 40 : 10) // 코인은 변동폭 큼
            const newPrice = Math.max(10, Math.floor(s.price + change))
            return {
                ...s,
                price: newPrice,
                trend: change,
                history: [...s.history.slice(-9), newPrice]
            }
        })
    })),

    buyStock: (stockId, amount) => set((state) => {
        const stock = state.stocks.find(s => s.id === stockId)
        const totalCost = stock.price * amount
        if (state.points < totalCost) {
            alert('포인트가 부족합니다!')
            return {}
        }

        const existing = state.portfolio.find(p => p.stockId === stockId)
        let newPortfolio
        if (existing) {
            const newAmount = existing.amount + amount
            const newAvgPrice = ((existing.avgPrice * existing.amount) + totalCost) / newAmount
            newPortfolio = state.portfolio.map(p => p.stockId === stockId ? { ...p, amount: newAmount, avgPrice: newAvgPrice } : p)
        } else {
            newPortfolio = [...state.portfolio, { stockId, amount, avgPrice: stock.price }]
        }

        return {
            points: state.points - totalCost,
            portfolio: newPortfolio
        }
    }),

    sellStock: (stockId, amount) => set((state) => {
        const pos = state.portfolio.find(p => p.stockId === stockId)
        if (!pos || pos.amount < amount) {
            alert('보유 수량이 부족합니다!')
            return {}
        }

        const stock = state.stocks.find(s => s.id === stockId)
        const totalReturn = stock.price * amount

        const newPortfolio = state.portfolio.map(p => {
            if (p.stockId === stockId) {
                return { ...p, amount: p.amount - amount }
            }
            return p
        }).filter(p => p.amount > 0)

        return {
            points: state.points + totalReturn,
            portfolio: newPortfolio
        }
    })
}))

export default useGameStore
