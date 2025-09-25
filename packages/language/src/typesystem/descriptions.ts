import * as ast from "../syntax-tree/ast";
import { assertUnreachable } from "../utils/common";

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=attributes-nondata#ndatts__vari */

/** Makes T partial except for properties P, they are required */
export type PartialPartial<T, P extends keyof T> = Partial<Omit<T, P>> & Required<Omit<T, Exclude<keyof T, P>>>;

export enum DataType {
    Area,
    Arithmetic,
    File,
    Format,
    Label,
    Locator,
    Entry,
    Ordinal,
    Picture,
    String,
    Task,
}

export const DataTypes: DataType[] = [
    DataType.Area,
    DataType.Arithmetic,
    DataType.File,
    DataType.Format,
    DataType.Label,
    DataType.Locator,
    DataType.Entry,
    DataType.Ordinal,
    DataType.Picture,
    DataType.String,
    DataType.Task,
];

export enum AttributeKind {
    Endianess,
    DataType,
    Alignment,
    Scope,
    Storage,
    Volatility,
    Position,
    Assignability,
    Connection,
    Variable,
    Scale,
    Base,
    Sign,
    NumberMode,
    AreaSize,
    LocatorKind,
    OrdinalNames,
    PictureKind,
    StringKind,
    StringFormat,
    StringLength,
}

export const AttributeKinds: AttributeKind[] = [
    AttributeKind.Alignment,
    AttributeKind.Scope,
    AttributeKind.Storage,
    AttributeKind.Volatility,
    AttributeKind.Position,
    AttributeKind.Assignability,
    AttributeKind.Connection,
    AttributeKind.Variable,
    AttributeKind.Scale,
    AttributeKind.Base,
    AttributeKind.Sign,
    AttributeKind.NumberMode,
    AttributeKind.AreaSize,
    AttributeKind.LocatorKind,
    AttributeKind.OrdinalNames,
    AttributeKind.PictureKind,
    AttributeKind.StringKind,
    AttributeKind.StringFormat,
    AttributeKind.StringLength,
];

export type AttributeTypes = {
    [AttributeKind.Endianess]: Endianess;
    [AttributeKind.DataType]: DataType;
    [AttributeKind.Alignment]: Alignment;
    [AttributeKind.Scope]: Scope;
    [AttributeKind.Storage]: StorageClass;
    [AttributeKind.Volatility]: Volatility;
    [AttributeKind.Position]: StoragePosition;
    [AttributeKind.Assignability]: Assignability;
    [AttributeKind.Connection]: StorageConnection;
    [AttributeKind.Variable]: boolean;
    [AttributeKind.Scale]: Scale;
    [AttributeKind.Base]: Base;
    [AttributeKind.Sign]: Sign;
    [AttributeKind.NumberMode]: NumberMode;
    [AttributeKind.AreaSize]: number;
    [AttributeKind.LocatorKind]: LocatorKind;
    [AttributeKind.OrdinalNames]: string[];
    [AttributeKind.PictureKind]: PictureWideness;
    [AttributeKind.StringKind]: StringKind;
    [AttributeKind.StringFormat]: StringFormat;
    [AttributeKind.StringLength]: number;
};

export const CommonAttributeKinds: AttributeKind[] = [
    AttributeKind.DataType,
    AttributeKind.Alignment,
    AttributeKind.Scope,
    AttributeKind.Storage,
    AttributeKind.Volatility,
    AttributeKind.Position,
    AttributeKind.Assignability,
    AttributeKind.Connection,
    AttributeKind.Variable,
];

export const AttributeKindsByDataType: Record<DataType, AttributeKind[]> = {
    [DataType.Area]: [...CommonAttributeKinds, AttributeKind.AreaSize, AttributeKind.Endianess],
    [DataType.Arithmetic]: [...CommonAttributeKinds, AttributeKind.Scale, AttributeKind.Base, AttributeKind.Sign, AttributeKind.NumberMode, AttributeKind.Endianess],
    [DataType.File]: [...CommonAttributeKinds],
    [DataType.Format]: [...CommonAttributeKinds],
    [DataType.Label]: [...CommonAttributeKinds],
    [DataType.Locator]: [...CommonAttributeKinds, AttributeKind.LocatorKind],
    [DataType.Entry]: [...CommonAttributeKinds],
    [DataType.Ordinal]: [...CommonAttributeKinds, AttributeKind.OrdinalNames],
    [DataType.Picture]: [...CommonAttributeKinds, AttributeKind.PictureKind, AttributeKind.NumberMode],
    [DataType.String]: [...CommonAttributeKinds, AttributeKind.StringKind, AttributeKind.StringFormat, AttributeKind.StringLength],
    [DataType.Task]: [...CommonAttributeKinds],
};

export type AttributeWitnesses = {
    [K in keyof AttributeTypes]: {
        value: AttributeTypes[K];
        witness: ast.DeclarationAttribute;
        image: string;
    } | null;
};

export const DataTypesByAttributeKind = Object.entries(AttributeKindsByDataType).reduce((acc, [type, properties]) => {
    for (const property of properties) {
        (acc[property] ??= []).push(Number(type) as DataType);
    }
    return acc;
}, {} as Record<AttributeKind, DataType[]>);

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
    type: DataType;
}

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=alignment-aligned-unaligned-attributes */
export enum AlignmentType {
    Aligned,
    Unaligned,
}
export type Alignment = { type: AlignmentType.Aligned, alignment: 1 | 2 | 4 | 8 } | { type: AlignmentType.Unaligned };
/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=declarations-internal-external-attributes */
export enum ScopeType {
    Internal,
    External,
}
export type Scope = { type: ScopeType.Internal } | { type: ScopeType.External, environment: string };
/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-storage-classes-allocation-deallocation */
export enum StorageClass {
    Automatic,
    Static,
    Based,
    Controlled,
}
/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-connected-nonconnected-attributes */
export enum StorageConnection {
    Connected,
    Nonconnected,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-assignable-nonassignable-attributes */
export enum Assignability {
    Assignable,
    Nonassignable,
}
/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-defined-position-attributes */
export type StoragePosition = { //DEFINED variable [POSITION (position)]
    variable: null;//TODO set to "Variable" AstNode
    position: null;//TODO set to "Expression" AstNode
}

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-normal-abnormal-attributes */
export enum Volatility {
    Normal,
    Abnormal,
}

/* TODO for storage attributes:
Parameter:
PARAMETER
[CONTROLLED]

@see https://www.ibm.com/docs/en/epfz/6.1?topic=control-initial-attribute
[INITIAL
[CALL]]
*/

function createBaseTypeDescription(type: TypesDescriptions.TypeDescriptionType, { alignment, connection, scope, storage, volatility, position, assignability, variable }: Partial<BaseTypeDescriptionProps>): BaseTypeDescriptionProps {
    if (!alignment) {
        if (type === PictureType || type === StringType) {
            alignment = { type: AlignmentType.Unaligned };
        } else {
            alignment = { type: AlignmentType.Aligned, alignment: 1 }; //TODO no documentation of default value for alignment
        }
    }

    if (variable !== undefined) {
        if (type !== EntryType && type !== FileType && type !== LabelType) {
            variable = undefined;
        }
    }

    assignability ??= Assignability.Assignable;
    connection ??= StorageConnection.Nonconnected;
    scope ??= { type: ScopeType.Internal };
    volatility ??= Volatility.Normal;

    if (!storage) {
        if (scope?.type === ScopeType.Internal) {
            storage = StorageClass.Automatic;
        } else {
            storage = StorageClass.Static;
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
const AreaType = DataType.Area;
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
const ArithmeticType = DataType.Arithmetic;
type ArithmeticType = typeof ArithmeticType;

export enum Endianess {
    Big,
    Little
}
export enum NumberMode {
    Real,
    Complex
}
export enum Base {
    Binary,
    Decimal
}
export enum ScaleMode {
    Fixed,
    Float
}
export type Scale = {
    /** Formally known as `p`. */
    totalDigitsCount: number;
} & ({
    mode: ScaleMode.Float;
} | {
    mode: ScaleMode.Fixed;
    /**
     * Formally known as `q`.
     * Attention: fractionalDigitsCount <= totalDigitsCount
     */
    fractionalDigitsCount: number;
});
export enum Sign {
    Signed,
    Unsigned,
}

interface ArithmeticTypeDescriptionProps {
    mode: NumberMode;
    scale: Scale;
    base: Base;
    sign: Sign;
    endianness: Endianess;
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
    [ScaleMode.Float]: {
        [Base.Binary]: 23,
        [Base.Decimal]: 6
    },
    [ScaleMode.Fixed]: {
        [Base.Binary]: 15,
        [Base.Decimal]: 5
    }
};

export const MaximumPrecisions: Record<ScaleMode, Record<Base, number>> = {
    [ScaleMode.Float]: {
        [Base.Binary]: 52,
        [Base.Decimal]: 16
    },
    [ScaleMode.Fixed]: {
        [Base.Binary]: 31,
        [Base.Decimal]: 18
    }
};

//TODO endianness default value depends on platform (BIGENDIAN except on Intel where the default is LITTLEENDIAN)
function createArithmeticTypeDescription({ mode = NumberMode.Real, scale, base: unit = Base.Decimal, sign = Sign.Signed, endianness = Endianess.Big, ...base }: Partial<ArithmeticTypeDescriptionProps>): ArithmeticTypeDescription {
    scale ??= {
        mode: ScaleMode.Float,
        totalDigitsCount: DefaultPrecisions[ScaleMode.Float][unit],
    };
    return {
        type: ArithmeticType,
        ...createBaseTypeDescription(ArithmeticType, base),
        mode,
        scale,
        base: unit,
        sign,
        endianness
    };
}

function isArithmeticTypeDescription(description: BaseTypeDescription): description is ArithmeticTypeDescription {
    return description.type === ArithmeticType;
}

//--- File ---
const FileType = DataType.File;
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
const FormatType = DataType.Format;
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
const LabelType = DataType.Label;
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
const LocatorType = DataType.Locator;
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
const EntryType = DataType.Entry;
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
const OrdinalType = DataType.Ordinal;
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
const PictureType = DataType.Picture;
type PictureType = typeof PictureType;

export type PictureWideness = 'picture' | 'widepic';

interface PictureTypeDescriptionProps extends BaseTypeDescriptionProps {
    kind: PictureWideness;
    domain: NumberMode;
}


interface PictureTypeDescription extends BaseTypeDescription, PictureTypeDescriptionProps {
    type: PictureType;
}

function createPictureTypeDescription({ kind, domain = NumberMode.Real, ...base }: PartialPartial<PictureTypeDescriptionProps, 'kind'>): PictureTypeDescription {
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
const StringType = DataType.String;
type StringType = typeof StringType;

export enum StringKind {
    Bit,
    Character,
    Graphic,
    UChar,
    WideChar
}

export enum StringFormat {
    Varying,
    Varying4,
    VaryingZ,
    NonVarying
}

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
const TaskType = DataType.Task;
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

export namespace TypesDescriptions {
    export type Any = Area | Arithmetic | File | Format | Label | Locator | Entry | Ordinal | Picture | String | Task;
    export type TypeDescriptionType = Any['type'];

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
        kind: StringKind.Bit,
        format: StringFormat.NonVarying,
        length: 1
    });
    export const isBoolean = (type: TypesDescriptions.Any): type is StringTypeDescription => isString(type) && type.kind === StringKind.Bit && type.length === 1;

    export function create(type: DataType, attributes: AttributeWitnesses): Any {
        const common = {
            alignment: attributes[AttributeKind.Alignment]?.value,
            scope: attributes[AttributeKind.Scope]?.value,
            storage: attributes[AttributeKind.Storage]?.value,
            volatility: attributes[AttributeKind.Volatility]?.value,
            position: attributes[AttributeKind.Position]?.value,
            assignability: attributes[AttributeKind.Assignability]?.value,
            connection: attributes[AttributeKind.Connection]?.value,
            variable: attributes[AttributeKind.Variable]?.value,
        };
        switch (type) {
            case DataType.Area:
                return TypesDescriptions.Area({
                    ...common,
                    size: attributes[AttributeKind.AreaSize]?.value,
                });
            case DataType.Arithmetic:
                return TypesDescriptions.Arithmetic({
                    ...common,
                    scale: attributes[AttributeKind.Scale]?.value,
                    base: attributes[AttributeKind.Base]?.value,
                    sign: attributes[AttributeKind.Sign]?.value,
                    mode: attributes[AttributeKind.NumberMode]?.value,
                    endianness: attributes[AttributeKind.Endianess]?.value,
                });
            case DataType.File:
                return TypesDescriptions.File(common);
            case DataType.Format:
                return TypesDescriptions.Format(common);
            case DataType.Label:
                return TypesDescriptions.Label(common);
            case DataType.Locator:
                return TypesDescriptions.Locator({
                    ...common,
                    kind: attributes[AttributeKind.LocatorKind]!.value,
                });
            case DataType.Entry:
                return TypesDescriptions.Entry(common);
            case DataType.Ordinal:
                return TypesDescriptions.Ordinal({
                    ...common,
                    names: attributes[AttributeKind.OrdinalNames]!.value,
                });
            case DataType.Picture:
                return TypesDescriptions.Picture({
                    ...common,
                    kind: attributes[AttributeKind.PictureKind]!.value,
                    domain: attributes[AttributeKind.NumberMode]?.value,
                });
            case DataType.String:
                return TypesDescriptions.String({
                    ...common,
                    kind: attributes[AttributeKind.StringKind]!.value,
                    format: attributes[AttributeKind.StringFormat]!.value,
                    length: attributes[AttributeKind.StringLength]!.value,
                });
            case DataType.Task:
                return TypesDescriptions.Task(common);
            default:
                assertUnreachable(type);
        }
    }
}