import {useEffect, useMemo, useState} from "react";
import {Building2, MapPin, Phone, Plus, Users} from "lucide-react";
import {AddBranchModal} from "./AddBranchModal";
import {BranchDetailModal} from "./BranchDetailModal";
import {mockBranches, mockEmployees} from "@/mocks/organization";
import {getBranchList, toBranchUiModel} from "@/api/branch";
import {extractContent} from "@/api/api";

export function OrganizationManagement() {
    const [branches, setBranches] = useState(mockBranches);
    const employees = useMemo(() => mockEmployees, []);
    const [totalBranches, setTotalBranches] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        (async () => {
            setLoading(true);
            setError("");

            try {
                const res = await getBranchList({page: 0, size: 30});
                const content = extractContent(res);

                const mapped = content.map(toBranchUiModel);
                if (!ignore) setTotalBranches(res.totalElements)
                if (!ignore) setBranches(mapped);
            } catch (e) {
                if (!ignore) setError(e?.message ?? String(e));
            } finally {
                if (!ignore) setLoading(false);
            }
        })();

        return () => {
            ignore = true;
        };
    }, []);

    const getManagerName = (branch) => branch.managerName ?? "-";

    const handleAddBranch = async (newBranch) => {

        const branch = {
            ...newBranch,
            id: Date.now(),
            employeeCount: 0,
            vehicleCount: 0,
            managerName: getManagerName({managerName: "-"}),
        };

        setBranches((prev) => [branch, ...prev]);
        setIsAddBranchOpen(false);
    };

    const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    return (
        <div className="p-8">
            {loading && <div className="mb-4 text-gray-500">불러오는 중...</div>}
            {error && <div className="mb-4 text-red-600">{error}</div>}

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-gray-900 mb-2">지점 관리</h1>
                    <p className="text-gray-500">지점 및 조직 정보를 관리합니다</p>
                </div>
                <button
                    onClick={() => setIsAddBranchOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    type="button"
                >
                    <Plus className="w-5 h-5"/>
                    <span>지점 등록</span>
                </button>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="w-5 h-5 text-blue-600"/>
                        </div>
                        <span className="text-gray-600">총 지점 수</span>
                    </div>
                    <div className="text-gray-900">{totalBranches}개</div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="w-5 h-5 text-green-600"/>
                        </div>
                        <span className="text-gray-600">총 직원 수</span>
                    </div>
                    <div className="text-gray-900">{branches.reduce((sum, b) => sum + b.employeeCount, 0)}명</div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Building2 className="w-5 h-5 text-purple-600"/>
                        </div>
                        <span className="text-gray-600">총 차량 수</span>
                    </div>
                    <div className="text-gray-900">
                        {branches.reduce((sum, b) => sum + b.vehicleCount, 0)}대
                    </div>
                </div>
            </div>

            {/* 지점 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                    <div
                        key={branch.id}
                        onClick={() => setSelectedBranch(branch)}
                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer hover:border-blue-500"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Building2 className="w-6 h-6 text-blue-600"/>
                                </div>
                                <div>
                                    <h3 className="text-gray-900">{branch.name}</h3>
                                    <p className="text-gray-500">관리자: {getManagerName(branch)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 mt-1 flex-shrink-0"/>
                                <span>{branch.address}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4"/>
                                <span>{branch.phone}</span>
                            </div>

                            <div className="pt-3 border-t border-gray-200 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Users className="w-4 h-4"/>
                                        <span>직원</span>
                                    </div>
                                    <div className="text-gray-900">{branch.employeeCount}명</div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Building2 className="w-4 h-4"/>
                                        <span>차량</span>
                                    </div>
                                    <div className="text-gray-900">{branch.vehicleCount}대</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AddBranchModal
                isOpen={isAddBranchOpen}
                onClose={() => setIsAddBranchOpen(false)}
                onAdd={handleAddBranch}
                employees={employees}
            />

            {selectedBranch && (
                <BranchDetailModal
                    branch={selectedBranch}
                    employees={employees.filter((e) => e.branchId === selectedBranch.id)}
                    allEmployees={employees}
                    onClose={() => setSelectedBranch(null)}
                    onUpdate={(updatedBranch) => {
                        setBranches((prev) =>
                            prev.map((b) => (b.id === updatedBranch.id ? updatedBranch : b))
                        );
                    }}
                />
            )}
        </div>
    );
}
