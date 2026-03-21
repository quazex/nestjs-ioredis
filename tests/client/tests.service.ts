import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { InjectRedisClient } from '../../source/client/client.decorators'
import { TTestingDocument } from './tests.types'

@Injectable()
export class TestingRedisClientService {
  constructor(@InjectRedisClient() private readonly client: Redis) {}

  public async write(document: TTestingDocument): Promise<void> {
    const value = JSON.stringify(document)
    await this.client.set(document.id, value)
  }

  public async read(id: string): Promise<TTestingDocument | null> {
    const value = await this.client.get(id)
    if (typeof value === 'string') {
      return JSON.parse(value) as TTestingDocument
    }
    return null
  }

  public async ping(): Promise<boolean> {
    const reply = await this.client.ping()
    return reply === 'PONG'
  }
}
