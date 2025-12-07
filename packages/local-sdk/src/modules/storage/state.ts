import Joi from 'joi'




export const schema: Schema = [
  {
    state: {
      isSentryDisabled: {
        schema: Joi.boolean()
      },
      uuid: {
        schema: Joi.string()
      },
      lastUsageDate: {
        schema: Joi.number()
      },
      projects: {
        collection: true,
        schema: Joi.object({
          gitOrigin: Joi.string().required(),
          pathInHostMachine: Joi.string().required(),
          apps: Joi.object().pattern(Joi.string(), Joi.object({
            task: Joi.string()
          })).required(),
          jobs: Joi.object().pattern(Joi.string(), Joi.object({
            commits: Joi.object().pattern(Joi.string(), Joi.object({
              tasks: Joi.object().pattern(Joi.string(), Joi.string())
            }))
          })).required(),
          tasks: Joi.object().pattern(Joi.string(), Joi.object({
            status: Joi.string(),
            startTime: Joi.number(),
            endTime: Joi.number(),
            logDocumetId: Joi.string()
          })).required()
        })
      },
    }
  }
]


export type Schema = SchemaStep[]

interface SchemaStep {
  state: {
    [key: string]: Entity,
  }
}

export interface Entity {
  collection?: boolean
  schema: any,
  // validator: (val: any) => boolean
  migrate?: (oldState: any) => any
}
