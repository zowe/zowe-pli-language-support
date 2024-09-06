/*
 * Copyright (c) 2024 IBA Group.
 *
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   IBA Group
 *   Zowe Community
 */

package org.zowe.pli.state

/**
 * Annotation for the restricted initialization methods.
 * Is used to make some methods private to the specific initialization purposes
 */
@RequiresOptIn(message = "This method is used for the initialization purposes and must not be used outside of the specific places")
@Retention(AnnotationRetention.BINARY)
annotation class InitializationOnly
