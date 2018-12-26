import { IncomingMessage, ServerResponse } from 'http'
import { ParsedUrlQuery } from 'querystring'
import { parse } from 'url'

interface StringMap {
  [key: string]: string
}

interface Build {
  src: string
  use: string
  config?: StringMap
}

type HTTPVerbs =
  | 'HEAD'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'OPTIONS'
  | 'CONNECT'
  | 'TRACE'

type ZeitRegion = 'sfo1' | 'bru1' | 'gru1' | 'iad1'

interface Route {
  src: string
  dest: string
  methods?: HTTPVerbs
  headers?: StringMap
  status?: number
}

interface NowForGithubOptions {
  enabled: boolean
  autoAlias: boolean
  silent: boolean
  autoJobCancelation: boolean
}

interface NowConfig {
  version: number
  name?: string
  alias?: string | string[]
  env?: StringMap
  build?: {
    env: StringMap
  }
  builds?: Build[]
  routes?: Route[]
  regions?: ZeitRegion[]
  public?: boolean
  github?: Partial<NowForGithubOptions>
}

export function buildConfig(query: ParsedUrlQuery) {
  return Object.entries(query).reduce(
    (acc: NowConfig, [key, value]: [string, any]) => {
      switch (key) {
        case 'version':
          acc.version = Number.parseInt(value, 10)
          break
        case 'name':
          acc.name = value
          break
        case 'alias':
          {
            try {
              acc.alias = JSON.parse(value) // try to parse as array
            } catch (_) {
              acc.alias = value // assign as string
            }
          }
          break
        case 'builds':
        case 'routes':
        case 'regions':
          {
            const parsed = Array.isArray(value)
              ? value.map(v => {
                  try {
                    return JSON.parse(v)
                  } catch (_) {
                    return v
                  }
                })
              : JSON.parse(value)

            if (Array.isArray(parsed)) {
              acc[key] = parsed
            } else {
              acc[key] = [parsed]
            }
          }
          break
        case 'public':
        case 'env':
        case 'build':
        case 'github':
          acc[key] = JSON.parse(value)
          break
        default:
      }

      return acc
    },
    {
      public: false,
      version: 2
    }
  )
}

export default function(req: IncomingMessage, res: ServerResponse) {
  let response
  let statusCode

  try {
    const { query } = parse(req.url as string, true)
    const config: NowConfig = buildConfig(query)

    response = JSON.stringify(config, null, 2)
    statusCode = 200
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(`Error occured: url: ${req.url}\n${e}`)

    response = JSON.stringify(
      {
        error: e.message,
        status: 500
      },
      null,
      2
    )
    statusCode = 500
  }

  res.writeHead(statusCode, {
    'content-length': Buffer.byteLength(response, 'utf8')
  })
  res.end(response)
}
