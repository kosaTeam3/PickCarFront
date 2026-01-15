import {useEffect, useMemo, useState} from "react";
import {Outlet, useMatch, useNavigate, useParams} from "react-router-dom";
import {Building2, Car, MapPin, Phone, Plus, Users} from "lucide-react";

import {AddBranchModal} from "./AddBranchModal";
import {BranchDetailModal} from "./BranchDetailModal";

import {createBranch, getBranchList, toBranchUiModel} from "@/api/branch";
import {extractContent} from "@/api/api";

export function OrganizationManagement() {
    const navigate = useNavigate();
    const {branchId} = useParams();

    const isAddBranchOpen = Boolean(useMatch("/manager/branches/new"));

    const [branches, setBranches] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        (async () => {
            setLoading(true);
            setError("");

            try {
                const branchRes = await getBranchList({page: 0, size: 50});
                const branchContent = extractContent(branchRes).map(toBranchUiModel);
                if (!ignore) {
                    setBranches(branchContent);
                }
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

    const totalVehicles = useMemo(
        () => branches.reduce((sum, b) => sum + (b.vehicleCount ?? 0), 0),
        [branches]
    );

    const totalEmployees = useMemo(
        () => branches.reduce((sum, b) => sum + (b.employeeCount ?? 0), 0),
        [branches]
    );

    // ✅ 라우트 기반: 선택된 지점
    const selectedBranch = useMemo(() => {
        if (!branchId) return null;

        const found = branches.find((b) => String(b.id) === String(branchId));
        if (found) return found;

        const num = Number(branchId);
        return {
            id: Number.isNaN(num) ? branchId : num,
            name: "",
            phone: "",
            address: "",
            managerId: null,
            managerName: "-",
            employeeCount: 0,
            vehicleCount: 0,
        };
    }, [branchId, branches]);

    const handleAddBranch = async (newBranch) => {
        const payload = {
            name: newBranch.name,
            phoneNumber: newBranch.phone,
            address: newBranch.address,
            employeeId: newBranch.managerId,
            latitude: newBranch.latitude,
            longitude: newBranch.longitude,
        };

        try {
            await createBranch(payload);

            // 낙관적 업데이트(새로고침하면 서버값으로 동기화됨)
            setBranches((prev) => [{...newBranch, id: Date.now()}, ...prev]);
            navigate("/manager/branches");
        } catch (e) {
            alert(e?.message ?? String(e));
        }
    };

    const handleUpdateBranch = (updatedBranch) => {
        setBranches((prev) => prev.map((b) => (b.id === updatedBranch.id ? updatedBranch : b)));
    };

    return (
        <div className="p-8">
            {loading && <div className="mb-4 text-gray-500">불러오는 중...</div>}
            {error && <div className="mb-4 text-red-600">{error}</div>}

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-gray-900 mb-2">조직 관리</h1>
                    <p className="text-gray-500">지점 및 조직 정보를 관리합니다</p>
                </div>
                <button
                    onClick={() => navigate("/manager/branches/new")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    type="button"
                >
                    <Plus className="w-5 h-5"/>
                    <span>지점 등록</span>
                </button>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-5 h-5 text-blue-600"/>
                        <span className="text-gray-600">총 지점</span>
                    </div>
                    <div className="text-gray-900">{branches.length}개</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-green-600"/>
                        <span className="text-gray-600">총 직원</span>
                    </div>
                    <div className="text-gray-900">{totalEmployees}명</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Car className="w-5 h-5 text-purple-600"/>
                        <span className="text-gray-600">총 차량</span>
                    </div>
                    <div className="text-gray-900">{totalVehicles}대</div>
                </div>
            </div>

            {/* 지점 목록 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {branches.map((branch) => (
                    <div
                        key={branch.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/manager/branches/${branch.id}`)}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-gray-900 mb-1">{branch.name}</h3>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <MapPin className="w-4 h-4"/>
                                    <span>{branch.address}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                                <Building2 className="w-4 h-4"/>
                                <span>{branch.managerName}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4"/>
                                <span>{branch.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Users className="w-4 h-4"/>
                                <span>직원 {branch.employeeCount ?? 0}명</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Car className="w-4 h-4"/>
                                <span>차량 {branch.vehicleCount ?? 0}대</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/manager/branches/${branch.id}`);
                                }}
                                className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                type="button"
                            >
                                상세 정보 보기
                            </button>
                        </div>
                    </div>
                ))}

                {branches.length === 0 && (
                    <div className="text-center py-12 text-gray-500 col-span-full">지점이 없습니다</div>
                )}
            </div>

            {/* ✅ 라우트 기반: 지점 등록 모달 */}
            <AddBranchModal
                isOpen={isAddBranchOpen}
                onClose={() => navigate("/manager/branches")}
                onAdd={handleAddBranch}
                employees={[]}
            />

            {/* ✅ 라우트 기반: 지점 상세 모달 */}
            {selectedBranch && (
                <BranchDetailModal
                    branch={selectedBranch}
                    employees={[]}
                    allEmployees={[]}
                    onClose={() => navigate("/manager/branches")}
                    onUpdate={handleUpdateBranch}
                />
            )}

            <Outlet/>
        </div>
    );
}
