import { TypeDescriptions } from "./descriptions";

export function isAssignableTo(source: TypeDescriptions.Any, target: TypeDescriptions.Any): boolean {
    if(TypeDescriptions.isUnknown(source) || TypeDescriptions.isUnknown(target)) {
        return TypeDescriptions.isUnknown(source);
    }
    if(TypeDescriptions.isArithmetic(source) && TypeDescriptions.isArithmetic(target)) {
        return true;
    }
    //TODO implement assignability check
    return false;
}