import { useEffect, useMemo, useState } from "react";
import { Outlet, useMatch, useNavigate, useParams } from "react-router-dom";
import { Car, Edit, Plus, Search, Trash2 } from "lucide-react";

import { AddVehicleModal } from "./AddVehicleModal";
import { VehicleDetailModal } from "./VehicleDetailModal";
import { mockVehicles } from "@/mocks/vehicles";
import { getVehicleList, toVehicleUiModel } from "@/api/vehicle";
import { extractContent } from "@/api/api";

export function VehicleList() {
  const navigate = useNavigate();
  const { carId } = useParams();

  const PAGE_SIZE = 20;

  const isAddModalOpen = Boolean(useMatch("/manager/vehicles/new"));

  const [vehicles, setVehicles] = useState(mockVehicles.map(toVehicleUiModel));
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    number: 0,
    size: PAGE_SIZE,
    totalPages: 1,
    totalElements: 0,
    first: true,
    last: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getVehicleList({ page, size: PAGE_SIZE });

        const data = res?.data ?? res;
        const content = extractContent(data);

        const mapped = content.map(toVehicleUiModel);
        if (!ignore) {
          setVehicles(mapped);
          setPageInfo({
            number: data?.number ?? page,
            size: data?.size ?? PAGE_SIZE,
            totalPages: data?.totalPages ?? 1,
            totalElements: data?.totalElements ?? mapped.length,
            first: data?.first ?? page === 0,
            last: data?.last ?? false,
          });
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
  }, [page]);

  const totalPages = pageInfo.totalPages ?? 1;
  const totalElements = pageInfo.totalElements ?? vehicles.length;
  const currentPage = pageInfo.number ?? page;

  const canPrev = currentPage > 0;
  const canNext = currentPage < totalPages - 1;

  const from = totalElements === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const to = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const q = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !q ||
        vehicle.model.toLowerCase().includes(q) ||
        vehicle.vehicleCode.toLowerCase().includes(q) ||
        vehicle.licensePlate.toLowerCase().includes(q);

      const matchesStatus = !statusFilter || vehicle.status === statusFilter;
      const matchesLocation =
        !locationFilter || vehicle.location === locationFilter;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [vehicles, searchTerm, statusFilter, locationFilter]);

  // ✅ 모달 라우트 기반 선택 차량
  const selectedVehicle = useMemo(() => {
    if (!carId) return null;

    const found = vehicles.find(
      (v) => String(v.carId ?? v.id) === String(carId)
    );

    if (found) return found;

    // URL 직접 진입(새로고침) 같은 케이스 방어용 stub
    const num = Number(carId);
    return {
      id: Number.isNaN(num) ? carId : num,
      carId: Number.isNaN(num) ? null : num,
      model: "",
      vehicleCode: "",
      licensePlate: "",
      status: "",
      location: "",
      mileage: 0,
    };
  }, [carId, vehicles]);

  const handleAddVehicle = async (newVehicle) => {
    const vehicle = {
      ...newVehicle,
      id: Date.now(),
      status: "대기",
      mileage: 0,
      lastMaintenance: "-",
      totalRentals: 0,
    };

    setVehicles((prev) => [vehicle, ...prev]);
    navigate("/manager/vehicles");
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
    );
  };

  const handleDeleteVehicle = (id) => {
    if (!window.confirm("이 차량을 삭제하시겠습니까?")) return;
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "대기":
        return "bg-green-100 text-green-700";
      case "대여중":
        return "bg-blue-100 text-blue-700";
      case "정비중":
        return "bg-yellow-100 text-yellow-700";
      case "수리중":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(vehicles.map((v) => v.location))).filter(Boolean);
  }, [vehicles]);

  return (
    <div className="p-8">
      {loading && <div className="mb-4 text-gray-500">불러오는 중...</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-gray-900 mb-2">차량 관리</h1>
          <p className="text-gray-500">전체 차량 정보를 관리합니다</p>
        </div>
        <button
          onClick={() => navigate("/manager/vehicles/new")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          type="button"
        >
          <Plus className="w-5 h-5" />
          <span>차량 등록</span>
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="차량 모델, 코드, 번호판으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체 상태</option>
            <option value="대기">대기</option>
            <option value="대여중">대여중</option>
            <option value="정비중">정비중</option>
            <option value="수리중">수리중</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체 위치</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-gray-500 mb-1">전체 차량</div>
          <div className="text-gray-900">{totalElements.toLocaleString()}대</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-gray-500 mb-1">대기</div>
          <div className="text-gray-900">
            {vehicles.filter((v) => v.status === "대기").length}대
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-gray-500 mb-1">대여중</div>
          <div className="text-gray-900">
            {vehicles.filter((v) => v.status === "대여중").length}대
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-gray-500 mb-1">정비/수리</div>
          <div className="text-gray-900">
            {
              vehicles.filter(
                (v) => v.status === "정비중" || v.status === "수리중"
              ).length
            }
            대
          </div>
        </div>
      </div>

      {/* 차량 목록 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">차량</th>
                <th className="px-6 py-3 text-left text-gray-700">차량코드</th>
                <th className="px-6 py-3 text-left text-gray-700">번호판</th>
                <th className="px-6 py-3 text-left text-gray-700">위치</th>
                <th className="px-6 py-3 text-left text-gray-700">상태</th>
                <th className="px-6 py-3 text-left text-gray-700">주행거리</th>
                <th className="px-6 py-3 text-left text-gray-700">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/manager/vehicles/${vehicle.carId ?? vehicle.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-blue-100 flex items-center justify-center">
                        {vehicle.carImage ? (
                          <img
                            src={vehicle.carImage}
                            alt={vehicle.model}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <Car className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-gray-900">{vehicle.model}</div>
                        <div className="text-gray-500 text-sm">
                          {vehicle.brand} {vehicle.year}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{vehicle.vehicleCode}</td>
                  <td className="px-6 py-4 text-gray-600">{vehicle.licensePlate}</td>
                  <td className="px-6 py-4 text-gray-600">{vehicle.location}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                        vehicle.status
                      )}`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {vehicle.mileage.toLocaleString()}km
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/manager/vehicles/${vehicle.carId ?? vehicle.id}`);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        type="button"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVehicle(vehicle.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12 text-gray-500">차량이 없습니다</div>
        )}

        {/* ✅ 페이지네이션 */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-600">
            {totalElements.toLocaleString()}대 중
            <span className="ml-1">
              {totalElements === 0
                ? "0"
                : `${from}-${to}`}
            </span>
            <span className="ml-1">표시</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={!canPrev}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              이전
            </button>

            <div className="text-sm text-gray-700 min-w-20 text-center">
              {currentPage + 1} / {Math.max(totalPages, 1)}
            </div>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={!canNext}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {/* ✅ 라우트 기반: 차량 등록 모달 */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => navigate("/manager/vehicles")}
        onAdd={handleAddVehicle}
      />

      {/* ✅ 라우트 기반: 상세 모달 */}
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => navigate("/manager/vehicles")}
          onUpdate={handleUpdateVehicle}
          onDelete={(id) => {
            setVehicles((prev) => prev.filter((v) => v.id !== id));
            navigate("/manager/vehicles");
          }}
        />
      )}

      {/* nested route 매칭 유지 */}
      <Outlet />
    </div>
  );
}
