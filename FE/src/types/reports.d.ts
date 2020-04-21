interface FutureReport extends Branch {
    amount: number;
}

type FailReason = "declined" | "unreachable" | "address" | "other";

interface DeliveryReport {
    name: string;
    expected: number;
    actual: number;
    delivered: number;
    deliveryFailed: number;
    deliveryInProgress: number;
    deliveryFailReasons: Record<FailReason, number>;
}

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

interface DeliveryReportData {
    branchId: number;
    date: Date;
    total: number;
    delivered: number;
    deliveryFailed: number;
    deliveryFailReasons: Record<FailReason, number>;
}