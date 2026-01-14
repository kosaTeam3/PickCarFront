import {useState} from 'react';
import {AlertTriangle, Bell, Calendar, ChevronDown, ChevronUp, X} from 'lucide-react';

const mockNotifications = [
    {
        id: '1',
        type: 'maintenance',
        title: '정비 필요',
        message: '기아 모닝 (789다1234) - 주행거리 30,000km 초과, 정기 점검이 필요합니다.',
        date: '2025-01-02',
        priority: 'high',
    },
    {
        id: '2',
        type: 'inspection',
        title: '차량 검사 만료 임박',
        message: '현대 아반떼 (123가4567) - 검사일이 45일 남았습니다.',
        date: '2025-01-28',
        priority: 'medium',
    },
    {
        id: '3',
        type: 'insurance',
        title: '보험 만료 예정',
        message: 'DB손해보험 - 기아 모닝 차량 보험이 6개월 내 만료됩니다.',
        date: '2025-04-15',
        priority: 'medium',
    },
    {
        id: '4',
        type: 'maintenance',
        title: '정비 예정',
        message: '기아 스포티지 (456나7890) - 타이어 교체 정비가 예정되어 있습니다.',
        date: '2025-01-05',
        priority: 'low',
    },
];

export function NotificationPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            case 'low':
                return 'bg-blue-100 text-blue-700';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'maintenance':
                return <AlertTriangle className="w-5 h-5"/>;
            case 'inspection':
                return <Calendar className="w-5 h-5"/>;
            case 'insurance':
                return <Bell className="w-5 h-5"/>;
        }
    };

    const handleDismiss = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const highPriorityCount = notifications.filter(n => n.priority === 'high').length;

    return (
        <div className="fixed bottom-0 left-64 right-0 z-40">
            {/* 알림 패널 헤더 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Bell className="w-5 h-5 text-gray-600"/>
                        {highPriorityCount > 0 && (
                            <span
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {highPriorityCount}
              </span>
                        )}
                    </div>
                    <span className="text-gray-700">알림</span>
                    <span className="text-gray-500">({notifications.length})</span>
                </div>
                {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-gray-400"/>
                ) : (
                    <ChevronUp className="w-5 h-5 text-gray-400"/>
                )}
            </button>

            {/* 알림 목록 */}
            {isOpen && (
                <div className="bg-white border-t border-gray-200 max-h-96 overflow-y-auto shadow-lg">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                                            {getTypeIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <div className="text-gray-900 mb-1">
                                                        {notification.title}
                                                    </div>
                                                    <p className="text-gray-600 mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="text-gray-500">
                                                        {notification.date}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDismiss(notification.id)}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                                >
                                                    <X className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            새로운 알림이 없습니다
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
