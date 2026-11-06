import { auth } from "@backend/api/services/auth";

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())
export const OpenAPI = {
    getPaths: (prefix = '/auth/api') =>
        getSchema().then(({ paths }) => {
            const reference: typeof paths = Object.create(null)
            for (const path of Object.keys(paths)) {
              reference[prefix + path] = paths[path]!
              for (const op of Object.values<any>(paths[path]!)) {
                  op.tags = op.tags?.map((t: string) => (t === "Default" ? "Auth" : t))
              }
            }
            return reference
        }) as Promise<any>,
    components: getSchema().then(({ components }) => components) as Promise<any>
} as const