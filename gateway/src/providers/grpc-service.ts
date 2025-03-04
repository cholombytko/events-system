import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { NatsService } from './nats-service';
import { EventSchema } from 'src/schemas/event.schema';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as reflection from '@grpc/reflection';
import { join } from 'path';

@Injectable()
export class GrpcService implements OnModuleInit, OnModuleDestroy {
  private grpcServer: grpc.Server;
  private readonly protoPath = join(
    __dirname,
    '../../..',
    'proto/gateway/gateway.proto',
  );

  constructor(
    @InjectPinoLogger(GrpcService.name) private readonly logger: PinoLogger,
    private readonly natsService: NatsService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.grpcServer = new grpc.Server();
    this.loadProtoAndSetupServer();
    this.startGrpcServer();
  }

  private loadProtoAndSetupServer() {
    const packageDefinition = protoLoader.loadSync(this.protoPath);
    const proto = grpc.loadPackageDefinition(packageDefinition) as any;
    const reflectionService = new reflection.ReflectionService(
      packageDefinition,
    );

    reflectionService.addToServer(this.grpcServer);
    this.grpcServer.addService(proto.gateway.GatewayService.service, {
      HandleEvent: this.handleGrpcEvent.bind(this),
    });
  }

  private handleGrpcEvent(call: any, callback: any) {
    this.logger.info(`Received event via gRPC: ${call.request}`);

    try {
      const rawData = JSON.parse(call.request.data);
      const event = EventSchema.parse({ ...call.request, data: rawData });

      this.natsService.publishToStream(event);
      callback(null, { message: 'Event published to NATS successfully' });
    } catch (error) {
      callback({ code: grpc.status.INVALID_ARGUMENT, details: error });
    }
  }

  private startGrpcServer() {
    const grpcServerUrl = this.configService.get<string>('GRPC_SERVER_URL');

    this.grpcServer.bindAsync(
      grpcServerUrl,
      grpc.ServerCredentials.createInsecure(),
      (error: Error | null, port: number) => {
        if (error) {
          this.logger.error('Failed to start gRPC server:', error);
        } else {
          this.logger.info(`gRPC server running on port ${port}`);
        }
      },
    );
  }

  async onModuleDestroy() {
    this.grpcServer.tryShutdown((error) => {
      if (error) {
        this.logger.error('Failed to shutdown gRPC server:', error);
      } else {
        this.logger.info('gRPC server shut down successfully');
      }
    });
  }
}
