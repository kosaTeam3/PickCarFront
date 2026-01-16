import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
export function SignupLicenseStep({ licenseName: initialLicenseName, licenseNumber: initialLicenseNumber, licenseIssuer: initialLicenseIssuer, licenseIssueDate: initialLicenseIssueDate, onNext, onBack }) {
    const [licenseName, setLicenseName] = useState(initialLicenseName);
    const [licenseNumber, setLicenseNumber] = useState(initialLicenseNumber);
    const [licenseIssuer, setLicenseIssuer] = useState(initialLicenseIssuer);
    const [licenseIssueDate, setLicenseIssueDate] = useState(initialLicenseIssueDate);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (licenseName.trim() && licenseNumber.trim() && licenseIssuer.trim() && licenseIssueDate) {
            onNext(licenseName, licenseNumber, licenseIssuer, licenseIssueDate);
        }
    };
    const issuers = [
        '서울지방경찰청',
        '부산지방경찰청',
        '경기북부지방경찰청',
        '경기남부지방경찰청',
        '인천지방경찰청',
        '강원지방경찰청',
        '충북지방경찰청',
        '충남지방경찰청',
        '대전지방경찰청',
        '세종지방경찰청',
        '전북지방경찰청',
        '전남지방경찰청',
        '광주지방경찰청',
        '경북지방경찰청',
        '경남지방경찰청',
        '대구지방경찰청',
        '울산지방경찰청',
        '제주지방경찰청',
    ];
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
          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">3</div>
        </div>
        
        <h2 className="text-gray-900 mb-2">운전면허 정보 입력</h2>
        <p className="text-gray-600">렌터카 이용을 위한 면허 정보를 입력하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="license-name" className="block text-gray-700 mb-2">
            이름 (면허증상)
          </label>
          <input type="text" id="license-name" value={licenseName} onChange={(e) => setLicenseName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" placeholder="홍길동" required/>
          <p className="text-gray-500 mt-2">면허증에 기재된 이름과 동일하게 입력하세요</p>
        </div>

        <div>
          <label htmlFor="license-number" className="block text-gray-700 mb-2">
            면허증 번호
          </label>
          <input type="text" id="license-number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" placeholder="11-12-123456-78" required/>
        </div>

        <div>
          <label htmlFor="license-issuer" className="block text-gray-700 mb-2">
            발급처
          </label>
          <select id="license-issuer" value={licenseIssuer} onChange={(e) => setLicenseIssuer(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" required>
            <option value="">선택하세요</option>
            {issuers.map((issuer) => (<option key={issuer} value={issuer}>
                {issuer}
              </option>))}
          </select>
        </div>

        <div>
          <label htmlFor="license-issue-date" className="block text-gray-700 mb-2">
            발급일자
          </label>
          <input type="date" id="license-issue-date" value={licenseIssueDate} onChange={(e) => setLicenseIssueDate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" required/>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">
          가입 완료
        </button>
      </form>
    </div>);
}
