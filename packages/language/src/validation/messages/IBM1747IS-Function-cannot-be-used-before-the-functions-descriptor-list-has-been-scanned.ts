import { AstUtils, ValidationAcceptor } from "langium";
import { isDeclaredVariable, isEntryAttribute, MemberCall } from "../../generated/ast";

/**
 * This validation addresses functions, not procedures.
 * TODO check if also procedures are affected
 * @see https://www.ibm.com/docs/en/epfz/6.1?topic=codes-compiler-severe-messages-1500-2399#ibm1747i__msgId__1
 */
export function IBM1747IS_Function_cannot_be_used_before_the_functions_descriptor_list_has_been_scanned(call: MemberCall, accept: ValidationAcceptor): void {
    //member call points to variable declaration...
    if (!isDeclaredVariable(call.element.ref.ref)) {
        return;
    }
    //...which actually is a function declaration...
    const declaration = call.element.ref.ref.$container;
    if (!declaration.attributes.some(a => isEntryAttribute(a) && a.returns)) {
        return;
    }
    //... where both function call and function declaration are in the same file...
    const callDocument = AstUtils.getDocument(call);
    const declarationDocument = AstUtils.getDocument(declaration);
    if (callDocument !== declarationDocument) {
        return;
    }
    //...and the declaration happens after the call
    const callOffset = call.$cstNode!.offset;
    const declarationOffset = declaration.$cstNode!.offset;
    if (callOffset > declarationOffset) {
        return;
    }
    //throw error
    accept('error', "Function cannot be used before the function's descriptor list has been scanned.", {
        code: "IBM1747IS",
        node: call,
        property: "element"
    });
}