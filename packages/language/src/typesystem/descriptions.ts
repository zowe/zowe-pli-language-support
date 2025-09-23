/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=attributes-nondata#ndatts__vari */

/** Makes T partial except for properties P, they are required */
export type PartialPartial<T, P extends keyof T> = Partial<Omit<T, P>> & Required<Omit<T, Exclude<keyof T, P>>>;

interface BaseTypeDescriptionProps {
    alignment: Alignment;
    scope: Scope;
    storage: StorageClass;
    volatility: Volatility;
    position?: StoragePosition;
    assignability: Assignability;
    connection: StorageConnection;
    variable?: boolean;
}
interface BaseTypeDescription extends BaseTypeDescriptionProps {
    type: string;
}

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=alignment-aligned-unaligned-attributes */
export type Alignment = { type: 'aligned', alignment: 1 | 2 | 4 | 8 } | { type: 'unaligned' };
/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=declarations-internal-external-attributes */
export type Scope = { type: 'internal' } | { type: 'external', environment: string };
/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-storage-classes-allocation-deallocation */
export type StorageClass = 'automatic' | 'static' | 'based' | 'controlled';
/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-connected-nonconnected-attributes */
export type StorageConnection = 'connected' | 'nonconnected';

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-assignable-nonassignable-attributes */
export type Assignability = 'assignable' | 'nonassignable';
/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-defined-position-attributes */
export type StoragePosition = { //DEFINED variable [POSITION (position)]
    variable: null;//TODO set to "Variable" AstNode
    position: null;//TODO set to "Expression" AstNode
}

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-normal-abnormal-attributes */
export type Volatility = 'normal' | 'abnormal';

/* TODO for storage attributes:
Parameter:
PARAMETER
[CONTROLLED]

@see https://www.ibm.com/docs/en/epfz/6.1?topic=control-initial-attribute
[INITIAL
[CALL]]
*/

function createBaseTypeDescription(type: TypeDescriptionType, { alignment, connection, scope, storage, volatility, position, assignability, variable }: Partial<BaseTypeDescriptionProps>): BaseTypeDescriptionProps {
    if (!alignment) {
        if (type === PictureType || type === StringType) {
            alignment = { type: 'unaligned' };
        } else {
            alignment = { type: 'aligned', alignment: 1 }; //TODO no documentation of default value for alignment
        }
    }

    if (variable !== undefined) {
        if (type !== EntryType && type !== FileType && type !== LabelType) {
            variable = undefined;
        }
    }

    assignability ??= 'assignable';
    connection ??= 'nonconnected';
    scope ??= { type: 'internal' };
    volatility ??= 'normal';

    if (!storage) {
        if (scope?.type === 'internal') {
            storage = 'automatic';
        } else {
            storage = 'static';
        }
    }

    return {
        alignment,
        assignability,
        connection,
        position,
        scope,
        storage,
        variable,
        volatility,
    };
}

//--- Area ---
const AreaType = 'area';
type AreaType = typeof AreaType;

interface AreaTypeDescriptionProps extends BaseTypeDescriptionProps {
    size: number;
}


interface AreaTypeDescription extends BaseTypeDescription, AreaTypeDescriptionProps {
    type: AreaType;
}

/**
 * @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-area-data-attribute
 */
function createAreaTypeDescription({ size = 1000, ...base }: Partial<AreaTypeDescriptionProps>): AreaTypeDescription {
    return {
        type: AreaType,
        ...createBaseTypeDescription(AreaType, base),
        size
    };
}

function isAreaTypeDescription(description: BaseTypeDescription): description is AreaTypeDescription {
    return description.type === AreaType;
}

//--- Arithmetic ---
const ArithmeticType = 'arithmetic';
type ArithmeticType = typeof ArithmeticType;

export type NumberMode = 'real' | 'complex';
export type Base = 'binary' | 'decimal';
export type ScaleMode = 'fixed' | 'float';
export type Scale = {
    /** Formally known as `p`. */
    totalDigitsCount: number;
} & ({
    mode: 'float';
} | {
    mode: 'fixed';
    /**
     * Formally known as `q`.
     * Attention: fractionalDigitsCount <= totalDigitsCount
     */
    fractionalDigitsCount: number;
});
export type Sign = 'signed' | 'unsigned';

interface ArithmeticTypeDescriptionProps {
    mode: NumberMode;
    scale: Scale;
    base: Base;
    sign: Sign;
}


interface ArithmeticTypeDescription extends BaseTypeDescription, ArithmeticTypeDescriptionProps {
    type: ArithmeticType;
}

//@see https://www.microfocus.com/documentation/openpli/80/pulang.htm
//Data  Type   	Max Precision   	Default Precision
//Fixed Binary	31	                15*
//Fixed Decimal	18	                5
//Float Binary	52	                23
//Float Decimal	16	                6
//TODO * The -Iongint Compiler option changes the default precision of fixed binary from 15 to 31.
export const DefaultPrecisions: Record<ScaleMode, Record<Base, number>> = {
    float: {
        binary: 23,
        decimal: 6
    },
    fixed: {
        binary: 15,
        decimal: 5
    }
};

export const MaximumPrecisions: Record<ScaleMode, Record<Base, number>> = {
    float: {
        binary: 52,
        decimal: 16
    },
    fixed: {
        binary: 31,
        decimal: 18
    }
};

function createArithmeticTypeDescription({ mode = 'real', scale, base: unit = 'decimal', sign = 'signed', ...base }: Partial<ArithmeticTypeDescriptionProps>): ArithmeticTypeDescription {
    scale ??= {
        mode: 'float',
        totalDigitsCount: DefaultPrecisions['float'][unit],
    };
    return {
        type: ArithmeticType,
        ...createBaseTypeDescription(ArithmeticType, base),
        mode,
        scale,
        base: unit,
        sign
    };
}

function isArithmeticTypeDescription(description: BaseTypeDescription): description is ArithmeticTypeDescription {
    return description.type === ArithmeticType;
}

//--- File ---
const FileType = "file";
type FileType = typeof FileType;

interface FileTypeDescriptionProps extends BaseTypeDescriptionProps {

}

interface FileTypeDescription extends BaseTypeDescription, FileTypeDescriptionProps {
    type: FileType;
}

function createFileTypeDescription({ ...base }: Partial<FileTypeDescriptionProps>): FileTypeDescription {
    return {
        type: FileType,
        ...createBaseTypeDescription(FileType, base)
    };
}

function isFileTypeDescription(description: BaseTypeDescription): description is FileTypeDescription {
    return description.type === FileType;
}

//--- Format ---
const FormatType = "format";
type FormatType = typeof FormatType;

interface FormatTypeDescriptionProps extends BaseTypeDescriptionProps {

}

interface FormatTypeDescription extends BaseTypeDescription, FormatTypeDescriptionProps {
    type: FormatType;
}

function createFormatTypeDescription({ ...base }: Partial<FormatTypeDescriptionProps>): FormatTypeDescription {
    return {
        type: FormatType,
        ...createBaseTypeDescription(FormatType, base),
    };
}

function isFormatTypeDescription(description: BaseTypeDescription): description is FormatTypeDescription {
    return description.type === FormatType;
}

//--- Label ---
const LabelType = "label";
type LabelType = typeof LabelType;

interface LabelTypeDescriptionProps extends BaseTypeDescriptionProps {

}


interface LabelTypeDescription extends BaseTypeDescription, LabelTypeDescriptionProps {
    type: LabelType;
}

function createLabelTypeDescription({ ...base }: Partial<LabelTypeDescriptionProps>): LabelTypeDescription {
    return {
        type: LabelType,
        ...createBaseTypeDescription(LabelType, base),
    };
}

function isLabelTypeDescription(description: BaseTypeDescription): description is LabelTypeDescription {
    return description.type === LabelType;
}

//--- Locator ---
const LocatorType = "locator";
type LocatorType = typeof LocatorType;

export type LocatorKind = { type: 'pointer', size: 32 | 64 }
    | { type: 'handle', size: 32 | 64, structTypeName: string }
    | { type: 'offset', areaVariable: null };

interface LocatorTypeDescriptionProps extends BaseTypeDescriptionProps {
    kind: LocatorKind;
}

interface LocatorTypeDescription extends BaseTypeDescription, LocatorTypeDescriptionProps {
    type: LocatorType;
}

function createLocatorTypeDescription({ kind, ...base }: PartialPartial<LocatorTypeDescriptionProps, 'kind'>): LocatorTypeDescription {
    return {
        type: LocatorType,
        ...createBaseTypeDescription(LocatorType, base),
        kind
    };
}

function isLocatorTypeDescription(description: BaseTypeDescription): description is LocatorTypeDescription {
    return description.type === LocatorType;
}

//--- Entry ---
const EntryType = "entry";
type EntryType = typeof EntryType;

interface EntryTypeDescriptionProps extends BaseTypeDescriptionProps {
}


interface EntryTypeDescription extends BaseTypeDescription, EntryTypeDescriptionProps {
    type: EntryType;
}

function createEntryTypeDescription({ ...base }: Partial<EntryTypeDescriptionProps>): EntryTypeDescription {
    return {
        type: EntryType,
        ...createBaseTypeDescription(EntryType, base),
    };
}

function isEntryTypeDescription(description: BaseTypeDescription): description is EntryTypeDescription {
    return description.type === EntryType;
}

//--- Ordinal ---
const OrdinalType = "ordinal";
type OrdinalType = typeof OrdinalType;

interface OrdinalTypeDescriptionProps extends BaseTypeDescriptionProps {
    names: string[];
}


interface OrdinalTypeDescription extends BaseTypeDescription, OrdinalTypeDescriptionProps {
    type: OrdinalType;
}

function createOrdinalTypeDescription({ names, ...base }: PartialPartial<OrdinalTypeDescriptionProps, 'names'>): OrdinalTypeDescription {
    return {
        type: OrdinalType,
        ...createBaseTypeDescription(OrdinalType, base),
        names
    };
}

function isOrdinalTypeDescription(description: BaseTypeDescription): description is OrdinalTypeDescription {
    return description.type === OrdinalType;
}

//--- Picture ---
const PictureType = "picture";
type PictureType = typeof PictureType;

export type PictureWideness = 'picture' | 'widepic';

interface PictureTypeDescriptionProps extends BaseTypeDescriptionProps {
    kind: PictureWideness;
    domain: NumberMode;
}


interface PictureTypeDescription extends BaseTypeDescription, PictureTypeDescriptionProps {
    type: PictureType;
}

function createPictureTypeDescription({ kind, domain = 'real', ...base }: PartialPartial<PictureTypeDescriptionProps, 'kind'>): PictureTypeDescription {
    return {
        type: PictureType,
        ...createBaseTypeDescription(PictureType, base),
        kind,
        domain
    };
}

function isPictureTypeDescription(description: BaseTypeDescription): description is PictureTypeDescription {
    return description.type === PictureType;
}

//--- String ---
const StringType = "string";
type StringType = typeof StringType;

export type StringKind = 'bit' | 'character' | 'graphic' | 'uchar' | 'widechar';
export type StringFormat = 'varying' | 'varying4' | 'varyingz' | 'nonvarying';

interface StringTypeDescriptionProps extends BaseTypeDescriptionProps {
    kind: StringKind;
    format: StringFormat;
    length: number;
}

interface StringTypeDescription extends BaseTypeDescription, StringTypeDescriptionProps {
    type: StringType;
}

function createStringTypeDescription({ kind, format, length, ...base }: PartialPartial<StringTypeDescriptionProps, 'length' | 'kind' | 'format'>): StringTypeDescription {
    return {
        type: StringType,
        ...createBaseTypeDescription(StringType, base),
        kind,
        length,
        format
    };
}

function isStringTypeDescription(description: BaseTypeDescription): description is StringTypeDescription {
    return description.type === StringType;
}

//--- Task ---
const TaskType = "task";
type TaskType = typeof TaskType;

interface TaskTypeDescriptionProps extends BaseTypeDescriptionProps {

}

interface TaskTypeDescription extends BaseTypeDescription, TaskTypeDescriptionProps {
    type: TaskType;
}

function createTaskTypeDescription({ ...base }: Partial<TaskTypeDescriptionProps>): TaskTypeDescription {
    return {
        type: TaskType,
        ...createBaseTypeDescription(TaskType, base),
    };
}

function isTaskTypeDescription(description: BaseTypeDescription): description is TaskTypeDescription {
    return description.type === TaskType;
}

//--- all together ---
type TypeDescription =
    | AreaTypeDescription
    | ArithmeticTypeDescription
    | FileTypeDescription
    | FormatTypeDescription
    | LabelTypeDescription
    | LocatorTypeDescription
    | EntryTypeDescription
    | OrdinalTypeDescription
    | PictureTypeDescription
    | StringTypeDescription
    | TaskTypeDescription
    ;

type TypeDescriptionType = TypeDescription['type'];

export namespace TypesDescriptions {
    export type Any = TypeDescription;

    export const Area = createAreaTypeDescription;
    export type Area = AreaTypeDescription;
    export const isArea = isAreaTypeDescription;

    export const Arithmetic = createArithmeticTypeDescription;
    export type Arithmetic = ArithmeticTypeDescription;
    export const isArithmetic = isArithmeticTypeDescription;

    export const File = createFileTypeDescription;
    export type File = FileTypeDescription;
    export const isFile = isFileTypeDescription;

    export const Format = createFormatTypeDescription;
    export type Format = FormatTypeDescription;
    export const isFormat = isFormatTypeDescription;

    export const Label = createLabelTypeDescription;
    export type Label = LabelTypeDescription;
    export const isLabel = isLabelTypeDescription;

    export const Locator = createLocatorTypeDescription;
    export type Locator = LocatorTypeDescription;
    export const isLocator = isLocatorTypeDescription;

    export const Entry = createEntryTypeDescription;
    export type Entry = EntryTypeDescription;
    export const isEntry = isEntryTypeDescription;

    export const Ordinal = createOrdinalTypeDescription;
    export type Ordinal = OrdinalTypeDescription;
    export const isOrdinal = isOrdinalTypeDescription;

    export const Picture = createPictureTypeDescription;
    export type Picture = PictureTypeDescription;
    export const isPicture = isPictureTypeDescription;

    export const String = createStringTypeDescription;
    export type String = StringTypeDescription;
    export const isString = isStringTypeDescription;

    export const Task = createTaskTypeDescription;
    export type Task = TaskTypeDescription;
    export const isTask = isTaskTypeDescription;

    /** fake type */
    export const Boolean = createStringTypeDescription({
        kind: 'bit',
        format: "nonvarying",
        length: 1
    });
    export const isBoolean = (type: TypeDescription): type is StringTypeDescription => isString(type) && type.kind === 'bit' && type.length === 1;
}