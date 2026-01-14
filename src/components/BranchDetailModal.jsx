import {useEffect, useState} from "react";
import {Calendar, IdCard, Phone, Plus, User, X} from "lucide-react";
import {AddEmployeeModal} from "./AddEmployeeModal";

export function BranchDetailModal({
                                      branch,
                                      employees,
                                      allEmployees,
                                      onClose,
                                      onUpdate,
                                  }) {
    const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
    const [branchEmployees, setBranchEmployees] = useState(employees);

    useEffect(() => {
        setBranchEmployees(employees);
    }, [employees]);

    const handleAddEmployee = (newEmployee) => {
        const employee = {
            ...newEmployee,
            id: Date.now().toString(),
            branchId: branch.id,
        };

        setBranchEmployees((prev) => {
            const next = [...prev, employee];
            onUpdate({...branch, employeeCount: next.length});
            return next;
        });

        setIsAddEmployeeOpen(false);
    };

    const manager = allEmployees.find((e) => e.id === branch.managerId);

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* 헤더 */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-gray-900">{branch.name}</h2>
                                <p className="text-gray-500">{branch.address}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                type="button"
                            >
                                <X className="w-6 h-6"/>
                            </button>
                        </div>
                    </div>

                    {/* 지점 정보 */}
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="text-gray-500 mb-1">지점 연락처</div>
                                <div className="text-gray-900">{branch.phone}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-1">지점장</div>
                                <div className="text-gray-900">{manager?.name || "-"}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-1">직원 수</div>
                                <div className="text-gray-900">{branchEmployees.length}명</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-1">차량 수</div>
                                <div className="text-gray-900">{branch.vehicleCount}대</div>
                            </div>
                        </div>
                    </div>

                    {/* 직원 목록 */}
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-gray-900">소속 직원</h3>
                            <button
                                onClick={() => setIsAddEmployeeOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                type="button"
                            >
                                <Plus className="w-4 h-4"/>
                                <span>직원 등록</span>
                            </button>
                        </div>

                        {branchEmployees.length > 0 ? (
                            <div className="space-y-3">
                                {branchEmployees.map((employee) => (
                                    <div
                                        key={employee.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-100 rounded-full">
                                                <User className="w-5 h-5 text-blue-600"/>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <div className="text-gray-900">{employee.name}</div>
                                                    <div className="text-gray-500">{employee.position}</div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4"/>
                                                        <span>{employee.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <IdCard className="w-4 h-4"/>
                                                        <span>ID: {employee.userId}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4"/>
                                                        <span>입사일: {employee.hireDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                등록된 직원이 없습니다
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 직원 등록 모달 */}
            <AddEmployeeModal
                isOpen={isAddEmployeeOpen}
                onClose={() => setIsAddEmployeeOpen(false)}
                onAdd={handleAddEmployee}
                branchName={branch.name}
            />
        </>
    );
}
