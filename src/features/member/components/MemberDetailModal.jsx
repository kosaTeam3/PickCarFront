import { useState } from 'react';
import { X, User, ShieldAlert, Edit3, AlertCircle, Ban } from 'lucide-react';
import { clientService } from "@/api/client"; 

export function MemberDetailModal({ member, onClose, onUpdate }) {
  const [isBlacking, setIsBlacking] = useState(false); 
  const [blacklistInfo, setBlacklistInfo] = useState(''); 
  const isBlacked = member.blacked;

  const handleAddBlacklist = async () => {
    if (!blacklistInfo.trim()) return alert("차단 사유를 적어주세요.");
    try {
      await clientService.addBlacklist(member.clientId, { blacklistInfo });
      alert("이 회원의 서비스 이용이 차단되었습니다.");
      onClose(); 
    } catch (error) {
      alert("실패: 권한이 없습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[150] p-4">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] flex flex-col border-[10px] border-black shadow-[20px_20px_0px_0px_rgba(255,255,255,0.3)]">
        
        {/* 헤더: 밝은 회색 배경 + 검정 글씨 */}
        <div className="px-8 py-8 flex items-center justify-between bg-gray-300 border-b-[8px] border-black">
          <div className="flex items-center gap-6">
            <User className="w-14 h-14 text-black" strokeWidth={4} />
            <div>
              <h2 className="text-5xl font-black text-black">{member.clientName}</h2>
              <p className="text-2xl font-black text-black mt-2 underline">
                상태: {isBlacked ? "● [이용 차단됨]" : "○ [정상 회원]"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 border-[5px] border-black hover:bg-gray-400">
            <X className="w-12 h-12 text-black" strokeWidth={5} />
          </button>
        </div>

        {/* 본문: 흰색 배경 + 검정 글씨 */}
        <div className="p-12 overflow-y-auto flex-1 bg-white">
          {isBlacking ? (
            <div className="space-y-8 text-black">
              <h3 className="text-4xl font-black underline">서비스 이용 차단(블랙리스트)</h3>
              <p className="text-2xl font-black bg-yellow-300 p-5 border-4 border-black">
                ※ 회원 탈퇴가 아니며, 렌트 서비스 이용만 제한됩니다.
              </p>
              <textarea 
                className="w-full h-56 p-6 text-3xl border-[8px] border-black text-black bg-white font-black outline-none placeholder:text-gray-400"
                placeholder="차단 사유를 입력하세요."
                value={blacklistInfo}
                onChange={(e) => setBlacklistInfo(e.target.value)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-16">
              <DetailBox label="회원 번호" value={member.clientId} />
              <DetailBox label="연락처" value={member.clientCall} />
              <DetailBox label="면허번호" value={member.driverLicenceNumber} />
              <DetailBox label="가입날짜" value={member.clientRegisterDate?.split('T')[0]} />
              
              {isBlacked && (
                <div className="col-span-full p-8 bg-gray-100 border-[6px] border-black">
                  <h4 className="text-black font-black text-3xl mb-4 underline">차단 사유</h4>
                  <p className="text-black text-2xl font-black">{member.blackedInfo || '사유 없음'}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 푸터: 버튼도 무조건 검정 글씨/테두리 */}
        <div className="p-10 border-t-[8px] border-black bg-gray-200 flex justify-end gap-8">
          <button 
            onClick={onClose} 
            className="px-12 py-6 bg-white text-black font-black text-3xl border-[6px] border-black hover:bg-gray-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            닫기
          </button>

          {isBlacking ? (
            <button 
              onClick={handleAddBlacklist} 
              className="px-14 py-6 bg-black text-white font-black text-3xl hover:bg-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]"
            >
              차단 확정
            </button>
          ) : (
            <>
              {!isBlacked && (
                <button 
                  onClick={() => setIsBlacking(true)}
                  className="px-10 py-6 bg-white text-black font-black text-3xl border-[6px] border-black hover:bg-orange-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                  이용 차단 설정
                </button>
              )}
              <button 
                onClick={() => onUpdate?.(member)} 
                className="px-10 py-6 bg-white text-black font-black text-3xl border-[6px] border-black hover:bg-indigo-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                정보 수정
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailBox({ label, value }) {
  return (
    <div className="border-b-[8px] border-black pb-4">
      <p className="text-xl font-black text-gray-700 mb-2 italic underline">{label}</p>
      <p className="text-4xl font-black text-black">{value || '-'}</p>
    </div>
  );
}