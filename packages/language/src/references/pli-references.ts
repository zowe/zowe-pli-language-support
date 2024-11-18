/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import { AstNode, DefaultReferences, FindReferencesOptions, ReferenceDescription, Stream } from "langium";
import { isLabelPrefix, isProcedureStatement } from "../generated/ast";

export class PliReferences extends DefaultReferences {
    override findReferences(targetNode: AstNode, options: FindReferencesOptions): Stream<ReferenceDescription> {
        if (isLabelPrefix(targetNode) && isProcedureStatement(targetNode.$container!)) {
            return this.findReferences(targetNode.$container!, options);
        } else {
            return super.findReferences(targetNode, options);
        }
    }
}