import { Test, TestingModule } from '@nestjs/testing'
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis'
import { RedisClientModule } from '../../source/client/client.module'
import { TestingRedisClientService } from './tests.service'

export class TestingRedisClientFactory {
  private _testing: TestingModule
  private _container: StartedRedisContainer

  public async init(): Promise<void> {
    const tContainer = new RedisContainer('redis:7.2.1')
    this._container = await tContainer.withReuse().start()

    const tModule = Test.createTestingModule({
      imports: [
        RedisClientModule.forRoot({
          host: this._container.getHost(),
          port: this._container.getPort(),
          password: this._container.getPassword(),
        }),
      ],
      providers: [
        TestingRedisClientService,
      ],
    })

    this._testing = await tModule.compile()
    this._testing = await this._testing.init()

    this._testing.enableShutdownHooks()
  }

  public async close(): Promise<void> {
    await this._testing.close()
    await this._container.stop()
  }

  public get service(): TestingRedisClientService {
    return this._testing.get(TestingRedisClientService)
  }
}
