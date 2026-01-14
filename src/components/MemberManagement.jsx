import {useMemo, useState} from "react";
import {Calendar, CreditCard, Mail, Phone, Search, User} from "lucide-react";
import {mockMembers} from "@/mocks/members";

export function MemberManagement() {
    const members = mockMembers;

    const [searchTerm, setSearchTerm] = useState("");
    const [membershipFilter, setMembershipFilter] = useState("");

    const filteredMembers = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();

        return members.filter((member) => {
            const matchesSearch =
                !q ||
                member.name.includes(searchTerm) ||
                member.email.toLowerCase().includes(q) ||
                member.phone.includes(searchTerm) ||
                member.licenseNumber.includes(searchTerm);

            const matchesMembership =
                !membershipFilter || member.membershipType === membershipFilter;

            return matchesSearch && matchesMembership;
        });
    }, [members, searchTerm, membershipFilter]);

    const getStatusColor = (status) => {
        switch (status) {
            case "활성":
                return "bg-green-100 text-green-700";
            case "휴면":
                return "bg-yellow-100 text-yellow-700";
            case "정지":
                return "bg-red-100 text-red-700";
        }
    };

    const getMembershipColor = (type) => {
        switch (type) {
            case "VIP":
                return "bg-purple-100 text-purple-700";
            case "프리미엄":
                return "bg-blue-100 text-blue-700";
            case "일반":
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-gray-900 mb-2">회원 관리</h1>
                <p className="text-gray-500">회원 정보를 조회하고 관리합니다</p>
            </div>

            {/* 검색 및 필터 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="이름, 이메일, 전화번호, 면허번호로 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="w-48">
                        <select
                            value={membershipFilter}
                            onChange={(e) => setMembershipFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">전체 등급</option>
                            <option value="일반">일반</option>
                            <option value="프리미엄">프리미엄</option>
                            <option value="VIP">VIP</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-500 mb-1">전체 회원</div>
                    <div className="text-gray-900">{members.length}명</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-500 mb-1">VIP</div>
                    <div className="text-gray-900">
                        {members.filter((m) => m.membershipType === "VIP").length}명
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-500 mb-1">프리미엄</div>
                    <div className="text-gray-900">
                        {members.filter((m) => m.membershipType === "프리미엄").length}명
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-500 mb-1">일반</div>
                    <div className="text-gray-900">
                        {members.filter((m) => m.membershipType === "일반").length}명
                    </div>
                </div>
            </div>

            {/* 회원 목록 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-700">회원</th>
                            <th className="px-6 py-3 text-left text-gray-700">연락처</th>
                            <th className="px-6 py-3 text-left text-gray-700">등급</th>
                            <th className="px-6 py-3 text-left text-gray-700">가입일</th>
                            <th className="px-6 py-3 text-left text-gray-700">대여횟수</th>
                            <th className="px-6 py-3 text-left text-gray-700">상태</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <User className="w-5 h-5 text-blue-600"/>
                                        </div>
                                        <div>
                                            <div className="text-gray-900">{member.name}</div>
                                            <div className="text-gray-500">
                                                생년월일: {member.birthDate}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="w-4 h-4"/>
                                            {member.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone className="w-4 h-4"/>
                                            {member.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                    <span
                        className={`inline-block px-3 py-1 rounded-full ${getMembershipColor(
                            member.membershipType
                        )}`}
                    >
                      {member.membershipType}
                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4"/>
                                        {member.joinDate}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-900">
                                    {member.rentalCount}회
                                </td>
                                <td className="px-6 py-4">
                    <span
                        className={`inline-block px-3 py-1 rounded-full ${getStatusColor(
                            member.status
                        )}`}
                    >
                      {member.status}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredMembers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">검색 결과가 없습니다</div>
                )}
            </div>

            {/* 상세 정보 */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4">회원 등급 안내</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-5 h-5 text-gray-600"/>
                            <span className="text-gray-900">일반</span>
                        </div>
                        <p className="text-gray-600">기본 회원 등급</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-5 h-5 text-blue-600"/>
                            <span className="text-gray-900">프리미엄</span>
                        </div>
                        <p className="text-gray-600">월 대여 10회 이상</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-5 h-5 text-purple-600"/>
                            <span className="text-gray-900">VIP</span>
                        </div>
                        <p className="text-gray-600">월 대여 20회 이상</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
