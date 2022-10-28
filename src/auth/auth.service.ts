import { verifyMessage } from '@ethersproject/wallet';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class AuthService {
  constructor(
    private jwtTokenService: JwtService,
  ) {}

    /**
     * Verify wallet and return signer address
     * @params message, signature and address
     * @return signer address
     */
    async verifyWalletAndReturnSignerAddress(message: string,signature: string, address: string)
    {
      try {
        const signerAddr = await verifyMessage(message, signature);
        if (signerAddr != address) {
            return false;
        }
        return signerAddr;
      } catch (error)
      {
        throw new BadRequestException(error);
      }
    }
  

    /**
     * Validate user and return signer address or null value
     * @params message, signature and address
     * @return signer address
     */
  async validateUser(message: string, signature: string, address: string): Promise<any>   {
      const signerAddress = await this.verifyWalletAndReturnSignerAddress(message, signature, address);
      if(signerAddress) 
      {
        return signerAddress;
      }
      return null;
  }

    /**
     * Generate User Access Token
     * @params message, signature and address
     * @return access token
     */
  async generateUserAccessToken(message: string, signature: string, address: string) {
    const payload = {
      address: address,
      signature: signature,
      message: message 
    };

    return {
      access_token: this.jwtTokenService.sign(payload, { secret: process.env.JWT_SECRET }),
    };
  }
}