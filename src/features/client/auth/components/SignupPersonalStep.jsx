import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
export function SignupPersonalStep({ name: initialName, residentNumber: initialResidentNumber, onNext, onBack }) {
    const [name, setName] = useState(initialName);
    const [residentNumber1, setResidentNumber1] = useState(initialResidentNumber ? initialResidentNumber.split('-')[0] : '');
    const [residentNumber2, setResidentNumber2] = useState(initialResidentNumber ? initialResidentNumber.split('-')[1] : '');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && residentNumber1.length === 6 && residentNumber2.length === 7) {
            onNext(name, `${residentNumber1}-${residentNumber2}`);
        }
    };
    return (<div className="bg-white rounded-2xl shadow-xl p-8">
      <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2"/>
        돌아가기
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">2</div>
          <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center">3</div>
        </div>
        
        <h2 className="text-gray-900 mb-2">개인정보 입력</h2>
        <p className="text-gray-600">본인 확인을 위한 정보를 입력하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-2">
            이름
          </label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" placeholder="홍길동" required/>
        </div>

        <div>
          <label htmlFor="resident-number-1" className="block text-gray-700 mb-2">
            주민등록번호
          </label>
          <div className="flex items-center gap-2">
            <input type="text" id="resident-number-1" value={residentNumber1} onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length <= 6) {
                setResidentNumber1(value);
            }
        }} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" placeholder="000000" maxLength={6} required/>
            <span className="text-gray-500">-</span>
            <input type="password" id="resident-number-2" value={residentNumber2} onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length <= 7) {
                setResidentNumber2(value);
            }
        }} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" placeholder="0000000" maxLength={7} required/>
          </div>
          <p className="text-gray-500 mt-2">주민등록번호는 안전하게 보호됩니다</p>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">
          다음
        </button>
      </form>
    </div>);
}
