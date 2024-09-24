import {plainToInstance} from 'class-transformer';
import {IsNumber, IsString, validateSync} from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  NODE_PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  EXPIRATION: string;

  @IsString()
  ISSUER_BASE_URL: string;

  @IsString()
  AUDIENCE: string;

  @IsString()
  ALGO: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if(errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig
}