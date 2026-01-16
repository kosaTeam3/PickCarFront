import { useEffect, useState } from "react";
import { clientService } from "@/api/client";
import { MemberDetailModal } from "./MemberDetailModal"; // 방금 만든 모달 컴포넌트
import { Search } from "lucide-react"; // 아이콘 라이브러리

export function MemberManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 1. 검색어 상태
  const [selectedMember, setSelectedMember] = useState(null); // 2. 선택된 회원 상세 정보

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const data = await clientService.getClients();
        setMembers(data);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

const handleRowClick = async (clientId) => {
  try {
    // 세 가지 데이터를 병렬로 호출하여 성능 최적화
    const [detail, rentals, accidents] = await Promise.all([
      clientService.getClientDetail(clientId),
      clientService.getRentHistory(clientId),
      clientService.getAccidentHistory(clientId)
    ]);

    // 모든 데이터를 합쳐서 모달에 전달
    setSelectedMember({
      ...detail,
      rentals,
      accidents
    });
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    alert("회원 정보를 불러오는 중 오류가 발생했습니다.");
  }
};

  // 4. 이름 또는 이메일로 검색 필터링
  const filteredMembers = members.filter((m) =>
    m.clientName.includes(searchTerm) || m.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">데이터를 불러오는 중...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">회원 목록 관리</h1>

        {/* 검색창 UI */}
        <div className="relative w-72">
          <input
            type="text"
            placeholder="이름 또는 이메일 검색"
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">이름</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">이메일</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">연락처</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">가입일</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
               <tr
                  key={member.clientId}
                  onClick={() => handleRowClick(member.clientId)} // 클릭 시 ID 전달
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-400">{member.clientId}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                    {member.clientName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.clientEmail}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.clientCall}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {member.clientRegisterDate?.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-black rounded-full ${
                        member.blacklisted ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {member.blacklisted ? "제한" : "정상"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center text-gray-400">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 6. 상세 정보 모달 연결 */}
      {selectedMember && (
        <MemberDetailModal 
            member={selectedMember} 
            onClose={() => setSelectedMember(null)} 
        />
      )}
    </div>
  );
}