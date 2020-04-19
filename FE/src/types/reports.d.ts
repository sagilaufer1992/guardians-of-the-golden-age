type FailReason = "declined" | "unreachable" | "address" | "other";
type ProgressStatus = "unassigned" | "notdone";

interface DeliveryReport {
    name: string;
    expected: number;
    actual: number;
    delivered: number;
    deliveryFailed: number;
    deliveryInProgress: number;
    deliveryFailReasons: Record<FailReason, number>;
    deliveryProgressStatuses: Record<ProgressStatus, number>;
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

interface DeliveryReportData {
    branchId: number;
    date: Date;
    name: string;
    total: number;
    delivered: number;
    deliveryFailed: number;
    pendingDelivery: number;
    deliveryFailReasons: ReasonsDictionary;
}