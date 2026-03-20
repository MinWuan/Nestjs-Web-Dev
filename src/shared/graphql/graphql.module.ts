import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { logger } from '@/common/logger/app.logger';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
      definitions: {
        path: join(process.cwd(), 'graphql/graphql.ts'),
      },
      subscriptions: {
        'graphql-ws': {
          path: '/graphql', // Đảm bảo WS cũng chạy trên path này
          onConnect: (context: any) => {
            const { connectionParams, extra } = context;
            //console.log('WebSocket connectionParams:', connectionParams);
            // Lấy token từ connectionParams do Client gửi lên
            //console.log('extra: ', extra);
            // Nhét token vào extra để dùng ở bước (context) bên dưới
            if (extra) {
              extra.connectionParams = connectionParams;
            }
          },
        },
      },

      path: '/graphql', // Đặt endpoint GraphQL tại root path
      sortSchema: true, // Sắp xếp schema theo thứ tự abc
      playground: false, // Tắt playground mặc định
      introspection: true, //cho phép introspection trong production
      debug: false,
      formatError: (error: GraphQLError): GraphQLFormattedError => {
        const { message, extensions, path, locations } = error;
        logger.error({
          message: `❄️ ➤ 🔴 ${message}`,
          trace: error,
        });

        let code = extensions?.code || 'ERROR';
        //Từ Apollo Server hoặc custom exception
        let statusCode = extensions?.statusCode || 400; //Từ custom exception
        let details = extensions?.details || null; //Từ custom exception

        return {
          message: message,
          extensions: {
            code: code,
            statusCode: statusCode,
            details: details, // Chi tiết lỗi (mảng validation hoặc message gốc)
            path: path || [],
            locations: locations,
            timestamp: new Date().toISOString(),
          },
        };
      },
      context: ({ req, extra }) => {
        // TH1: HTTP Request
        //console.log('headers from req: ', req?.headers);
        if (req) return { req };
        // TH2: WebSocket Connection
        //console.log('Token from extra: ', extra);
        if (extra) {
          const token =
            extra.connectionParams?.authorization ||
            extra.connectionParams?.Authorization ||
            '';
          return {
            req: {
              headers: {
                authorization: token,
                "x-signature": extra.connectionParams?.['x-signature'] || '',
              },
            },
          };
        }
      },
    }),
  ],
  exports: [GraphQLModule],
})
export class GraphqlModule {}
