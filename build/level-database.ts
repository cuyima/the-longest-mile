import { ClassicLevel, type DatabaseOptions } from "classic-level";
import type { AbstractSublevel } from "abstract-level";
import moduleJSON from "../static/module.json" assert { type: "json" };

const DB_KEYS = ["actors", "items", "journal", "macros", "tables"] as const;
const EMBEDDED_KEYS = ["items", "pages", "results"] as const;

class LevelDatabase extends ClassicLevel<string, DBEntry> {
    #dbkey: DBKey;
    #embeddedKey: EmbeddedKey | null;

    #documentDb: Sublevel<DBEntry>;
    #foldersDb: Sublevel<DBFolder>;
    #embeddedDb: Sublevel<EmbeddedEntry> | null = null;

    constructor(location: string, options: LevelDatabaseOptions<DBEntry>) {
        const dbOptions = options.dbOptions ?? { keyEncoding: "utf8", valueEncoding: "json" };
        super(location, dbOptions);

        const { dbKey, embeddedKey } = this.#getDBKeys(options.packName);

        this.#dbkey = dbKey;
        this.#embeddedKey = embeddedKey;

        this.#documentDb = this.sublevel(dbKey, dbOptions);
        this.#foldersDb = this.sublevel("folders", dbOptions) as unknown as Sublevel<DBFolder>;
        if (this.#embeddedKey) {
            this.#embeddedDb = this.sublevel(
                `${this.#dbkey}.${this.#embeddedKey}`,
                dbOptions
            ) as unknown as Sublevel<any>;
        }
    }
    #getDBKeys(packName: string): { dbKey: DBKey; embeddedKey: EmbeddedKey | null } {
        const metadata = moduleJSON.packs.find((p) => p.path.endsWith(packName));
        if (!metadata) {
            throw Error(
                `Error generating dbKeys: Compendium ${packName} has no metadata in the local system.json file.`
            );
        }

        const dbKey = ((): DBKey => {
            switch (metadata.type) {
                case "JournalEntry":
                    return "journal";
                case "RollTable":
                    return "tables";
                default: {
                    const key = `${metadata.type.toLowerCase()}s`;
                    if (tupleHasValue(DB_KEYS, key)) {
                        return key;
                    }
                    throw Error(`Unkown Document type: ${metadata.type}`);
                }
            }
        })();
        const embeddedKey = ((): EmbeddedKey | null => {
            switch (dbKey) {
                case "actors":
                    return "items";
                case "journal":
                    return "pages";
                case "tables":
                    return "results";
                default:
                    return null;
            }
        })();
        return { dbKey, embeddedKey };
    }
}
type DBKey = (typeof DB_KEYS)[number];
type EmbeddedKey = (typeof EMBEDDED_KEYS)[number];

type EmbeddedEntry = any;

type DBEntry = Omit<any, "pages" | "items" | "results"> & {
    folder?: string | null;
    items?: (any | string)[];
    pages?: (any | string)[];
    results?: (any | string)[];
};

type Sublevel<T> = AbstractSublevel<ClassicLevel<string, T>, string | Buffer | Uint8Array, string, T>;

interface DBFolder {
    name: string;
    sorting: string;
    folder: string | null;
    type: any;
    _id: string;
    sort: number;
    color: string | null;
    flags: object;
    _stats: {
        systemId: string | null;
        systemVersion: string | null;
        coreVersion: string | null;
        createdTime: number | null;
        modifiedTime: number | null;
        lastModifiedBy: string | null;
    };
}

interface LevelDatabaseOptions<T> {
    packName: string;
    dbOptions?: DatabaseOptions<string, T>;
}

function tupleHasValue<A extends readonly unknown[]>(array: A, value: unknown): value is A[number] {
    return array.includes(value);
}

export { DBFolder, LevelDatabase };
