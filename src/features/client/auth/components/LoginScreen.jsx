import { useState } from 'react';
import { Car } from 'lucide-react';
export function LoginScreen({ onSignupClick, onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = (e) => {
        e.preventDefault();
        // 데모용 로그인 - 실제로는 서버에서 인증
        if (email && password) {
            onLogin(email, '홍길동');
        }
    };
    return (<div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
          <Car className="w-8 h-8 text-white"/>
        </div>
        <h1 className="text-gray-900 mb-2">렌터카 서비스</h1>
        <p className="text-gray-600">로그인하여 서비스를 이용하세요</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            이메일
          </label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" placeholder="이메일을 입력하세요" required/>
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">
            비밀번호
          </label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" placeholder="비밀번호를 입력하세요" required/>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">
          로그인
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-3">아직 계정이 없으신가요?</p>
        <button onClick={onSignupClick} className="w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
          회원가입
        </button>
      </div>
    </div>);
}
