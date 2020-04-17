interface DeliveryReport {
    name: string;
    total: number;
    delivered: number;
    deliveryFailed: number;
    pendingDelivery: number;
    deliveryFailReasons: ReasonsDictionary;
}

type ReasonsDictionary = { [key: string]: number };

interface FaultsReport {
    total: number;
    open: number;
    reasons: FaultReasonReport[];
}

interface FaultReasonReport {
    category: FaultCategory;
    open: number;
    closed: number;
}