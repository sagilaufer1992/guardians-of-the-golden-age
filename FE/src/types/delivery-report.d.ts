interface DeliveryReport {
    name: string;
    total: number;
    delivered: number;
    deliveryFailed: number;
    pendingDelivery: number;
    deliveryFailReasons: ReasonsDictionary;
}

type ReasonsDictionary = { [key: string]: number };