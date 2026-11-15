import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

const contractPath = fileURLToPath(new URL('./src/prisma/contract.prisma', import.meta.url));
const orm = ormConfig({
  contract: './src/prisma/contract.prisma',
  db: {
    connection: process.env['DATABASE_URL']!,
  },
});

const source = orm.contract!.source;

export default definePrismaConfig({
  orm: {
    ...orm,
    contract: {
      ...orm.contract,
      source: {
        ...source,
        load: (context: Parameters<typeof source.load>[0]) =>
          source.load({ ...context, resolvedInputs: [contractPath] }),
      },
    },
  },
});
