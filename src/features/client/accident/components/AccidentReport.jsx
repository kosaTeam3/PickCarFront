import { useState } from 'react';
import { ArrowLeft, LogOut, AlertTriangle, Upload, Camera } from 'lucide-react';
export function AccidentReport({ user, activeRental, onBack, onLogout }) {
    const [accidentType, setAccidentType] = useState('collision');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [hasInjury, setHasInjury] = useState(false);
    const [hasPoliceReport, setHasPoliceReport] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('사고 접수가 완료되었습니다.\n담당자가 곧 연락드리겠습니다.');
        onBack();
    };
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
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
                </div>
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <LogOut className="w-5 h-5"/>
              로그아웃
            </button>
          </div>
        </div>

        {/* Active Rental Info */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1"/>
            <div>
              <h3 className="text-red-900 mb-1">사고 접수</h3>
              <p className="text-red-700">침착하게 정보를 입력해주세요. 필요시 119에 먼저 연락하세요.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-600 mb-2">현재 이용 차량</p>
            <p className="text-gray-900">{activeRental.vehicleName} ({activeRental.vehicleType})</p>
            <p className="text-gray-600 mt-2">대여 지점: {activeRental.location}</p>
          </div>
        </div>

        {/* Accident Report Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-gray-900 mb-6">사고 정보 입력</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Accident Type */}
            <div>
              <label className="block text-gray-700 mb-3">사고 유형</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setAccidentType('collision')} className={`p-4 border-2 rounded-lg transition-all ${accidentType === 'collision'
            ? 'border-red-600 bg-red-50 text-red-900'
            : 'border-gray-200 hover:border-gray-300'}`}>
                  차량 충돌
                </button>
                <button type="button" onClick={() => setAccidentType('scratch')} className={`p-4 border-2 rounded-lg transition-all ${accidentType === 'scratch'
            ? 'border-red-600 bg-red-50 text-red-900'
            : 'border-gray-200 hover:border-gray-300'}`}>
                  차량 스크래치
                </button>
                <button type="button" onClick={() => setAccidentType('breakdown')} className={`p-4 border-2 rounded-lg transition-all ${accidentType === 'breakdown'
            ? 'border-red-600 bg-red-50 text-red-900'
            : 'border-gray-200 hover:border-gray-300'}`}>
                  차량 고장
                </button>
                <button type="button" onClick={() => setAccidentType('other')} className={`p-4 border-2 rounded-lg transition-all ${accidentType === 'other'
            ? 'border-red-600 bg-red-50 text-red-900'
            : 'border-gray-200 hover:border-gray-300'}`}>
                  기타
                </button>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-gray-700 mb-2">
                사고 발생 위치 <span className="text-red-500">*</span>
              </label>
              <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="상세 주소를 입력하세요" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent" required/>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-gray-700 mb-2">
                사고 상황 설명 <span className="text-red-500">*</span>
              </label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="사고 발생 경위와 상황을 자세히 설명해주세요" rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none" required/>
            </div>

            {/* Injury Status */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={hasInjury} onChange={(e) => setHasInjury(e.target.checked)} className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-600"/>
                <span className="text-gray-700">인명 피해가 있습니다</span>
              </label>
            </div>

            {/* Police Report */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={hasPoliceReport} onChange={(e) => setHasPoliceReport(e.target.checked)} className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-600"/>
                <span className="text-gray-700">경찰 신고를 완료했습니다</span>
              </label>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-gray-700 mb-3">
                사고 현장 사진 (선택사항)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2"/>
                  <p className="text-gray-600">사진 촬영</p>
                </button>
                <button type="button" className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2"/>
                  <p className="text-gray-600">파일 업로드</p>
                </button>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-yellow-900 mb-2">긴급 연락처</h4>
              <div className="space-y-1 text-yellow-800">
                <p>• 응급상황: 119</p>
                <p>• 경찰신고: 112</p>
                <p>• 보험사 긴급출동: 1588-0000</p>
                <p>• 렌터카 고객센터: 1234-5678</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button type="button" onClick={onBack} className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                취소
              </button>
              <button type="submit" className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors">
                사고 접수하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);
}
