import {useState} from 'react';
import {X, User, Mail, Phone, Calendar, CreditCard, Car, AlertTriangle} from 'lucide-react';

const mockRentalHistory = {
    '1': [
        {
            id: '1',
            vehicleModel: '현대 아반떼',
            licensePlate: '123가4567',
            startDate: '2024-12-20',
            endDate: '2024-12-25',
            cost: 250000,
            status: '완료',
        },
        {
            id: '2',
            vehicleModel: '기아 스포티지',
            licensePlate: '456나7890',
            startDate: '2024-11-10',
            endDate: '2024-11-15',
            cost: 350000,
            status: '완료',
        },
        {
            id: '3',
            vehicleModel: '제네시스 G80',
            licensePlate: '321라5678',
            startDate: '2024-10-05',
            endDate: '2024-10-10',
            cost: 800000,
            status: '완료',
        },
    ],
    '2': [
        {
            id: '4',
            vehicleModel: '현대 아반떼',
            licensePlate: '123가4567',
            startDate: '2024-12-01',
            endDate: '2024-12-05',
            cost: 200000,
            status: '완료',
        },
        {
            id: '5',
            vehicleModel: '기아 모닝',
            licensePlate: '789다1234',
            startDate: '2024-11-15',
            endDate: '2024-11-18',
            cost: 120000,
            status: '완료',
        },
    ],
    '3': [
        {
            id: '6',
            vehicleModel: '기아 모닝',
            licensePlate: '789다1234',
            startDate: '2024-12-10',
            endDate: '2024-12-15',
            cost: 150000,
            status: '완료',
        },
    ],
    '4': [
        {
            id: '7',
            vehicleModel: '현대 아반떼',
            licensePlate: '123가4567',
            startDate: '2023-08-20',
            endDate: '2023-08-25',
            cost: 220000,
            status: '완료',
        },
    ],
};

const mockAccidentHistory = {
    '1': [
        {
            id: '1',
            date: '2024-11-12',
            vehicleModel: '기아 스포티지',
            licensePlate: '456나7890',
            location: '서울 강남구 테헤란로',
            description: '주차 중 측면 접촉사고',
            damageAmount: 850000,
            status: '처리완료',
        },
    ],
    '2': [],
    '3': [],
    '4': [
        {
            id: '2',
            date: '2023-09-01',
            vehicleModel: '현대 아반떼',
            licensePlate: '123가4567',
            location: '경기 성남시',
            description: '후방 추돌사고',
            damageAmount: 1200000,
            status: '처리완료',
        },
    ],
};

export function MemberDetailModal({member, onClose}) {
    const [activeTab, setActiveTab] = useState('info');

    const rentalHistory = mockRentalHistory[member.id] || [];
    const accidentHistory = mockAccidentHistory[member.id] || [];

    const getRentalStatusColor = (status) => {
        switch (status) {
            case '완료':
                return 'bg-green-100 text-green-700';
            case '진행중':
                return 'bg-blue-100 text-blue-700';
            case '취소':
                return 'bg-red-100 text-red-700';
        }
    };

    const getAccidentStatusColor = (status) => {
        switch (status) {
            case '처리완료':
                return 'bg-green-100 text-green-700';
            case '처리중':
                return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* 헤더 */}
                <div
                    className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <User className="w-8 h-8 text-blue-600"/>
                        </div>
                        <div>
                            <h2 className="text-gray-900">{member.name}</h2>
                            <p className="text-gray-500">{member.membershipType} 회원</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6"/>
                    </button>
                </div>

                {/* 탭 */}
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-6 py-3 transition-colors ${
                                activeTab === 'info'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            기본 정보
                        </button>
                        <button
                            onClick={() => setActiveTab('rental')}
                            className={`px-6 py-3 transition-colors ${
                                activeTab === 'rental'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            대여 이력 ({rentalHistory.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('accident')}
                            className={`px-6 py-3 transition-colors ${
                                activeTab === 'accident'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            사고 이력 ({accidentHistory.length})
                        </button>
                    </div>
                </div>

                {/* 컨텐츠 */}
                <div className="p-6">
                    {/* 기본 정보 탭 */}
                    {activeTab === 'info' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <User className="w-4 h-4"/>
                                        <span>이름</span>
                                    </div>
                                    <div className="text-gray-900">{member.name}</div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <Mail className="w-4 h-4"/>
                                        <span>이메일</span>
                                    </div>
                                    <div className="text-gray-900">{member.email}</div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <Phone className="w-4 h-4"/>
                                        <span>전화번호</span>
                                    </div>
                                    <div className="text-gray-900">{member.phone}</div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <Calendar className="w-4 h-4"/>
                                        <span>생년월일</span>
                                    </div>
                                    <div className="text-gray-900">{member.birthDate}</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <CreditCard className="w-4 h-4"/>
                                        <span>면허번호</span>
                                    </div>
                                    <div className="text-gray-900">{member.licenseNumber}</div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <Calendar className="w-4 h-4"/>
                                        <span>가입일</span>
                                    </div>
                                    <div className="text-gray-900">{member.joinDate}</div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <Car className="w-4 h-4"/>
                                        <span>총 대여 횟수</span>
                                    </div>
                                    <div className="text-gray-900">{member.rentalCount}회</div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <User className="w-4 h-4"/>
                                        <span>회원 상태</span>
                                    </div>
                                    <div className="text-gray-900">{member.status}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 대여 이력 탭 */}
                    {activeTab === 'rental' && (
                        <div>
                            {rentalHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {rentalHistory.map((rental) => (
                                        <div
                                            key={rental.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Car className="w-4 h-4 text-gray-500"/>
                                                        <span className="text-gray-900">{rental.vehicleModel}</span>
                                                        <span className="text-gray-500">({rental.licensePlate})</span>
                                                    </div>
                                                    <div className="text-gray-500 mt-1">
                                                        {rental.startDate} ~ {rental.endDate}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full ${getRentalStatusColor(
                                                        rental.status
                                                    )}`}
                                                >
                          {rental.status}
                        </span>
                                            </div>
                                            <div className="text-gray-900">
                                                대여 비용: ₩{rental.cost.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    대여 이력이 없습니다
                                </div>
                            )}
                        </div>
                    )}

                    {/* 사고 이력 탭 */}
                    {activeTab === 'accident' && (
                        <div>
                            {accidentHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {accidentHistory.map((accident) => (
                                        <div
                                            key={accident.id}
                                            className="border border-red-200 bg-red-50 rounded-lg p-4"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className="w-5 h-5 text-red-600"/>
                                                    <span className="text-gray-900">{accident.date}</span>
                                                </div>
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full ${getAccidentStatusColor(
                                                        accident.status
                                                    )}`}
                                                >
                          {accident.status}
                        </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-gray-600">차량: </span>
                                                    <span className="text-gray-900">
                            {accident.vehicleModel} ({accident.licensePlate})
                          </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">장소: </span>
                                                    <span className="text-gray-900">{accident.location}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">내용: </span>
                                                    <span className="text-gray-900">{accident.description}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">손해액: </span>
                                                    <span className="text-red-600">
                            ₩{accident.damageAmount.toLocaleString()}
                          </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    사고 이력이 없습니다
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
