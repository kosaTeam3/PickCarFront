import { useState } from 'react';
import { Calendar, Clock, LogOut } from 'lucide-react';
export function RentTimeSelection({ user, startTime: initialStartTime, endTime: initialEndTime, onNext, onLogout }) {
    const [startTime, setStartTime] = useState(initialStartTime);
    const [endTime, setEndTime] = useState(initialEndTime);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (startTime) {
            onNext(startTime, endTime);
        }
    };
    // 현재 시간을 기본값으로 설정하기 위한 min 값
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16);
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
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

        {/* Time Selection Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-gray-900 mb-2">렌트 시간 선택</h2>
            <p className="text-gray-600">차량을 이용할 시간을 선택해주세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 렌트 시작 시간 */}
              <div className="space-y-2">
                <label htmlFor="start-time" className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-indigo-600"/>
                  렌트 시작 시간
                  <span className="text-red-500">*</span>
                </label>
                <input type="datetime-local" id="start-time" value={startTime} onChange={(e) => setStartTime(e.target.value)} min={minDateTime} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" required/>
              </div>

              {/* 렌트 종료 시간 (Optional) */}
              <div className="space-y-2">
                <label htmlFor="end-time" className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-indigo-600"/>
                  렌트 종료 시간
                  <span className="text-gray-500">(선택사항)</span>
                </label>
                <input type="datetime-local" id="end-time" value={endTime} onChange={(e) => setEndTime(e.target.value)} min={startTime || minDateTime} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"/>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900">
                💡 <strong>알림:</strong> 종료 시간을 선택하지 않으면 1일 단위로 자동 계산됩니다.
              </p>
            </div>

            {/* Selected Time Summary */}
            {startTime && (<div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-gray-900 mb-3">선택한 시간</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    시작: <span className="text-indigo-600">{new Date(startTime).toLocaleString('ko-KR')}</span>
                  </p>
                  {endTime && (<p className="text-gray-700">
                      종료: <span className="text-indigo-600">{new Date(endTime).toLocaleString('ko-KR')}</span>
                    </p>)}
                </div>
              </div>)}

            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors">
              다음 단계: 위치 선택
            </button>
          </form>
        </div>
      </div>
    </div>);
}
