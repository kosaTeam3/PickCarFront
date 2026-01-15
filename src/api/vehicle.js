import {api} from "./client";

// 네 백엔드 엔드포인트에 맞춰서 수정
export function getVehicleList(params) {
    return api("/api/manager/vehicles", {params});
}

export function getVehicleDetail(vehicleId) {
    return api(`/api/manager/vehicles/${vehicleId}`);
}

export function createVehicle(payload) {
    return api("/api/manager/vehicles", {method: "POST", body: payload});
}

export function updateVehicle(vehicleId, payload) {
    return api(`/api/manager/vehicles/${vehicleId}`, {method: "PUT", body: payload});
}

export function deleteVehicle(vehicleId) {
    return api(`/api/manager/vehicles/${vehicleId}`, {method: "DELETE"});
}

// 전체 조회
export function toVehicleUiModel(dto) {
    return {
        id: dto.carId,
        carId: dto.carId,

        vehicleCode: dto.vehicleIdNumber,
        vehicleIdNum: dto.vehicleIdNumber,

        carImage: dto.image,
        model: dto.model,
        carNumber: dto.carNumber,

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

// 상세 조회
export function toVehicleDetailUiModel(dto, fallback = {}) {
    return {
        // fallback(목록에서 갖고 온 값들: location/branchName 등) 먼저 깔고
        ...fallback,

        id: dto.carId,
        carId: dto.carId,

        vehicleCode: dto.vehicleIdNumber,
        vehicleIdNum: dto.vehicleIdNumber,

        // 모달이 기대하는 이름들 맞춰주기
        image: dto.image,
        carImage: dto.image,

        licensePlate: dto.carNumber,
        carNumber: dto.carNumber,

        model: dto.model,
        brand: dto.brand,
        year: dto.year,

        // 모달이 minAge를 쓰고 있어서 맞춰줌
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

        // 상태/연료는 UI 표시용 한글 유지
        status: STATUS_KO[dto.status] ?? dto.status,
        statusCode: dto.status,

        fuelType: FUEL_KO[dto.fuelType] ?? dto.fuelType,
        fuelTypeCode: dto.fuelType,

        // location은 상세 DTO에 없으니 fallback 유지
        location: fallback.location ?? fallback.branchName ?? "",
    };
}
