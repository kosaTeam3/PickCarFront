import { Car, User as UserIcon, LogOut, AlertTriangle, CheckCircle } from 'lucide-react';
export function MainMenu({ user, activeRental, onRentClick, onMyPageClick, onAccidentReportClick, onReturnVehicle, onLogout }) {
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white">{user.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-gray-600">환영합니다</p>
                <p className="text-gray-900">{user.name}님</p>
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <LogOut className="w-5 h-5"/>
              로그아웃
            </button>
          </div>
        </div>

        {/* Active Rental Status */}
        {activeRental && (<div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-2">현재 이용 중인 차량</h3>
                <p className="text-indigo-100">차량을 안전하게 운전하세요</p>
              </div>
              <Car className="w-12 h-12 opacity-80"/>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-indigo-100 mb-1">차량</p>
                  <p className="text-white">{activeRental.vehicleName}</p>
                  <p className="text-indigo-100">{activeRental.vehicleType}</p>
                </div>
                <div>
                  <p className="text-indigo-100 mb-1">대여 지점</p>
                  <p className="text-white">{activeRental.location}</p>
                </div>
                <div>
                  <p className="text-indigo-100 mb-1">대여 시작</p>
                  <p className="text-white">{new Date(activeRental.startTime).toLocaleString('ko-KR')}</p>
                </div>
                <div>
                  <p className="text-indigo-100 mb-1">반납 예정</p>
                  <p className="text-white">
                    {activeRental.endTime
                ? new Date(activeRental.endTime).toLocaleString('ko-KR')
                : '미정'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={onAccidentReportClick} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5"/>
                사고 접수
              </button>
              <button onClick={onReturnVehicle} className="flex-1 bg-white text-indigo-600 hover:bg-indigo-50 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5"/>
                차량 반납
              </button>
            </div>
          </div>)}

        {/* Main Menu Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Rent Menu */}
          <button onClick={onRentClick} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all text-left group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                <Car className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors"/>
              </div>
            </div>
            <h2 className="text-gray-900 mb-2">차량 렌트</h2>
            <p className="text-gray-600 mb-4">
              원하는 시간과 장소에서<br />
              차량을 대여하세요
            </p>
            <div className="flex items-center text-indigo-600">
              렌트하기
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          {/* MyPage Menu */}
          <button onClick={onMyPageClick} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all text-left group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <UserIcon className="w-8 h-8 text-green-600 group-hover:text-white transition-colors"/>
              </div>
            </div>
            <h2 className="text-gray-900 mb-2">마이페이지</h2>
            <p className="text-gray-600 mb-4">
              내 정보 관리 및<br />
              이용 내역 확인
            </p>
            <div className="flex items-center text-green-600">
              바로가기
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-gray-900 mb-4">안내사항</h3>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600">1</span>
              </div>
              <p>차량 대여 시 면허증과 신분증을 지참해주세요.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600">2</span>
              </div>
              <p>반납 시간을 초과할 경우 추가 요금이 발생할 수 있습니다.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600">3</span>
              </div>
              <p>사고 발생 시 즉시 사고 접수를 해주시기 바랍니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
