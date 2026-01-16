import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
export function SignupEmailStep({ email: initialEmail, onNext, onBack }) {
    const [email, setEmail] = useState(initialEmail);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            onNext(email);
        }
    };
    return (<div className="bg-white rounded-2xl shadow-xl p-8">
      <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2"/>
        돌아가기
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">1</div>
          <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center">2</div>
          <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center">3</div>
        </div>
        
        <h2 className="text-gray-900 mb-2">이메일 입력</h2>
        <p className="text-gray-600">회원가입에 사용할 이메일을 입력하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="signup-email" className="block text-gray-700 mb-2">
            이메일 주소
          </label>
          <input type="email" id="signup-email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" placeholder="example@email.com" required/>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">
          다음
        </button>
      </form>
    </div>);
}
