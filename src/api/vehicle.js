import { api } from "./client";

// 네 백엔드 엔드포인트에 맞춰서 수정
export function getVehicleList(params) {
  return api("/api/manager/vehicles", { params });
}

export function getVehicleDetail(vehicleId) {
  return api(`/api/manager/vehicles/${vehicleId}`);
}

export function createVehicle(payload) {
  return api("/api/manager/vehicles", { method: "POST", body: payload });
}

export function updateVehicle(vehicleId, payload) {
  return api(`/api/manager/vehicles/${vehicleId}`, { method: "PUT", body: payload });
}

export function deleteVehicle(vehicleId) {
  return api(`/api/manager/vehicles/${vehicleId}`, { method: "DELETE" });
}

// ----------------------------
// ✅ DTO -> UI Model (목록)
// ----------------------------
export function toVehicleUiModel(dto) {
  return {
    id: dto.carId,
    carId: dto.carId,

    vehicleCode: dto.vehicleIdNumber,
    vehicleIdNum: dto.vehicleIdNumber,

    carImage: dto.image ?? "",
    model: dto.model ?? "",
    year: dto.year ?? null,

    // UI에서 차량번호로 쓰는 필드들(혼란 방지용으로 둘 다 제공)
    carNumber: dto.carNumber ?? "",
    licensePlate: dto.carNumber ?? "",

    // 목록 DTO에는 location이 없으니까 지점명으로 대체
    location: dto.branchName ?? "",

    mileage: Number(dto.mileage ?? 0),
    ageLimit: dto.ageLimit ?? 0,

    // ✅ UI 표기용
    status: STATUS_KO[dto.status] ?? dto.status,
    fuelType: FUEL_KO[dto.fuelType] ?? dto.fuelType,

    // ✅ 내부값도 같이 들고 있으면 필터/색상 로직 편함
    statusCode: dto.status,
    fuelTypeCode: dto.fuelType,

    color: dto.color,
    branchId: dto.branchId,
    branchName: dto.branchName,
  };
}

const STATUS_KO = {
  DRIVING: "운행중",
  MAINTENANCE: "정비중",
  WAITING: "대기",
};

const FUEL_KO = {
  GASOLINE: "가솔린",
  DIESEL: "디젤",
  ELECTRIC: "전기",
  LPG: "LPG",
  HYBRID: "하이브리드",
};

// ----------------------------
// ✅ DTO -> UI Model (상세)
// ----------------------------
export function toVehicleDetailUiModel(dto, fallback = {}) {
  return {
    // fallback(목록에서 갖고 온 값들: location/branchName 등) 먼저 깔고
    ...fallback,

    id: dto.carId,
    carId: dto.carId,

    vehicleCode: dto.vehicleIdNumber,
    vehicleIdNum: dto.vehicleIdNumber,

    image: dto.image,
    carImage: dto.image,

    licensePlate: dto.carNumber,
    carNumber: dto.carNumber,

    model: dto.model,
    brand: dto.brand,
    year: dto.year,

    minAge: dto.ageLimit,
    ageLimit: dto.ageLimit,

    insurance: dto.insuranceName,
    insuranceName: dto.insuranceName,

    mileage: Number(dto.mileage ?? 0),

    purchasePrice: dto.purchasePrice,
    modelPrice: dto.modelPrice,
    price: dto.price,

    seater: dto.seater,
    color: dto.color,

    branchId: dto.branchId,

    status: STATUS_KO[dto.status] ?? dto.status,
    statusCode: dto.status,

    fuelType: FUEL_KO[dto.fuelType] ?? dto.fuelType,
    fuelTypeCode: dto.fuelType,

    // location은 상세 DTO에 없으니 fallback 유지
    location: fallback.location ?? fallback.branchName ?? "",
  };
}
