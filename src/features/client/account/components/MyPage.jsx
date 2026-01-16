import { useState } from 'react';
import { ArrowLeft, LogOut, Ticket, History, UserCircle, Plus, Trash2 } from 'lucide-react';
export function MyPage({ user, onBack, onLogout }) {
    const [activeTab, setActiveTab] = useState('coupon');
    const [coupons, setCoupons] = useState([
        {
            id: '1',
            code: 'WELCOME2024',
            name: '신규 가입 쿠폰',
            discount: 10000,
            expiryDate: '2024-12-31',
            used: false,
        },
        {
            id: '2',
            code: 'SUMMER50',
            name: '여름 할인 쿠폰',
            discount: 50000,
            expiryDate: '2024-08-31',
            used: true,
        },
    ]);
    const [newCouponCode, setNewCouponCode] = useState('');
    // Mock 이용 내역
    const rentalHistory = [
        {
            id: '1',
            vehicleName: '현대 아반떼',
            vehicleType: '준중형 세단',
            startTime: '2024-12-15T10:00',
            endTime: '2024-12-17T10:00',
            location: '강남역 지점',
            price: 100000,
            status: 'completed',
        },
        {
            id: '2',
            vehicleName: '기아 쏘렌토',
            vehicleType: 'SUV',
            startTime: '2024-11-20T14:00',
            endTime: '2024-11-22T14:00',
            location: '서울역 지점',
            price: 170000,
            status: 'completed',
        },
        {
            id: '3',
            vehicleName: '현대 캐스퍼',
            vehicleType: '경형',
            startTime: '2024-10-10T09:00',
            endTime: '2024-10-11T09:00',
            location: '잠실 지점',
            price: 35000,
            status: 'cancelled',
        },
    ];
    const handleAddCoupon = () => {
        if (newCouponCode.trim()) {
            // Mock 쿠폰 등록
            const newCoupon = {
                id: Date.now().toString(),
                code: newCouponCode,
                name: '등록된 쿠폰',
                discount: 5000,
                expiryDate: '2024-12-31',
                used: false,
            };
            setCoupons([...coupons, newCoupon]);
            setNewCouponCode('');
            alert('쿠폰이 등록되었습니다!');
        }
    };
    const handleDeleteCoupon = (id) => {
        if (confirm('쿠폰을 삭제하시겠습니까?')) {
            setCoupons(coupons.filter(c => c.id !== id));
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5"/>
                돌아가기
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white">{user.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-gray-900">{user.name}님</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <LogOut className="w-5 h-5"/>
              로그아웃
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button onClick={() => setActiveTab('coupon')} className={`flex-1 flex items-center justify-center gap-2 py-4 transition-colors ${activeTab === 'coupon'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-600 hover:text-gray-900'}`}>
              <Ticket className="w-5 h-5"/>
              쿠폰 등록
            </button>
            <button onClick={() => setActiveTab('history')} className={`flex-1 flex items-center justify-center gap-2 py-4 transition-colors ${activeTab === 'history'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-600 hover:text-gray-900'}`}>
              <History className="w-5 h-5"/>
              이용 내역
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex-1 flex items-center justify-center gap-2 py-4 transition-colors ${activeTab === 'profile'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-600 hover:text-gray-900'}`}>
              <UserCircle className="w-5 h-5"/>
              내 정보 수정
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Coupon Tab */}
          {activeTab === 'coupon' && (<div>
              <h2 className="text-gray-900 mb-6">쿠폰 관리</h2>
              
              {/* Add Coupon */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <label className="block text-gray-700 mb-2">쿠폰 코드 입력</label>
                <div className="flex gap-3">
                  <input type="text" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value)} placeholder="쿠폰 코드를 입력하세요" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"/>
                  <button onClick={handleAddCoupon} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5"/>
                    등록
                  </button>
                </div>
              </div>

              {/* Coupon List */}
              <div className="space-y-4">
                {coupons.map((coupon) => (<div key={coupon.id} className={`border-2 rounded-lg p-4 ${coupon.used
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-indigo-200 bg-indigo-50'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-gray-900">{coupon.name}</h3>
                          {coupon.used && (<span className="text-gray-500 px-2 py-1 bg-gray-200 rounded">사용완료</span>)}
                        </div>
                        <p className="text-gray-600 mb-2">코드: {coupon.code}</p>
                        <div className="flex items-center gap-4">
                          <p className="text-indigo-600">
                            {coupon.discount.toLocaleString()}원 할인
                          </p>
                          <p className="text-gray-500">
                            유효기간: {new Date(coupon.expiryDate).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                      </div>
                      {!coupon.used && (<button onClick={() => handleDeleteCoupon(coupon.id)} className="text-red-500 hover:text-red-700 transition-colors">
                          <Trash2 className="w-5 h-5"/>
                        </button>)}
                    </div>
                  </div>))}
              </div>
            </div>)}

          {/* History Tab */}
          {activeTab === 'history' && (<div>
              <h2 className="text-gray-900 mb-6">이용 내역</h2>
              <div className="space-y-4">
                {rentalHistory.map((rental) => (<div key={rental.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-gray-900 mb-1">{rental.vehicleName}</h3>
                        <p className="text-gray-600">{rental.vehicleType}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg ${rental.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'}`}>
                        {rental.status === 'completed' ? '이용완료' : '취소됨'}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-gray-600 mb-3">
                      <div>
                        <p className="text-gray-500">대여 지점</p>
                        <p>{rental.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">대여 기간</p>
                        <p>
                          {new Date(rental.startTime).toLocaleDateString('ko-KR')} ~{' '}
                          {new Date(rental.endTime).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-gray-900">
                        결제 금액: <span className="text-indigo-600">{rental.price.toLocaleString()}원</span>
                      </p>
                    </div>
                  </div>))}
              </div>
            </div>)}

          {/* Profile Tab */}
          {activeTab === 'profile' && (<div>
              <h2 className="text-gray-900 mb-6">내 정보 수정</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">이름</label>
                  <input type="text" defaultValue={user.name} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"/>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">이메일</label>
                  <input type="email" defaultValue={user.email} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"/>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">전화번호</label>
                  <input type="tel" placeholder="010-1234-5678" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"/>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">비밀번호 변경</label>
                  <input type="password" placeholder="새 비밀번호" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent mb-3"/>
                  <input type="password" placeholder="비밀번호 확인" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"/>
                </div>
                <button type="submit" onClick={(e) => {
                e.preventDefault();
                alert('정보가 수정되었습니다.');
            }} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                  저장하기
                </button>
              </form>
            </div>)}
        </div>
      </div>
    </div>);
}
