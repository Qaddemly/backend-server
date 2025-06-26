import * as redis from 'redis';

export const redisClient = process.env.REDIS_PASSWORD
    ? redis.createClient({
          username: process.env.REDIS_USERNAME,
          password: process.env.REDIS_PASSWORD,
          socket: {
              host: process.env.REDIS_HOST,
              port: parseInt(process.env.REDIS_PORT),
          },
      })
    : redis.createClient({
          socket: {
              host: process.env.REDIS_HOST,
              port: parseInt(process.env.REDIS_PORT),
          },
      });
