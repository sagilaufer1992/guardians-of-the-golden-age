interface FutureReport extends Branch {
    amount: number;
}

type DeliveryType = "food_hot" | "food_cold" | "mask" | "flower" | string;

type FailReason = "declined" | "unreachable" | "address" | "other";

interface DeliveryInfo {
    expected: number;
    actual: number;
    delivered: number;
    deliveryFailed: number;
    deliveryInProgress: number;
    deliveryFailReasons: Record<"declined" | "unreachable" | "address" | "other", number>;
  }

  interface DeliveryReport {
    name: string;
    address?: string;
    hasExternalInfo?: boolean; // true if information from other team is included
    deliveries: Record<DeliveryType, DeliveryInfo>;
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
    deliveries: Record<DeliveryType, DeliveryInfoData>;
}

interface DeliveryInfoData {
    total: number;
    delivered: number;
    deliveryFailed: number;
    deliveryFailReasons: Record<FailReason, number> | null;
}