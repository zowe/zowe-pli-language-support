export function normalizeIdentifier<T extends string>(id: T): Uppercase<T> {
    return id.toUpperCase() as Uppercase<T>;
}

export function compareIdentifiers<T extends string>(lhs: T, rhs: T) {
    return normalizeIdentifier(lhs) === normalizeIdentifier(rhs);
}