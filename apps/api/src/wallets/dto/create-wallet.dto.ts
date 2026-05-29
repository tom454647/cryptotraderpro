import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Chain } from '@prisma/client';

/**
 * Input for adding a watch-only wallet. Note there is deliberately NO
 * isWatchOnly field — the service forces it true. A client cannot ask for
 * a non-watch-only wallet; that's a MiCAR invariant enforced at write time.
 */
export class CreateWalletDto {
  @IsString()
  @MinLength(26) // shortest plausible address (Solana min ~32, EVM 42)
  @MaxLength(64)
  address!: string;

  @IsEnum(Chain)
  chain!: Chain;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  label?: string;
}
