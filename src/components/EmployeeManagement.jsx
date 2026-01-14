import {useMemo, useState} from "react";
import {Building2, Calendar, IdCard, Phone, Search, User} from "lucide-react";
import {branchNames, mockEmployees} from "@/mocks/organization";

export function EmployeeManagement() {
    const employees = mockEmployees;

    const [searchTerm, setSearchTerm] = useState("");
    const [positionFilter, setPositionFilter] = useState("");

    const positions = useMemo(
        () => Array.from(new Set(employees.map((e) => e.position))),
        [employees]
    );

    const filteredEmployees = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();

        return employees.filter((employee) => {
            const matchesSearch =
                !q ||
                employee.name.includes(searchTerm) ||
                employee.phone.includes(searchTerm) ||
                employee.userId.toLowerCase().includes(q);

            const matchesPosition = !positionFilter || employee.position === positionFilter;
            return matchesSearch && matchesPosition;
        });
    }, [employees, searchTerm, positionFilter]);

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-gray-900 mb-2">직원 관리</h1>
                <p className="text-gray-500">전체 직원 정보를 관리합니다</p>
            </div>

            {/* 검색 및 필터 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="이름, 전화번호, ID로 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="w-48">
                        <select
                            value={positionFilter}
                            onChange={(e) => setPositionFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">전체 직책</option>
                            {positions.map((position) => (
                                <option key={position} value={position}>
                                    {position}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-500 mb-1">전체 직원</div>
                    <div className="text-gray-900">{employees.length}명</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-500 mb-1">지점장</div>
                    <div className="text-gray-900">
                        {employees.filter((e) => e.position === "지점장").length}명
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-500 mb-1">영업사원</div>
                    <div className="text-gray-900">
                        {employees.filter((e) => e.position === "영업사원").length}명
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-500 mb-1">정비사</div>
                    <div className="text-gray-900">
                        {employees.filter((e) => e.position === "정비사").length}명
                    </div>
                </div>
            </div>

            {/* 직원 목록 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-700">직원</th>
                            <th className="px-6 py-3 text-left text-gray-700">연락처</th>
                            <th className="px-6 py-3 text-left text-gray-700">직책</th>
                            <th className="px-6 py-3 text-left text-gray-700">소속</th>
                            <th className="px-6 py-3 text-left text-gray-700">입사일</th>
                            <th className="px-6 py-3 text-left text-gray-700">사용자 ID</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredEmployees.map((employee) => (
                            <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <User className="w-5 h-5 text-blue-600"/>
                                        </div>
                                        <div className="text-gray-900">{employee.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone className="w-4 h-4"/>
                                        {employee.phone}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {employee.position}
                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Building2 className="w-4 h-4"/>
                                        {branchNames[employee.branchId] || "미배정"}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4"/>
                                        {employee.hireDate}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <IdCard className="w-4 h-4"/>
                                        {employee.userId}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredEmployees.length === 0 && (
                    <div className="text-center py-12 text-gray-500">검색 결과가 없습니다</div>
                )}
            </div>
        </div>
    );
}
