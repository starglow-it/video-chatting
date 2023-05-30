import { Environmens } from "./common"

export type EnvironmentMigration = {
    [K in Environmens]?: () => Promise<void>
}

export type MappingKey = { list: any[], object: Record<string, any> }

export type Collection = {
    name: string,
    records: Record<string, any>[]
}